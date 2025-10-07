import dotenv from "dotenv";
import models from "../models/index.js";

const {Match, Section, Ticket, Seat, Stadium } = models;

dotenv.config();

const HOME_STADIUM_ID = process.env.HOME_STADIUM_ID || 1;


export const generateTicketsForHomeTeam = async (matchId) => {
  try {
    const match = await Match.findByPk(matchId);
    if (!match) throw new Error("Không tìm thấy trận đấu");

    const stadiumId = HOME_STADIUM_ID;

    const stadium = await Stadium.findByPk(stadiumId);

    const sections = await Section.findAll({ where: { stadiumId } });

    for (const section of sections) {
      const seats = await Seat.findAll({ where: { sectionId: section.id } });

      const tickets = seats.map((seat) => ({
        matchId,
        seatId: seat.id,
        price: section.price,
        status: "available",
      }));
      await Ticket.bulkCreate(tickets);
    }

    console.log(`Đã tạo vé cho trận đấu ${matchId} tại sân ${stadium.name}`);
  } catch (err) {
    console.error("Lỗi khi tạo vé:", err.message);
    throw err;
  }
};
