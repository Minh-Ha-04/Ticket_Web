import * as stadiumController from "../controllers/stadiumController.js";
import express from "express";
// import auth from "../middlewares/auth.js"
const router = express.Router();

router.get("/",stadiumController.getAllStadiums);
router.post("/",stadiumController.createStadium);
router.put("/:id",stadiumController.updateStadium);
router.delete("/:id",stadiumController.deleteStadium);

export default router ;