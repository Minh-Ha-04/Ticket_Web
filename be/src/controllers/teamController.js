import * as teamService from "../services/teamService.js";
import cloudinary from "../utils/cloudinary.js";

export const createTeam = async (req, res) => {
  try {
    const { name, shortname, stadiumId } = req.body;
    const file = req.file;

    const team = await teamService.createTeam({
      name,
      shortname,
      stadiumId,
      logo: file?.path || null,
      logoPublicId: file?.filename || null
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message || "Tạo thất bại" });
  }
};


export const updateTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const team = await teamService.getTeamById(id);
    if (!team) {
      return res.status(404).json({ message: "Không tìm thấy đội" });
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
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const team = await teamService.getTeamById(id);
    if (!team) return res.status(404).json({ message: "Không tìm thấy đội" });
    if (team.logoPublicId) {
      await cloudinary.uploader.destroy(team.logoPublicId);
    }
    await teamService.deleteTeam(id);
    res.json({ message: "Xóa đội thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Xóa đội thất bại" });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await teamService.getAllTeams(page, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || "Lấy các đội thất bại" });
  }
};

export const getTeamById = async (req, res) => {
    try {
      const id = req.params.id;
      const team = await teamService.getTeamById(id);
      if (!team) return res.status(404).json({ message: "Không tìm thấy đội" });
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: error.message || "Lấy các đội thất bại" });
    }
};