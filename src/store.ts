import { create } from "zustand";
import { type BreadcrumbItem } from "./app/_components/GallerySidebar";
interface UserRegistry {
  fullName: string;
  email: string;
  password: string;
  image: string;
}

interface Store {
  userRegistrationInfo: UserRegistry;
  breadcrumbItems: BreadcrumbItem[];
  setUserRegistry: (user: UserRegistry) => void;
  setUserImage: (image: string) => void;
  setBreadcrumbItems: (items: BreadcrumbItem) => void;
  deleteBreadcrumbItems: (index: number) => void;
}

export const useUserStore = create<Store>()((set) => ({
  userRegistrationInfo: {
    fullName: "",
    email: "",
    password: "",
    image: "",
  },
  breadcrumbItems: [],
  setUserRegistry: (user: UserRegistry) =>
    set(() => ({ userRegistrationInfo: user })),
  setUserImage: (image: string) =>
    set((state) => ({
      userRegistrationInfo: { ...state.userRegistrationInfo, image: image },
    })),
  setBreadcrumbItems: (item: BreadcrumbItem) =>
    set((state) => {
      const existedBreadcrumbItem = state.breadcrumbItems.findIndex(
        (breadcrumbItem) => breadcrumbItem.href === item.href,
      );
      if (existedBreadcrumbItem === -1) {
        return { breadcrumbItems: [...state.breadcrumbItems, item] };
      }
      return { breadcrumbItems: state.breadcrumbItems };
    }),

  deleteBreadcrumbItems: (index: number) =>
    set((state) => ({
      breadcrumbItems: state.breadcrumbItems.slice(0, index + 1),
    })),
}));
