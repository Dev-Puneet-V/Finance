import express from "express";
const router = express.Router();
import userRoute from "./user.js";
import transactionRoute from "./transaction.js";

router.use("/user", userRoute);
router.use("/transaction", transactionRoute);

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
