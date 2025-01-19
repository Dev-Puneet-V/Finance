import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import { getUserDetails } from "./user.js";

const createNewTransation = async (userId, amount, category, description) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await getUserDetails(userId);
    const newTransaction = await Transaction.create(
      [
        {
          user: userId,
          amount,
          category,
          description,
        },
      ],
      { session }
    );

    await user.addTransactions(newTransaction[0]._id, session);
    await session.commitTransaction();
    return {
      id: newTransaction[0]._id,
      amount: newTransaction[0].amount,
      category: newTransaction[0].category,
      description: newTransaction[0].amount,
      createdAt: newTransaction[0].createdAt,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const deleteTransaction = async (id, userId) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
    if (!transaction) {
      const error = new Error("No transaction found");
      error.status = 404;
      throw error;
    }
    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
};

const getTransactionDetails = async (id, userId) => {
  try {
    const transaction = await Transaction.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
    if (!transaction) {
      const error = new Error("No transaction found");
      error.status = 404;
      throw error;
    }
    //toJSON used for accessing the virtuals
    const { _id, amount, description, category, createdAt, formattedDate } =
      transaction.toJSON();
    return {
      id: _id,
      amount,
      description,
      category,
      createdAt,
      formattedDate,
    };
  } catch (error) {
    throw error;
  }
};

const getTransactionHistory = async (
  userId,
  dataPerPage,
  pageNumber,
  filters
) => {
  try {
    const { category, maxAmount, minAmount, startDate, endDate, sort } =
      filters;
    const matchQuery = {
      user: new mongoose.Types.ObjectId(userId),
    };

    if (category) {
      matchQuery.category = category;
    }

    if (minAmount || maxAmount) {
      matchQuery.amount = {};
      if (minAmount) matchQuery.amount.$gte = +minAmount;
      if (maxAmount) matchQuery.amount.$lte = +maxAmount;
    }

    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const history = await Transaction.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: sort,
      },
    ])
      .skip((+pageNumber - 1) * +dataPerPage)
      .limit(+dataPerPage);
    console.log(history);
    return history;
  } catch (error) {
    throw error;
  }
};

export {
  createNewTransation,
  deleteTransaction,
  getTransactionDetails,
  getTransactionHistory,
};
