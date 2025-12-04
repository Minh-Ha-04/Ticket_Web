import * as pictureController from "../controllers/pictureController.js";

import upload  from "../middlewares/upload.js";
import express from "express";

const route = express.Router();

route.post("/", upload.single("image"), pictureController.createPicture);

route.put("/:id", upload.single("image"), pictureController.updatePicture);

route.delete("/:id", pictureController.deletePicture);

route.get("/",pictureController.getPictures);

export default route;