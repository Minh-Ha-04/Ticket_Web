import * as seatService from "../services/seatService.js";

export const getSeatsInSection =  async(req,res)=>{
    try{
        const {sectionId} = req.params;
        const seats = await seatService.getSeatsInSection(sectionId);
        res.json(seats);
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}
