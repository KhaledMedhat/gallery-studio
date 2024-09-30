import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

interface ImageStore {
  imageUrl: string | undefined;
  imageKey: string | undefined;
  isUploading: boolean;
  progress: number;
  setImageUrl: (url: string) => void;
  setImageKey: (key: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  setProgress: (progress: number) => void;
}
export const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "app-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export const useImageStore = create<ImageStore>()((set, get) => ({
  imageUrl: "" || undefined ,
  imageKey: ""  || undefined,
  isUploading: false,
  progress: 0,
  setImageUrl: (url: string) => set(() => ({ imageUrl: url })),
  setImageKey: (key: string) => set(() => ({ imageKey: key })),
  setIsUploading: (isUploading: boolean) =>
    set(() => ({ isUploading: isUploading })),
  setProgress: (progress: number) => set(() => ({ progress: progress })),
}));
