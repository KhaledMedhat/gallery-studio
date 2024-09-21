import { type RootState } from "../store/store";

export const selectUserRegistry = (state: RootState) => state.appState.userRegistry;
