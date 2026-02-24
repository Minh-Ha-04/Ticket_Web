import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import cron from "node-cron";
import { releaseHeldTickets } from "./services/ticketService.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Mở kết nối database
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Khởi chạy server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    let isRunning = false;
    cron.schedule("* * * * *", async () => {
      if (isRunning) return;
      isRunning = true;
      try {
        await releaseHeldTickets(); 
      } catch (err) {
        console.error("Error in releaseHeldTickets:", err.message);
      } finally {
        isRunning = false;
      }
    });

  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};

startServer();
