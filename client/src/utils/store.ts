import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user";
import transactionSlice from "./slices/transaction";

const store = configureStore({
  reducer: {
    user: userSlice,
    transaction: transactionSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
