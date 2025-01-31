import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { calculateTotals } from "../helpers";

export const getTransactionHistory = createAsyncThunk(
  "transaction/getHistory",
  async (data: any, thunkAPI) => {
    try {
      const { page, limit } = data;
      const response = await axios.get(
        `http://localhost:3000/api/transaction/history?pageNumber=${page}&dataPerPage=${limit}`,
        {
          withCredentials: true,
        }
      );
      return response.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/createTransaction",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/transaction",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState: any = {
  currentPageNumber: 1,
  transactionCountPerPage: 10000,
  totalPages: -1,
  transactions: [],
  lastThirtyDays: {
    totalCredit: 0,
    totalDebit: 0,
  },
  loading: null,
  error: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
    setTransactionCountPerPage: (state, action: PayloadAction<number>) => {
      state.transactionCountPerPage = action.payload;
    },
    setInitState: (state) => {
      state.loading = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(
        getTransactionHistory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = null;
          state.error = null;
          state.transactions = [...state.transactions, ...action.payload];
          const { totalCredit, totalDebit } = calculateTotals([
            ...state.transactions,
            ...action.payload,
          ]);
          state.lastThirtyDays = {
            totalCredit,
            totalDebit,
          };
        }
      )
      .addCase(
        getTransactionHistory.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = null;
          state.error = action.payload;
        }
      )
      .addCase(createTransaction.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = "loaded";
        state.error = null;
        state.transactions = [action.payload?.data, ...state.transactions];
        state.lastThirtyDays = {
          totalCredit:
            action.payload?.data?.category === "credit"
              ? state.lastThirtyDays?.totalCredit + action.payload?.data.amount
              : state.lastThirtyDays?.totalCredit,
          totalDebit:
            action.payload?.data?.category === "debit"
              ? state.lastThirtyDays?.totalDebit + action.payload?.data.amount
              : state.lastThirtyDays?.totalDebit,
        };
      })
      .addCase(
        createTransaction.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = null;
          state.error = action.payload;
        }
      );
  },
});

export const { setPageNumber, setTransactionCountPerPage, setInitState } =
  transactionSlice.actions;

export default transactionSlice.reducer;
