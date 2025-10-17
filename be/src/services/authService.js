import bcrypt from "bcryptjs";

import models from "../models/index.js";

const {User} = models;

export const register = async (username , email ,password) =>{
    const existingUser = await User.findOne({
        where : {username},
    });

    if(existingUser)
    {
        throw new Error("Username already exists");
    }

    const existingEmail = await User.findOne({
        where : {email},
    });

    if(existingUser)
    {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await User.create({
        username,
        email,
        password : hashedPassword,
        role : "user",
    })
}