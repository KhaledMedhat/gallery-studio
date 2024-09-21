import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserRegister {
  name: string;
  email: string;
  password: string;
}
interface AppState {
  userRegistry: UserRegister;
}
const initialState: AppState = {
  userRegistry: {
    name: "",
    email: "",
    password: "",
  },
};

export const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setUserRegistry: (state, action: PayloadAction<UserRegister>) => {
      state.userRegistry = action.payload;
    },
  },
});

export const { setUserRegistry } = appStateSlice.actions;
export default appStateSlice;
