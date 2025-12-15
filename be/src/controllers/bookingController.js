import * as bookingService from "../services/bookingService.js";

export const getBookingById = async (req, res) => {
  const bookingId = Number(req.params.id);

  if (Number.isNaN(bookingId)) {
    return res.status(400).json({ message: "bookingId không hợp lệ" });
  }

  try {
    const booking = await bookingService.getBookingById(bookingId);
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await bookingService.getBookingByUserId(userId);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId, items } = req.body;

    if (!matchId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Thiếu matchId hoặc items",
      });
    }

    const { booking, tickets } = await bookingService.createBooking(
      userId,
      matchId,
      items
    );

    res.status(201).json({
      success: true,
      message: "Tạo booking thành công, vui lòng thanh toán",
      data: {
        booking,
        tickets,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  const bookingId = Number(req.params.id);

  if (Number.isNaN(bookingId)) {
    return res.status(400).json({ message: "bookingId không hợp lệ" });
  }

  try {
    const result = await bookingService.deleteBooking(bookingId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
