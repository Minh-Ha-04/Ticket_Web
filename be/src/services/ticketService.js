import dotenv from "dotenv";
import models from "../models/index.js";
import sequelize from "../config/db.js"
import cloudinary from "../utils/cloudinary.js";
const { Match,  Ticket, Seat,Section  } = models;

dotenv.config();

const stadiumId = process.env.HOME_STADIUM_ID;

export const generateTicketsForHomeTeam = async (matchId,file,sections) => {
  return sequelize.transaction(async (transaction) => {
    const match = await Match.findByPk(matchId);
    if (!match) throw new Error("Không tìm thấy trận đấu");
    let totalTickets = 0;
    console.log("File nhận được ở service:", file?.path);
    await Promise.all(
      sections.map(async (section) => {
        const seats = await Seat.findAll({ where: { sectionId: section.sectionId } });
        const tickets = seats.map((seat) => ({
          matchId,
          sectionId : section.sectionId,
          seatId: seat.id,
          price: section.price,
          status: "available",
        }));
        await Ticket.bulkCreate(tickets, { transaction });
        totalTickets += tickets.length;
      })
    );
    let posterUrl = match.poster;
    let posterPublicId = match.posterPublicId;
    if (file) {
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "match_posters",
      });
      posterUrl = upload.secure_url;
      posterPublicId = upload.public_id;
    }
    await match.update(
      {
        isTicketCreated: true,
        poster: posterUrl,
        posterPublicId: posterPublicId,
      },
      { transaction }
    );
    return { totalTickets };
  });
};


export const updateTicketForMatch = async (matchId, file, sections) => {
  return sequelize.transaction(async (transaction) => {
    const match = await Match.findByPk(matchId);
    if (!match) throw new Error("Không tìm thấy trận đấu");
    let posterUrl = match.poster;
    let posterPublicId = match.posterPublicId;
    if (file) {
      if (match.posterPublicId) {
        await cloudinary.uploader.destroy(match.posterPublicId);
      }

      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "match_poster",
      });

      posterUrl = upload.secure_url;
      posterPublicId = upload.public_id;
    }
    if (sections && sections.length > 0) {
      for (const section of sections) {
        const seats = await Seat.findAll({
          where: { sectionId: section.sectionId },
          attributes: ["id"],
          transaction,
        });
        const seatIds = seats.map((seat) => seat.id);

        await Ticket.update(
          { price: section.price },
          {
            where: { matchId, seatId: seatIds },
            transaction,
          }
        );
      }
    }
    await match.update(
      {
        poster: posterUrl,
        posterPublicId,
      },
      { transaction }
    );
    return { posterUrl, totalSectionsUpdated: sections?.length || 0 };
  });
};


export const deleteTicketForMatch = async(matchId)=>{
  return sequelize.transaction(async(transaction)=>{
    const match = await Match.findByPk(matchId);

    const deletedCount = await Ticket.destroy({
      where :{ matchId},
      transaction,
    })

    if(match.posterPublicId)
    {
      await cloudinary.uploader.destroy(match.posterPublicId);
    }

    await match.update(
      {
        isTicketCreated : false,
        poster : null,
        posterPublicId: null,
      },
      {transaction}
    );
    return { deletedCount };
  })
}

export const getTicketsBySectionAndMatch = async (sectionId, matchId) => {
  const tickets = await Ticket.findAll({
    where: { sectionId, matchId },
    include: [
      {
        model: Seat,
        as: "seat",
        attributes: ["id", "number", "isAvailable"],
      },
    ],
    attributes: ["id", "price", "status"],
  });
  return tickets;
};

export const getTicketPriceByMatch = async (matchId) => {
  const tickets = await Ticket.findAll({
    where: { matchId },
    include: [
      {
        model: Seat,
        as : "seat",
        include: {
          model: Section,
          as :"section",
          attributes: ["id", "name", "seatCount"],
        },
      },
        {
          model : Match,
          as : "match",
          attributes :["poster"],
        },
    ]
    });

  if (!tickets || tickets.length === 0) return [];

  const sectionMap = {};
  tickets.forEach((ticket) => {
    const section = ticket.seat.section;
    if (!sectionMap[section.id]) {
      sectionMap[section.id] = {
        id: section.id,
        name: section.name,
        seatCount: section.seatCount,
        price: ticket.price,
      };
    }
  });

  const match_poster = tickets[0]?.match ?  tickets[0].match.poster : null;
  const sortedSections = Object.values(sectionMap).sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { numeric: true })
  );


  return {
    match_poster: match_poster,
    sections: sortedSections,
  };
};


export const getTicketSoldByMatch = async(matchId) =>{
  const sections = await Section.findAll({
    where : {stadiumId},
    attributes : ["id","name"],
  });

  const stats = await Promise.all(
    sections.map(async(section)=>{
      const totalTickets = await Ticket.count({
        where : {sectionId : section.id, matchId},
      });

      const soldTickets = await Ticket.count({
        where: { sectionId: section.id, status: "sold" , matchId},
      });

      const availableTickets =  totalTickets - soldTickets ;

      return {
        sectionId : section.id,
        sectionName : section.name,
        totalTickets,
        soldTickets,
        availableTickets
      };
    })
  );
  return stats;
}