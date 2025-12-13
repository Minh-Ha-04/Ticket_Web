import models from "../models/index.js";
import { Op } from "sequelize";

const {Ticket,Booking} = models;

export const releaseHeldTickets = async () => {
  const now = new Date();
  const expiredTickets = await Ticket.findAll({
    where: {
      status: "held",
      holdExpiresAt: { [Op.lt]: now },
    },
  });
  for (const ticket of expiredTickets) {
    const bookingId = ticket.bookingId;
    await ticket.update({
      status: "available",
      bookingId: null,
      holdExpiresAt: null,
    });
    if (bookingId) {
      const remainingTickets = await Ticket.count({
        where: { bookingId, status: { [Op.not]: "available" } },
      });
      if (remainingTickets === 0) {
        await Booking.update(
          { status: "expired" },
          { where: { id: bookingId } }
        );
      }
    }
  }
};
