import dotenv from "dotenv";
import models from "../models/index.js";
import sequelize from "../config/db.js"
import cloudinary from "../utils/cloudinary.js";
import { where } from "sequelize";
const { Match, Section, Ticket, Seat, Stadium } = models;

dotenv.config();

const HOME_STADIUM_ID = process.env.HOME_STADIUM_ID ;

export const generateTicketsForHomeTeam = async (matchId,file) => {
  return sequelize.transaction(async (transaction) => {
    const match = await Match.findByPk(matchId);
    if (!match) throw new Error("Không tìm thấy trận đấu");

    const stadium = await Stadium.findByPk(HOME_STADIUM_ID);
    const sections = await Section.findAll({ where: { stadiumId: HOME_STADIUM_ID } });

    let totalTickets = 0;

    for (const section of sections) {
      const seats = await Seat.findAll({ where: { sectionId: section.id } });
      const tickets = seats.map((seat) => ({
        matchId,
        seatId: seat.id,
        price: section.price,
        status: "available",
      }));

      await Ticket.bulkCreate(tickets, { transaction });
      totalTickets += tickets.length;
    }
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
    console.log(` Đã tạo ${totalTickets} vé cho trận ${matchId} tại sân ${stadium.name}`);
    return { totalTickets };
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