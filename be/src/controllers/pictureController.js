import models from "../models/index.js";
import cloudinary from "../utils/cloudinary.js";

const { Picture } = models;


export const createPicture = async (req, res) => {
  try {

    const { type } = req.body; // FE gửi type

    if (!type) {
      return res.status(400).json({ message: "Type của ảnh là bắt buộc" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn ảnh" });
    }
    const newPicture = await Picture.create({
        type,
        url: req.file.path,          
        publicId: req.file.filename 
    });

    res.json({
      message: "Thêm ảnh thành công",
      data: newPicture
    });
  } catch (err) {
    console.error(" ERROR createPicture:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const updatePicture = async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body;
  
      const picture = await Picture.findByPk(id);
      if (!picture) return res.status(404).json({ message: "Không tìm thấy ảnh" });
  
      // Xóa ảnh cũ trên cloudinary nếu có ảnh mới
      if (req.file) {
        await cloudinary.uploader.destroy(picture.publicId);
        picture.url = req.file.path;
        picture.publicId = req.file.filename;
      }
  
      if (type) picture.type = type; 
  
      await picture.save();
  
      res.json(picture);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  export const deletePicture = async (req, res) => {
    try {
      const { id } = req.params;
  
      const picture = await Picture.findByPk(id);
      if (!picture) return res.status(404).json({ message: "Không tìm thấy ảnh" });
  
      await cloudinary.uploader.destroy(picture.publicId);
      await picture.destroy();
  
      res.json({ message: "Đã xoá ảnh" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getPictures = async (req, res) => {
    try {
      const { type } = req.query;
  
      const whereCondition = {};

      if (type) {
        whereCondition.type = type;
      }
  
      const pictures = await Picture.findAll({
        where: whereCondition,
        order: [["createdAt", "DESC"]], 
      });
  
      return res.status(200).json({
        status: "success",
        count: pictures.length,
        data: pictures,
      });
    } catch (err) {
      console.error("getPictures ERROR:", err);
      return res.status(500).json({
        status: "error",
        message: "Lỗi server khi lấy hình ảnh",
      });
    }
  };
  