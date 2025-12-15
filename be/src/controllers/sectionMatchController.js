import * as sectionMatchService from "../services/sectionMatchService.js";

export const getSectionsForMatch = async (req, res) => {
  const matchId = Number(req.params.matchId);

  // validate
  if (Number.isNaN(matchId)) {
    return res.status(400).json({
      message: "matchId không hợp lệ",
    });
  }
  try {
    const sections = await sectionMatchService.getSectionsByMatch(matchId);
    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (err) {
    console.error("getSectionsForMatch error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Lỗi server",
    });
  }
};

export const updateSectionMatches = async (req, res) => {
  try {
    const matchId = Number(req.params.matchId);
    const { sections } = req.body; 
    
    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ message: "Thiếu dữ liệu sections" });
    }
    const updated = await sectionMatchService.updateSectionMatches(matchId, sections);
    res.json({ message: "Cập nhật SectionMatch thành công", updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
