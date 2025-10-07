import sequelize from "../config/db.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const __dirname = path.resolve();
const models = {};

const files = fs
  .readdirSync(path.join(__dirname, "src/models"))
  .filter((file) => file.endsWith(".js") && file !== "index.js"); // Lọc các file model, bỏ qua index.js

for (const file of files) {
  const model = (await import(`./${file}`)).default;
  models[model.name] = model; // Sử dụng tên model làm key
}

Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
  } 
}); // Thiết lập quan hệ giữa các model 



(async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log(
        "Database synced successfully at",
        new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      );
    } catch (error) {
      console.error("Error syncing database:", error);
    }
  })();

  export default models;
  export { sequelize };