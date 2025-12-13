import * as pictureController from "../controllers/pictureController.js";
import { auth } from "../middlewares/auth.js";
import upload  from "../middlewares/upload.js";
import express from "express";

const route = express.Router();

route.post("/",auth(['admin']), upload.single("image"), pictureController.createPicture);

route.put("/:id",auth(['admin']), upload.single("image"), pictureController.updatePicture);

route.delete("/:id",auth(['admin']), pictureController.deletePicture);

route.get("/",pictureController.getPictures);

export default route;