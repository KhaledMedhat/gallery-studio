import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Store,
  UserRegistry,
  FileStore,
  selectedFiles,
  CommentInfo,
} from "./types/types";

export const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      userRegistrationInfo: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        image: "",
      },
      isUserUpdating: false,
      setIsUserUpdating: (isUpdating: boolean) =>
        set(() => ({ isUserUpdating: isUpdating })),
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
  commentOwnerName: undefined,
  commentInfo: {
    commentId: undefined,
    commentUsername: undefined,
  },
  isReplying: false,
  fileUrl: "",
  fileKey: "",
  fileType: "",
  isUploading: false,
  isUpdating: false,
  isCommentUpdating: false,
  isUpdatingPending: false,
  isSelecting: false,
  isCommenting: false,
  progress: 0,
  selectedFiles: [],
  setCommentInfo: (commentInfo: CommentInfo) =>
    set(() => ({ commentInfo: commentInfo })),
  setIsReplying: (isReplying: boolean) =>
    set(() => ({ isReplying: isReplying })),
  setCommentOwnerName: (commentOwnerName: string | undefined) =>
    set(() => ({ commentOwnerName: commentOwnerName })),
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
  setCommentIsUpdating: (isCommentUpdating: boolean) =>
    set(() => ({ isCommentUpdating: isCommentUpdating })),
  setProgress: (progress: number) => set(() => ({ progress: progress })),
  setIsUpdatingPending: (isUpdatingPending: boolean) =>
    set(() => ({ isUpdatingPending: isUpdatingPending })),
}));

export const useAlbumStore = create<{ title: string }>()((set, get) => ({
  title: "",
  setTitle: (title: string) => set(() => ({ title: title })),
}));
