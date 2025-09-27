import jwt from 'jsonwebtoken';

export const auth = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Chưa có token' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token không hợp lệ' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Nếu có truyền roles thì kiểm tra role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Bạn không có quyền' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token hết hạn hoặc sai' });
    }
  };
};
