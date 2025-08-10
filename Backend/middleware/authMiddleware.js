// middleware/protect.js
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token=req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer"
    if (token && req.headers.authorization.startsWith("Bearer")) {
      token = token.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, excluding password
      req.user = await User.findById(decoded.id).select("-password");

      return next(); 
    }

    // If token not found
    res.status(401).json({ message: "Not authorized, no token found" });
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(403).json({ message: "Not authorized, token failed" });
  }
};
