import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
    try {
      // Mở kết nối database
      await sequelize.authenticate();
      // Đồng bộ models
      await sequelize.sync();
      app.listen(PORT, () => {
        console.log(` Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Unable to connect to the database:", error.message);
    }
  };
  
  startServer();
  