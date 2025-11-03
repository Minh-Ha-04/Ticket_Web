// src/utils/releaseHeldTickets.js
import Ticket from "../models/ticket.js";
import Booking from "../models/booking.js";
import { Op } from "sequelize";

export const releaseHeldTickets = async () => {
  const now = new Date();

  // Lấy các vé bị giữ nhưng đã hết hạn
  const expiredTickets = await Ticket.findAll({
    where: {
      status: "held",
      holdExpiresAt: { [Op.lt]: now },
    },
  });

  for (const ticket of expiredTickets) {
    const bookingId = ticket.bookingId;
    // Cập nhật vé về available
    await ticket.update({
      status: "available",
      bookingId: null,
      holdExpiresAt: null,
    });

    // Cập nhật booking thành expired nếu tất cả vé của nó đều đã hết hạn
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
