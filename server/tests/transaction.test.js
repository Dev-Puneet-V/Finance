import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import { it, jest } from "@jest/globals";
import {
  createNewTransation,
  deleteTransaction,
  getTransactionDetails,
  getTransactionHistory,
} from "../services/transaction.js";
import { getUserDetails } from "../services/user.js";

jest.mock("../models/transaction.js");
jest.mock("../services/user.js", () => ({
  getUserDetails: jest.fn(),
}));
describe("Transaction Service", () => {
  let sessionMock;
  beforeEach(() => {
    sessionMock = {
      startTransaction: jest.fn().mockResolvedValue(),
      commitTransaction: jest.fn().mockResolvedValue(),
      abortTransaction: jest.fn().mockResolvedValue(),
      endSession: jest.fn().mockResolvedValue(),
    };
    mongoose.startSession = jest.fn().mockResolvedValue(sessionMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should create a new transaction and commit it", async () => {
    const userId = "64b1f0ec7cbe1a345f44e7d3";
    const amount = 100;
    const category = "Food";
    const description = "Groceries";

    // Mock user and transaction behavior
    getUserDetails.mockResolvedValue({
      addTransactions: jest.fn().mockResolvedValue(true),
    });

    const mockTransaction = [
      {
        _id: "64b1f0ec7cbe1a345f44e7e8",
        amount,
        category,
        description,
        createdAt: new Date(),
      },
    ];
    Transaction.create.mockResolvedValue(mockTransaction);

    const result = await createNewTransation(
      userId,
      amount,
      category,
      description
    );

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(sessionMock.startTransaction).toHaveBeenCalled();
    expect(sessionMock.commitTransaction).toHaveBeenCalled();
    expect(sessionMock.endSession).toHaveBeenCalled();

    expect(getUserDetails).toHaveBeenCalledWith(userId);
    expect(Transaction.create).toHaveBeenCalledWith(
      [
        {
          user: userId,
          amount,
          category,
          description,
        },
      ],
      { session: sessionMock }
    );

    expect(result).toEqual({
      id: mockTransaction[0]._id,
      amount: mockTransaction[0].amount,
      category: mockTransaction[0].category,
      description: mockTransaction[0].amount,
      createdAt: mockTransaction[0].createdAt,
    });
  });
  it("should fetch transaction details with correct id", async () => {
    const id = "64b1f0ec7cbe1a345f44e7d3";
    const userId = "64b1f0ec7cbe1a345f44e7d4";
    const mockTransactionData = {
      _id: new mongoose.Types.ObjectId(id),
      amount: 100,
      description: "Groceries",
      category: "Food",
      createdAt: new Date(),
    };
    const mockTransaction = {
      toJSON: jest.fn().mockResolvedValue(mockTransactionData),
    };

    Transaction.findOne.mockResolvedValue(mockTransaction);

    const result = await getTransactionDetails(id, userId);

    expect(Transaction.findOne).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
    expect(result).toEqual({
      id: mockTransaction._id,
      amount: mockTransaction.amount,
      description: mockTransaction.description,
      category: mockTransaction.category,
      createdAt: mockTransaction.createdAt,
    });
  });
  it("should throw a 404 error when no transaction is found", async () => {
    const id = "64b1f0ec7cbe1a345f44e7d3";
    const userId = "64b1f0ec7cbe1a345f44e7d4";

    Transaction.findOne.mockResolvedValue(null);

    await expect(getTransactionDetails(id, userId)).rejects.toThrow(
      "No transaction found"
    );

    expect(Transaction.findOne).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
  });

  it("should throw errors thrown by Transaction.findOne", async () => {
    const id = "64b1f0ec7cbe1a345f44e7d3";
    const userId = "64b1f0ec7cbe1a345f44e7d4";

    const mockError = new Error("Database error");
    Transaction.findOne.mockRejectedValue(mockError);

    await expect(getTransactionDetails(id, userId)).rejects.toThrow(
      "Database error"
    );

    expect(Transaction.findOne).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
  });

  it("should successfully execute findOneDelete", async () => {
    const id = "64b1f0ec7cbe1a345f44e7d3";
    const userId = "64b1f0ec7cbe1a345f44e7d4";
    const mockTransaction = {};
    Transaction.findOneAndDelete.mockResolvedValue(mockTransaction);
    await deleteTransaction(id, userId);
    expect(Transaction.findOneAndDelete).toHaveBeenCalled();
  });

  it("should successfully execute findOneDelete", async () => {
    const id = "64b1f0ec7cbe1a345f44e7d3";
    const userId = "64b1f0ec7cbe1a345f44e7d4";
    const mockError = new Error("Database error");
    Transaction.findOneAndDelete.mockRejectedValue(mockError);
    await expect(deleteTransaction(id, userId)).rejects.toThrow(
      "Database error"
    );
    expect(Transaction.findOneAndDelete).toHaveBeenCalled();
  });

  it("should construct the correct pipeline with all filters", async () => {
    const userId = "64c72b89e7d1f839a9e8f12d";
    const dataPerPage = 10;
    const pageNumber = 2;
    const filters = {
      category: "Food",
      maxAmount: 500,
      minAmount: 100,
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      sort: { createdAt: -1 },
    };
    const searchQuery = "groceries";

    const mockResult = [{ id: "1", description: "Groceris" }];
    Transaction.aggregate.mockResolvedValue(mockResult);
    const result = await getTransactionHistory(
      userId,
      dataPerPage,
      pageNumber,
      filters,
      searchQuery
    );

    const expectedPipeline = [
      {
        $search: {
          text: {
            query: "groceries",
            path: "description",
            fuzzy: { maxEdits: 2 },
          },
        },
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          category: "Food",
          amount: { $gte: 100, $lte: 500 },
          createdAt: {
            $gte: new Date("2025-01-01"),
            $lte: new Date("2025-01-31"),
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: 10 },
      { $limit: 10 },
    ];
    expect(Transaction.aggregate).toHaveBeenCalledWith(expectedPipeline);
    expect(result).toEqual(mockResult);
  });

  it("should throw an error if Transaction.aggregate fails", async () => {
    const userId = "64c72b89e7d1f839a9e8f12d";
    const dataPerPage = 5;
    const pageNumber = 1;
    const filters = {};
    const searchQuery = "";
    const error = new Error("Database error");

    Transaction.aggregate.mockRejectedValue(error);

    await expect(
      getTransactionHistory(
        userId,
        dataPerPage,
        pageNumber,
        filters,
        searchQuery
      )
    ).rejects.toThrow("Database error");
    expect(Transaction.aggregate).toHaveBeenCalled();
  });
    
  it("should delete the transaction successfully", async () => {
    const id = "64c72b89e7d1f839a9e8f12d";
    const userId = "user123";
    const mockTransaction = { _id: id, user: userId, amount: 100 };

    Transaction.findOneAndDelete.mockResolvedValue(mockTransaction);

    const result = await deleteTransaction(id, userId);

    expect(Transaction.findOneAndDelete).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
    expect(result).toEqual({ success: true });
  });

  it("should throw an error if no transaction is found", async () => {
    const id = "64c72b89e7d1f839a9e8f12d";
    const userId = "user123";

    Transaction.findOneAndDelete.mockResolvedValue(null);

    await expect(deleteTransaction(id, userId)).rejects.toThrow(
      "No transaction found"
    );
    expect(Transaction.findOneAndDelete).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
  });

  it("should throw an error if findOneAndDelete fails", async () => {
    const id = "64c72b89e7d1f839a9e8f12d";
    const userId = "user123";
    const error = new Error("Database error");

    Transaction.findOneAndDelete.mockRejectedValue(error);

    await expect(deleteTransaction(id, userId)).rejects.toThrow(
      "Database error"
    );
    expect(Transaction.findOneAndDelete).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId(id),
      user: userId,
    });
  });
});
