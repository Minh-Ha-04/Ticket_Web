
import { generateToken } from "../utils/jwt.js";

import * as authService from "../services/authService.js";
import models from "../models/index.js";

const {User} = models;
export const register = async(req,res)=>{
  try {
    const {username,email,password} = req.body;

    if(!username||!email||!password){
      return res.status(400).json({message :"Please enter complete information!!"});
    }
    const newUser = await authService.register(username,email,password);
    const {password:_, ...userData} = newUser.dataValues;
    return res.status(201).json({
      message:"Register sucessfully",
      user :userData,
    })
  }
  catch (error) {
    return res.status(400).json({
      message : error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Thiếu token xác minh." });

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ message: "Token không hợp lệ." });

    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: "Xác minh email thành công! Bạn có thể đăng nhập." });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi xác minh email", error: error.message });
  }
};

export const login = async(req,res) => {
  try{
    const {username, password } = req.body;
    const data = await authService.login(username,password);
    res.status(200).json(data);
  }
  catch(error)
  {
    res.status(400).json({message : error.message});
  }
}

export const logout = async (req, res) => {
  try {
    res.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user);
    res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.CLIENT_URL}/login-failed`);
  }
};
