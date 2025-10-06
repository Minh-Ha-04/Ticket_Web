import Section from "../models/section.js";
import Stadium from "../models/stadium.js";
import Seat from "../models/seat.js";


export const getAllSections = async(stadiumId)=>{
    return await Section.findAll({
        where :{stadiumId},
        include :[
            {
                model :Stadium,
                attributes : ["name"],
            }
        ],
        order:[["name","ASC"]],
    });
}

export const createSection = async(data)=>{

    const section = await Section.create(data);

    for (let i = 1 ; i<=data.seatCount;i++)
    {
        await Seat.create(
            {
                number:`${section.name}`-`${i}`,
                sectionId : section.id
            }
        );
    }

    return section;
}

export const updateSection = async(id,data)=>{
    const section = await Section.findByPk(id);
    if(!section) throw new Error("Section can't find");
    return await section.update(data);
}

export const deleteSection = async(id,data)=>{
    const section = await Section.findByPk(id);
    if(!section) throw new Error("Section can't find");
    return await section.destroy(data);
}

