import * as teamController from "..//controllers/teamController.js";
import upload from "../middlewares/upload.js";
import express from "express";
import { auth } from "../middlewares/auth.js";
const route = express.Router();

route.get("/:id",teamController.getTeamById);
route.get("/",teamController.getAllTeams);
route.post("/",auth(['admin']),upload.single("logo"),teamController.createTeam);
route.put("/:id",auth(['admin']),upload.single("logo"),teamController.updateTeam);
route.delete("/:id",auth(['admin']),teamController.deleteTeam);

export default route;
