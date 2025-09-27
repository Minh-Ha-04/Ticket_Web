import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateToken } from '../utils/jwt.js';
import nodemailer from 'nodemailer';

// Hàm gửi mail xác nhận 
const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const url = `${process.env.CLIENT_URL}/verify/${token}`;

    await transporter.sendMail({
        from: `"Football Ticket" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Xác nhận tài khoản",
        html: `
            <p>Chào bạn,</p>
            <p>Nhấn vào link dưới đây để xác nhận tài khoản:</p>
            <a href="${url}">${url}</a>
        `,
    });
};

export const register = async (req, res) => {
    try {
        const { username, email, password, role, phone } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user",
            phone,
            isActive: false,
        });

        const verifyToken = generateToken({
            id: newUser.id,
            role: newUser.role,
        });

        await sendVerificationEmail(email, verifyToken);

        res.status(201).json({
            message: "Đăng ký thành công, vui lòng kiểm tra email để xác nhận tài khoản",
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng kí : ", error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        user.isActive = true;
        await user.save();

        res.json({ message: "Xác thực email thành công, bạn có thể đăng nhập" });
    } catch (error) {
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Vui lòng xác thực email trước khi đăng nhập" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }

        const token = generateToken({ id: user.id, role: user.role });

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
