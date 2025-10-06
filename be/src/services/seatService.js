import Seat from "../models/seat";
import Section from "../models/section";

export const getAllSeats = async(sectionId) =>{
    return await Seat.findAll({
        where : {sectionId},
        include : [
            {
                model:Section,
                attributes:["name"],
            }
        ],
    });
}

export const createSeat = async(data)=>{
    return await Seat.create(data);
}

export const updateSeat = async(id , data )=>{
    const seat = Seat.findByPk(id);
    if(!seat) throw new Error("Can't find seat");
    return await Seat.update(data);
}
