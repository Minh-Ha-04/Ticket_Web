import * as discountService from "../services/discountService.js";

export const createDiscount = async(req,res)=>{

    try {
        const discount = await discountService.createDiscount(req.body); 
        res.json(discount);
    }
    catch(error)
    {
        res.status(500).json({message : error.message});
    }
}

export const getDiscountsInMatch = async(req,res)=>{
    try {
        const {matchId} = req.params;
        const discounts = await discountService.getDiscountsInMatch(matchId);
        res.status(200).json(discounts);
    }
    catch(err)
    {
        res.status(500).json({ message: err.message });
    }
}

export const deleteDiscount = async (req, res) => {
    try {
      const { id } = req.params;
      await discountService.deleteDiscount(id);
      res.status(200).json({ message: "Xóa mã giảm giá thành công!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  export const validateDiscount = async (req, res) => {
    try {
        const { code, matchId } = req.params;

        const matchIdNumber = Number(matchId);

        const discount = await discountService.validateDiscount(code, matchIdNumber);

        if (!discount) {
            return res.status(404).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết lượt dùng" });
        }

        res.status(200).json(discount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const incrementUsage = async (req, res) => {
    try {
      const { discountId } = req.params;
      await discountService.incrementUsage(discountId);
      res.status(200).json({ message: "Cập nhật lượt sử dụng thành công" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};