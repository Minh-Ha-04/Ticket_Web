import models, { sequelize } from "../models/index.js";
const { Booking, Ticket, User ,Seat } = models;




export const getBookingById = async(id) =>{
    const booking = await Booking.findByPk(id,
        {
            include : 
            [
                {model : Ticket , as : "tickets",attributes: ["id", "seatId", "price", "status","holdExpiresAt"],include: [
                    {
                      model: Seat,
                      as: "seat",
                      attributes: ["id", "number"], 
                    },
                  ],},
                {model : User, as :"user" , attributes: ["id", "username", "email"]}
            ],
        }
    );
    if(!booking) throw new Error ("Không tìm thấy đơn đặt vé.");
    return booking;
}


export const createBooking = async (userId, ticketIds) =>{
    return await sequelize.transaction(async(t)=>{
        const tickets = await Ticket.findAll({
            where : {id : ticketIds , status :"available"},
            transaction : t,
            lock : t.LOCK.UPDATE,
        });

        if (tickets.length != ticketIds.length )
        {
            throw new Error ("Một số vé không khả dụng hoặc đã được giữ.");
        }
        const matchId = tickets[0].matchId;
        const totalOriginal = tickets.reduce((sum,ticket)=> sum + ticket.price , 0);
        const newBooking = await Booking.create({
            userId,
            matchId,
            totalPrice : totalOriginal,
            status : "pending",
        },
        {transaction : t}
        );

        const holdExpiresAt = new Date(Date.now() + 15*60*1000);
        await Ticket.update(
            {
                status:"held",
                bookingId : newBooking.id,
                holdExpiresAt,
            },
            { where : {id : ticketIds},transaction : t}
        );
        return {newBooking , holdExpiresAt};
    })
}

export const deleteBooking = async( id) =>{
    return sequelize.transaction(async(t)=>{
        const booking = await Booking.findByPk( id, {transaction : t});
        if(!booking) throw new Error("Không tìm thấy booking.");

        if (booking.status !== "pending") {
            throw new Error("Chỉ có thể xóa đơn chưa thanh toán.");
        }

        await Ticket.update(
            {status : "available",bookingId : null},
            {where : { bookingId : id }, transaction : t }
        )

        await booking.destroy({transaction : t});
        return {message: "Đã xóa booking và hoàn vé."};
    })
}