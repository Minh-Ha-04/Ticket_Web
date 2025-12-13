import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
