// controllers/teamController.ts
import * as teamService from "../services/teamService.js";
import cloudinary from "../utils/cloudinary.js";

export const createTeam = async (req, res) => {
  try {
    console.log("===== CREATE TEAM REQUEST =====");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, shortname, stadiumId } = req.body;
    const file = req.file;

    const team = await teamService.createTeam({
      name,
      shortname,
      stadiumId,
      logo: file?.path || null,
      logoPublicId: file?.filename || null
    });

    console.log("TEAM CREATED:", team);
    res.status(201).json(team);
  } catch (error) {
    console.error("🔥 ERROR createTeam:", error);
    res.status(500).json({ message: error.message || "Create team failed" });
  }
};


export const updateTeam = async (req, res) => {
  try {
    console.log("===== UPDATE TEAM REQUEST =====");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const id = req.params.id;
    const team = await teamService.getTeamById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const file = req.file;

    if (file && team.logoPublicId) {
      await cloudinary.uploader.destroy(team.logoPublicId);
    }

    const updateData = {
      ...req.body,
      ...(file && { logo: file.path, logoPublicId: file.filename })
    };

    const updatedTeam = await teamService.updateTeam(id, updateData);

    console.log("TEAM UPDATED:", updatedTeam);
    res.json(updatedTeam);
  } catch (error) {
    console.error("🔥 ERROR updateTeam:", error);
    res.status(500).json({ message: error.message || "Update team failed" });
  }
};


export const deleteTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const team = await teamService.getTeamById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });


    if (team.logoPublicId) {
      await cloudinary.uploader.destroy(team.logoPublicId);
    }

    await teamService.deleteTeam(id);
    console.log("TEAM DELETED:", id);
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("🔥 ERROR deleteTeam:", error);
    res.status(500).json({ message: error.message || "Delete team failed" });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await teamService.getAllTeams(page, pageSize);
    res.json(result);
  } catch (error) {
    console.error(" ERROR getAllTeams:", error);
    res.status(500).json({ message: error.message || "Get teams failed" });
  }
};

export const getTeamById = async (req, res) => {
    try {
      const id = req.params.id;
      const team = await teamService.getTeamById(id);
      if (!team) return res.status(404).json({ message: "Team not found" });
      res.json(team);
    } catch (error) {
      console.error("🔥 ERROR getTeamById:", error);
      res.status(500).json({ message: error.message || "Get team failed" });
    }
};