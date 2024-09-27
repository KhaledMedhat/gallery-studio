import { create } from "zustand";
interface UserRegistry {
  fullName: string;
  email: string;
  password: string;
  image: string;
}
interface Store {
  userRegistrationInfo: UserRegistry;
  isLoggedIn: boolean;
  setUserRegistry: (user: UserRegistry) => void;
  setIsLoggedIn: () => void;
  setUserImage: (image:string) => void
}

export const useUserStore = create<Store>()((set) => ({
  userRegistrationInfo: {
    fullName: "",
    email: "",
    password: "",
    image: "",
  },
  isLoggedIn: false,
  setUserRegistry: (user: UserRegistry) =>
    set(() => ({ userRegistrationInfo: user })),
  setUserImage: (image: string) =>
    set((state) => ({ userRegistrationInfo : { ...state.userRegistrationInfo, image: image } })),
  setIsLoggedIn: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
}));
