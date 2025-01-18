import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import { errorMessages } from "./constants.js";

const isUserLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({
      error: errorMessages[error.code] || "Unauthorized",
    });
  }
};

export { isUserLoggedIn };
