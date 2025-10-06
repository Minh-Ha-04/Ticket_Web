import * as seatService from "../services/seatService.js";

export const getAllSeats =  async(req,res)=>{
    try{
        const {sectionId} = req.query;
        const seats = await seatService.getAllSeats(sectionId);
        res.json(seats);
    }
    catch(err)
    {
        err.json(500).json({message:err.message});
    }
}

export const createSeat = async(req,res)=>{
    try{
        const {number,sectionId,isAvailable} = req.body;
        const seat = await seatService.createSeat({number,sectionId,isAvailable});
        res.status(201).json(seat);
    }
    catch(err)
    {
        err.json(500).json({message:err.message});
    }
}

export const updateSeat = async(req,res)=>{
    try{
        const {id} = req.params;
        const {number,sectionId,isAvailable} = req.body;
        const seat = await seatService.updateSeat(id,{number,sectionId,isAvailable});
        res.json(seat)
    }
    catch(err)
    {
        err.json(500).json({message:err.message});
    }
}
