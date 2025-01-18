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

// const deleteTransaction = async (id) => {
//   try {
//     const transaction = await Transaction.findByIdAndDelete(id);
//     if (!transaction) {
//       const error = new Error("No transaction found");
//       error.status = 404;
//       throw error;
//     }
//     return {
//       success: true,
//     };
//   } catch (error) {
//     throw error;
//   }
// };

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
    const { _id, amount, description, category, createdAt } = transaction;
    return {
      id: _id,
      amount,
      description,
      category,
      createdAt,
    };
  } catch (error) {
    throw error;
  }
};

// const getTransactionHistory = (email) => {
//   try {
//   } catch (error) {
//     throw error;
//   }
// };

export {
  createNewTransation,
  //   deleteTransaction,
  getTransactionDetails,
  //   getTransactionHistory,
};
