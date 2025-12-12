import models from "../models/index.js"


import bcrypt from "bcrypt";

const {User } =models;

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ["password", "verificationToken"] }
        });

        res.json({ status: "success", data: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username, phone } = req.body;

        await User.update(
            { username, phone },
            { where: { id: req.user.id } }
        );

        res.json({ status: "success", message: "Cập nhật thành công!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id);

        const match = await bcrypt.compare(oldPassword, user.password);

        if (!match) return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });

        const hashed = await bcrypt.hash(newPassword, 10);

        await User.update(
            { password: hashed },
            { where: { id: user.id } }
        );

        res.json({ status: "success", message: "Đổi mật khẩu thành công!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

export const createUser = async (req, res) => {
  const { username, email, role, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    role,
    password: hash,
  });

  res.json(user);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  await User.update({ username, email, role }, { where: { id } });
  res.json({ message: "Updated" });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  res.json({ message: "Deleted" });
};
