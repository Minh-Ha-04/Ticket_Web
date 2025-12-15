import models, { sequelize } from "../models/index.js";
import { nanoid } from "nanoid";
import * as sectionMatchService from "./sectionMatchService.js";

const { Booking, Ticket, SectionMatch,Section,Match,Team,Stadium } = models;

export const createBooking = async (userId, matchId, items) => {
  // items = [{ sectionMatchId, quantity }]
  return await sequelize.transaction(async (t) => {

    const booking = await Booking.create(
      { userId, matchId, totalPrice: 0, status: "pending" },
      { transaction: t }
    );

    let totalPrice = 0;
    const tickets = [];

    for (const item of items) {
      const sm = await sectionMatchService.holdSeats(
        item.sectionMatchId,
        item.quantity,
        t
      );

      for (let i = 0; i < item.quantity; i++) {
        const ticket = await Ticket.create(
          {
            code: nanoid(10),
            bookingId: booking.id,
            sectionMatchId: sm.id,
            price: sm.price,
            status: 'held',
          },
          { transaction: t }
        );

        tickets.push(ticket);
        totalPrice += sm.price;
      }
    }

    booking.totalPrice = totalPrice;
    await booking.save({ transaction: t });

    return { booking, tickets };
  });
};

export const getBookingById = async (id) => {
  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: Ticket,
        as: "tickets",
        include: [
          {
            model: SectionMatch,
            as: "sectionMatch",
            include: [
              { model: Section, as: "section" },
              {
                model: Match,
                as: "match",
                include: [
                  { model: Team, as: "homeTeam" },
                  { model: Team, as: "awayTeam" },
                  { model: Stadium },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!booking) throw new Error("Không tìm thấy booking");
  return booking;
};

export const deleteBooking = async (id) => {
  return sequelize.transaction(async (t) => {
    const booking = await Booking.findByPk(id, {
      include: [{ model: Ticket, as: "tickets" }],
      transaction: t,
    });

    if (!booking) throw new Error("Booking không tồn tại");

    for (const ticket of booking.tickets) {
      await SectionMatch.increment(
        { availableSeats: 1 },
        { where: { id: ticket.sectionMatchId }, transaction: t }
      );
    }

    await Ticket.destroy({ where: { bookingId: id }, transaction: t });
    await booking.destroy({ transaction: t });

    return { message: "Đã hủy booking & hoàn vé" };
  });
};

export const getBookingByUserId = async (userId) => {
  return await Booking.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Ticket,
        as: "tickets",
        include: [
          {
            model: SectionMatch,
            as: "sectionMatch",
            include: [
              {
                model: Section,
                as: "section",
                attributes: ["id", "name"],
              },
              {
                model: Match,
                as: "match",
                attributes: ["id", "matchDate"],
                include: [
                  { model: Team, as: "homeTeam" },
                  { model: Team, as: "awayTeam" },
                  { model: Stadium },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
};
