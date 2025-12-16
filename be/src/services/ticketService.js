import models from "../models/index.js";
import { Op } from "sequelize";
const { SectionMatch, Section,Ticket,Booking } = models;

export const getTicketInfoByMatch = async (matchId) => {
  const sectionMatches = await SectionMatch.findAll({
    where: { matchId },
    include: [
      {
        model: Section,
        as: "section",
        attributes: ["id", "name"]
      }
    ]
  });

  return sectionMatches.map(sm => ({
    sectionId: sm.section.id,
    sectionName: sm.section.name,
    price: sm.price,
    totalSeats: sm.totalSeats,
    soldSeats: sm.totalSeats - sm.availableSeats,
    availableSeats: sm.availableSeats
  }));
};



export const releaseHeldTickets = async () => {
  const now = new Date();

  const expiredTickets = await Ticket.findAll({
    where: {
      status: "held",
      holdExpiresAt: { [Op.lt]: now }, 
    },
  });

  if (expiredTickets.length === 0) return;

  const ticketsBySection = expiredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.sectionMatchId]) acc[ticket.sectionMatchId] = 0;
    acc[ticket.sectionMatchId] += 1;
    return acc;
  }, {});

  const ticketsByBooking = expiredTickets.reduce((acc, ticket) => {
    if (!ticket.bookingId) return acc;
    if (!acc[ticket.bookingId]) acc[ticket.bookingId] = [];
    acc[ticket.bookingId].push(ticket.id);
    return acc;
  }, {});

  await Ticket.sequelize.transaction(async (t) => {
    await Ticket.update(
      { status: "canceled" },
      { where: { id: expiredTickets.map(t => t.id) }, transaction: t }
    );
    for (const sectionMatchId in ticketsBySection) {
      await SectionMatch.increment(
        { availableSeats: ticketsBySection[sectionMatchId] },
        { where: { id: sectionMatchId }, transaction: t }
      );
    }

    // 3. Kiểm tra booking
    for (const bookingId in ticketsByBooking) {
      const remainingTickets = await Ticket.count({
        where: { bookingId, status: { [Op.not]: "canceled" } },
        transaction: t
      });

      if (remainingTickets === 0) {
        await Booking.update(
          { status: "canceled" },
          { where: { id: bookingId }, transaction: t }
        );
      }
    }
  });
};
