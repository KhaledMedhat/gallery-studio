import { create } from "zustand";
interface UserRegistry {
  name: string;
  email: string;
  password: string;
}
interface Store  {
  userRegistrationInfo: UserRegistry;
  setUserRegistry: (user: UserRegistry) => void;
};

export const useUserStore = create<Store>()((set) => ({
    userRegistrationInfo : {
        name: "",
        email: "",
        password: "",
    },
    setUserRegistry: (user: UserRegistry) => set((state) => ({userRegistrationInfo: user})),
}));
