import * as sectionService from "../services/sectionService.js";

export const getAllSections = async (req, res) => {
  const stadiumId = Number(req.params.stadiumId);
  if (Number.isNaN(stadiumId)) {
    return res.status(400).json({ message: "stadiumId không hợp lệ" });
  }
  try {
    const sections = await sectionService.getAllSections(stadiumId);
    res.status(200).json({ success: true, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const createSection = async (req, res) => {
  try {
    const section = await sectionService.createSection(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, seatCount } = req.body;
    const section = await sectionService.updateSection(id, { name, seatCount });    
    res.json({ success: true, data: section });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await sectionService.deleteSection(id);
    res.json({ success: true, message: "Xóa section thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
