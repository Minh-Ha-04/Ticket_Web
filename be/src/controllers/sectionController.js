import * as sectionService from "../services/sectionService.js";

export const getAllSections = async(req,res) =>{
    try{
        const {stadiumId} = req.query;
        const sections = await sectionService.getAllSections(stadiumId);
        res.json(sections);
    }
    catch(err)
    {
        err.status(500).json({message : err.message});
    }
} 

export const createSection = async(req,res)=>{
    try{
        const {name,seatCount,price,stadiumId} = req.body;
        const section = await sectionService.createSection({name,seatCount,price,stadiumId});
        res.status(201).json(section);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

export const updateSection = async(req,res) =>{
    try{
        const {id} = req.params;
        const {name,seatCount,price,stadiumId}= req.body;
        const section = await sectionService.updateSection(id,{name,seatCount,price,stadiumId});
        res.json(section);
    }
    catch(err)
    {
        res.status(400).json({message:err.message});
    }
}

export const deleteSection = async(req,res) =>{
    try{
        const id = req.params;
        await sectionService.deleteSection(id);
        res.json({ message: "Delete  section successfully" });
    }
    catch(err)
    {
        res.status(400).json({message:err.message});
    }
}

