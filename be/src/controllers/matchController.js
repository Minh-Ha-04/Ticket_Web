import * as matchService from "../services/matchService.js";
import cloudinary from "../utils/cloudinary.js";
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

export const createMatch = async (req, res) => {
    try {
      const {
        homeTeamId,
        awayTeamId,
        matchDate,
        stadiumId,
      } = req.body;
  
      let posterUrl = null;
      let posterPublicId = null;
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "matches",
        });
        posterUrl = result.secure_url;
        posterPublicId = result.public_id;
      }
  
      const match = await matchService.createMatch({
        homeTeamId,
        awayTeamId,
        matchDate,
        stadiumId,
        poster: posterUrl,
        posterPublicId,
      });
  
      res.status(201).json(match);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
  
  

  export const updateMatch = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        homeTeamId,
        awayTeamId,
        matchDate,
        stadiumId,
        status,
      } = req.body;
  
      const oldMatch = await matchService.getMatchById(id);
  
      let posterUrl = oldMatch.poster;
      let posterPublicId = oldMatch.posterPublicId;
  
      if (req.file) {
        if (posterPublicId) {
          await cloudinary.uploader.destroy(posterPublicId);
        }
  
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "matches",
        });
  
        posterUrl = result.secure_url;
        posterPublicId = result.public_id;
      }
  
      const match = await matchService.updateMatch(id, {
        homeTeamId,
        awayTeamId,
        matchDate,
        stadiumId,
        status,
        poster: posterUrl,
        posterPublicId,
      });
  
      res.json(match);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
  
  
  export const cancelMatch = async (req, res) => {
    try {
      const { id } = req.params;
      await matchService.cancelMatch(id);
      res.json({ message: "Cancel Match Successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  