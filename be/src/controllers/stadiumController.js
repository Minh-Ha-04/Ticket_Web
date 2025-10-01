import * as stadiumService from "../services/stadiumService.js";

export const getAllStadiums = async(req,res) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize)||10;
        const result = await stadiumService.getAllStadiums(page,pageSize);
        res.status(200).json(result);
    }
    catch(error){
        res.status(500).json({message : error.message || "Internal Server Error"});
    }
};

export const createStadium = async(req,res) => {
    try{
        const {name,capacity,isHome} = req.body;
        const newStadium = await stadiumService.createStadium({name,capacity,isHome});
        res.status(201).json(newStadium);
    }
    catch(error)
    {
        res.status(500).json({message : error.message || "Create Stadium Failed" });
    }
};

export const updateStadium = async(req,res) => {
    try{
        const {id} = req.params;
        const {name,capacity,isHome} = req.body;
        const updated = await stadiumService.updateStadium(Number(id),{name,capacity,isHome});
        res.json(updated);
    }
    catch(error)
    {
        res.status(500).json({message : error.message || "Update Stadium Failed"});
    }
};

export const deleteStadium = async(req,res) => {
    try{
        const {id} = req.params;
        await stadiumService.deleteStadium(Number(id));
        res.json({message:"Delete Stadium Successfully"});
    }
    catch(error)
    {
        res.status(500).json({message:error.message|| "Delete Stadium Failed"});
    }
};
