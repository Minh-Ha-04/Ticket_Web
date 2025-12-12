import bcrypt from  "bcrypt";
import crypto from "crypto";
import models from "../models/index.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/jwt.js";

const {User} = models;

export const register = async (username, email, password) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("Email already exists");
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
  
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      isActive: false,
      verificationToken,
    });
  
    // Gửi email xác minh
    const verifyLink = `${process.env.CLIENT_URL}/login-success?mode=verify&token=${verificationToken}`;
    const htmlContent = `
      <h3>Xác nhận đăng ký tài khoản</h3>
      <p>Chào ${username},</p>
      <p>Vui lòng nhấn vào liên kết sau để xác thực email của bạn:</p>
      <a href="${verifyLink}" target="_blank">${verifyLink}</a>
      <p>Liên kết này chỉ có hiệu lực trong 24h.</p>
    `;
    await sendEmail(email, "Xác nhận đăng ký tài khoản", htmlContent);
    return newUser;
  };

export const login = async(username, password) => {
    const user = await User.findOne({
        where :{username},
    });

    if(!user) {
        throw new Error("User don't exist");
    }

    const isPass = await bcrypt.compare(password,user.password);
    if(!isPass) {
        throw new Error("Incorrect password");
    }

    if(user.isActive ===false )
    {
        throw new Error("Account is locked or not activated ");
    }

    const token = generateToken(user);

    return {
        message : "Login successfully ",
        user : {
            id : user.id,
            username : user.username,
            email : user.email,
            role :user.role,
            avatar : user.avatar,
        },
        token,
    };
};

