import * as bookingService from "../services/bookingService.js";

export const getBookingById = async(req,res)=>{
    try{
        const {id} = req.params;
        const booking = await bookingService.getBookingById(id);
        res.json(booking);
    }
    catch(error)
    {
        res.status(404).json({message : error.message});
    }
};

export const getBookingByUserId = async (req, res) => {
    try {
      const userId = req.user.id; 
      const bookings = await bookingService.getBookingByUserId(userId);
      res.json({
        status: "success",
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
  
export const createBooking = async (req,res)=>{
    
    try {
        const userId = req.user.id;
        const {ticketIds} = req.body;
        if( !userId || !ticketIds || !Array.isArray(ticketIds) )
        {
            return res.status(400).json({ message: "Thiếu dữ liệu userId hoặc ticketIds " });
        }
        const booking =  await bookingService.createBooking(userId,ticketIds);
        res.status(201).json({
            message: "Tạo đơn đặt vé thành công. Vui lòng tiếp tục thanh toán.",
            booking,
        });
    }
    catch (error)
    {
        res.status(400).json({message: error.message});
    }
}

export const deleteBooking = async (req,res) =>{
    try {
        const {id} = req.params;
        const result = await bookingService.deleteBooking(id);
        res.json(result);
    }
    catch (error)
    {
        res.status(400).json({message : error.message});
    }
}

