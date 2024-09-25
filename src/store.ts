import { create } from "zustand";
interface UserRegistry {
  fullName: string;
  email: string;
  password: string;
  image: string;
}
interface Store {
  userRegistrationInfo: UserRegistry;
  setUserRegistry: (user: UserRegistry) => void;
  setUserImage: (image:string) => void
}

export const useUserStore = create<Store>()((set) => ({
  userRegistrationInfo: {
    fullName: "",
    email: "",
    password: "",
    image: "",
  },
  setUserRegistry: (user: UserRegistry) =>
    set(() => ({ userRegistrationInfo: user })),
  setUserImage: (image: string) =>
    set((state) => ({ userRegistrationInfo : { ...state.userRegistrationInfo, image: image } })),
}));
