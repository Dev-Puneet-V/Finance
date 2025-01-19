import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import { it, jest } from "@jest/globals";
import {
  createNewTransation,
  getTransactionDetails,
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

    const mockTransaction = {
      _id: new mongoose.Types.ObjectId(id),
      amount: 100,
      description: "Groceries",
      category: "Food",
      createdAt: new Date(),
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
});
