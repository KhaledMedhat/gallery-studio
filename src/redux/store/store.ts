import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "../state/appSlice";

export const store = () => {
  return configureStore({
    reducer: {
      [appStateSlice.name]: appStateSlice.reducer,
    },
  });
};
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
