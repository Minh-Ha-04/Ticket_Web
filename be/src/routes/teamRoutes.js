import * as teamController from "..//controllers/teamController.js";
import upload from "../middlewares/upload.js";
import express from "express";

const route = express.Router();

route.get("/:id",teamController.getTeamById);
route.get("/",teamController.getAllTeams);
route.post("/",upload.single("logo"),teamController.createTeam);
route.put("/:id",upload.single("logo"),teamController.updateTeam);
route.delete("/:id",teamController.deleteTeam);

export default route;
