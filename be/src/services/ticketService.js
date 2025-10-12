import dotenv from "dotenv";
import models from "../models/index.js";
import sequelize from "../config/db.js"
import cloudinary from "../utils/cloudinary.js";
const { Match,  Ticket, Seat, Stadium,Section  } = models;

dotenv.config();

const HOME_STADIUM_ID = process.env.HOME_STADIUM_ID ;

export const generateTicketsForHomeTeam = async (matchId,file,sections) => {
  return sequelize.transaction(async (transaction) => {
    const match = await Match.findByPk(matchId);
    if (!match) throw new Error("Không tìm thấy trận đấu");
    const stadium = await Stadium.findByPk(HOME_STADIUM_ID);
    let totalTickets = 0;
    console.log("File nhận được ở service:", file?.path);
    await Promise.all(
      sections.map(async (section) => {
        const seats = await Seat.findAll({ where: { sectionId: section.sectionId } });
        const tickets = seats.map((seat) => ({
          matchId,
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

export const getTicketSectionsByMatch = async (matchId) => {
  const tickets = await Ticket.findAll({
    where: { matchId },
    include: {
      model: Seat,
      as : "seat",
      include: {
        model: Section,
        as :"section",
        attributes: ["id", "name", "seatCount"],
      },
    },
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

  return Object.values(sectionMap);
};