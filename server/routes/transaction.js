import express from "express";
import { validationResult } from "express-validator";
import { validateTransaction } from "../utils/validation.js";
import { isUserLoggedIn } from "../utils/middlewares.js";
import {
  createNewTransation,
  deleteTransaction,
  getTransactionDetails,
  getTransactionHistory,
} from "../services/transaction.js";
import { errorMessages } from "../utils/constants.js";
const router = express.Router();

router.get("/history", isUserLoggedIn, async (req, res) => {
  try {
    const {
      category,
      maxAmount,
      minAmount,
      startDate,
      endDate,
      sortAmountBy,
      sortDateBy,
    } = req.body;
    const { pageNumber, dataPerPage, searchQuery } = req.query;
    const filters = {
      category,
      maxAmount,
      minAmount,
      startDate,
      endDate,
    };
    filters.sort = {
      amount: sortAmountBy === "desc" ? -1 : 1,
      createdAt: sortDateBy === "desc" ? -1 : 1,
    };
    const result = await getTransactionHistory(
      req.user?._id,
      dataPerPage,
      pageNumber,
      filters,
      searchQuery
    );
    res.status(200).json({
      message: "History successfully fetched",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        errorMessages[error.code] ||
        error.message ||
        "Error fetching transactions history",
    });
  }
});

router.post("/", validateTransaction, isUserLoggedIn, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array().join(","));
      error.status = 400;
      throw error;
    }
    const user = req.user;
    const { amount, category, description } = req.body;
    const newTransactionDetails = await createNewTransation(
      user._id,
      amount,
      category,
      description
    );
    res.status(200).json({
      message: "Transaction created successfully",
      data: newTransactionDetails,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        errorMessages[error.code] ||
        error.message ||
        "Error creating transaction",
    });
  }
});

router.delete("/:id", isUserLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!id || !id?.trim()) {
      const error = new Error("Transaction Id is required");
      error.status = 400;
      throw error;
    }
    await deleteTransaction(id, user?._id);
    res.status(200).json({
      message: id + " transaction successfully deleted",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        errorMessages[error.code] ||
        error.message ||
        "Error deleting transaction",
    });
  }
});

router.get("/:id", isUserLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!id || !id?.trim()) {
      const error = new Error("Transaction Id is required");
      error.status = 400;
      throw error;
    }
    const transactionDetails = await getTransactionDetails(id, user?._id);
    res.status(200).json({
      message: "Transaction details successfully fetched",
      data: transactionDetails,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        errorMessages[error.code] ||
        error.message ||
        "Error fetching transaction details",
    });
  }
});

export default router;
