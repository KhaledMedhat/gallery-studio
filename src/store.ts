import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface UserRegistry {
  fullName: string;
  email: string;
  password: string;
  image: string;
}

interface Store {
  userRegistrationInfo: UserRegistry;
  setUserRegistry: (user: UserRegistry) => void;
  setUserImage: (image: string) => void;
}

interface selectedFiles {
  id: string;
  fileKey: string;
}

interface FileStore {
  fileUrl: string;
  fileKey: string;
  fileType: string;
  isUploading: boolean;
  progress: number;
  selectedFiles: selectedFiles[];
  setSelectedFilesToEmpty: () => void;
  setSelectedFiles: (selectedFiles: selectedFiles) => void;
  removeSelectedFiles: (selectedFiles: selectedFiles) => void;
  setFileUrl: (url: string) => void;
  setFileKey: (key: string) => void;
  setFileType: (type: string) => void;
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
  progress: 0,
  selectedFiles: [],
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
  setProgress: (progress: number) => set(() => ({ progress: progress })),
}));
