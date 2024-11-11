import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Store,
  UserRegistry,
  FileStore,
  selectedFiles,
} from "./types/types";

export const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      userRegistrationInfo: {
        fullName: "",
        email: "",
        password: "",
        image: "",
      },
      setUserRegistry: (user: UserRegistry) =>
        set(() => ({ userRegistrationInfo: user })),
      setUserImage: (image: string) =>
        set((state) => ({
          userRegistrationInfo: { ...state.userRegistrationInfo, image: image },
        })),
    }),
    {
      name: "app-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export const useFileStore = create<FileStore>()((set, get) => ({
  fileUrl: "",
  fileKey: "",
  fileType: "",
  isUploading: false,
  isUpdating: false,
  isUpdatingPending: false,
  isSelecting: false,
  isCommenting: false,
  progress: 0,
  selectedFiles: [],
  setIsCommenting: (isCommenting: boolean) =>
    set(() => ({ isCommenting: isCommenting })),
  setIsSelecting: () => set((state) => ({ isSelecting: !state.isSelecting })),
  setSelectedFilesToEmpty: () => set(() => ({ selectedFiles: [] })),
  setSelectedFiles: (selectedFiles: selectedFiles) =>
    set((state) => ({
      selectedFiles: [...state.selectedFiles, selectedFiles],
    })),
  removeSelectedFiles: (selectedFile: selectedFiles) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.filter(
        (file) => file.id !== selectedFile.id,
      ),
    })),
  setFileUrl: (url: string) => set(() => ({ fileUrl: url })),
  setFileKey: (key: string) => set(() => ({ fileKey: key })),
  setFileType: (type: string) => set(() => ({ fileType: type })),
  setIsUploading: (isUploading: boolean) =>
    set(() => ({ isUploading: isUploading })),
  setIsUpdating: (isUpdating: boolean) =>
    set(() => ({ isUpdating: isUpdating })),

  setProgress: (progress: number) => set(() => ({ progress: progress })),
  setIsUpdatingPending: (isUpdatingPending: boolean) =>
    set(() => ({ isUpdatingPending: isUpdatingPending })),
}));

export const useAlbumStore = create<{ title: string }>()((set, get) => ({
  title: "",
  setTitle: (title: string) => set(() => ({ title: title })),
}));
