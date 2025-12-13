export const checkOwner = (Model, ownerField = "userId") => {
    return async (req, res, next) => {
      try {
        const { id } = req.params;
  
        const record = await Model.findByPk(id);
  
        if (!record) {
          return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        }
  
        if (
          req.user.role !== "admin" &&
          record[ownerField] !== req.user.id
        ) {
          return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        req.record = record;
        next();
      } catch (error) {
        console.error("checkOwner error:", error);
        return res.status(500).json({ message: "Lỗi kiểm tra quyền sở hữu" });
      }
    };
  };
  