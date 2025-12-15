import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Mở kết nối database
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Đồng bộ models
    await sequelize.sync();

    // Khởi chạy server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};

startServer();
