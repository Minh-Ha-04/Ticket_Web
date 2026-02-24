import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import passport from "./config/passport.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(200).send("Server is running 🚀");
});

app.use("/api", router);

export default app;