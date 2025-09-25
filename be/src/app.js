import express from "express";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/test", async (req , res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() as now");
        res.json({success: true, time: rows[0].now});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

export default app;