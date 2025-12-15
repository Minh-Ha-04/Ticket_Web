import * as matchService from "../services/matchService.js";

export const getAllMatches = async(req,res)=>{
    try{
        const matches = await matchService.getAllMatches();
        res.json(matches);
    }
    catch(err)
    {
        res.status(500).json({message : err.message});
    }
}

export const getMatchById = async(req,res)=>{
    try{
        const {id}= req.params;
        const match = await matchService.getMatchById(id);
        res.json(match);
    }
    catch(err)
    {
        res.status(500).json({message : err.message});
    }
}

    export const creatMatch = async(req,res)=>{
        try{
            const {homeTeamId,awayTeamId,matchDate,stadiumId}= req.body;
            const match = await matchService.createMatch({homeTeamId,awayTeamId,matchDate,stadiumId});
            res.status(201).json(match);
        }
        catch(err)
        {
            res.status(500).json({message : err.message});
        }
    }

export const updateMatch = async(req,res)=>{
    try {
        const {id} = req.params;
        const {homeTeamId,awayTeamId,matchDate,stadiumId, status} = req.body;
        const match = await matchService.updateMatch(id,{homeTeamId,awayTeamId,matchDate,stadiumId,status});
        res.status(201).json(match);
    }
    catch(err)
    {
        res.status(500).json({message : err.message});
    }
}

export const cancelMatch = async(req,res)=>{
    try{
        const {id} = req.params;
        await matchService.cancelMatch(id);
        res.json({message:"Delete Match Successfully"});
    }
    catch(err)
    {
        res.status(500).json({message : err.message});
    }
}