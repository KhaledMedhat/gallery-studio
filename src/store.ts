import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Store,
  UserRegistry,
  FileStore,
  selectedFiles,
  CommentInfo,
  UserImage,
  ShowcaseFormData,
  ReplyData,
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
        image: { imageKey: "", imageUrl: "" },
      },
      isUserUpdating: false,
      setIsUserUpdating: (isUpdating: boolean) =>
        set(() => ({ isUserUpdating: isUpdating })),
      setUserRegistry: (user: UserRegistry) =>
        set(() => ({ userRegistrationInfo: user })),
      setUserImage: (image: UserImage) =>
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
  formData: {
    filePrivacy: false,
    caption: "",
    tags: undefined,
    gallerySlug: "",
  },
  setFormData: (formData: ShowcaseFormData) =>
    set(() => ({ formData: formData })),
  commentInfo: {
    commentId: undefined,
    commentUsername: undefined,
  },
  replyData: {
    commentId: "",
    content: "",
    isReplying: false,
  },
  showcaseUrl: {
    url: "",
    type: "",
  },
  setShowcaseUrl: (showcaseUrl: { url: string; type: string }) =>
    set(() => ({ showcaseUrl: showcaseUrl })),
  croppedImage: "",
  setCroppedImage: (croppedImage: string) =>
    set(() => ({ croppedImage: croppedImage })),
  showcaseOriginalName: "",
  setShowcaseOriginalName: (showcaseOriginalName: string) =>
    set(() => ({ showcaseOriginalName: showcaseOriginalName })),
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
  isUploadedShowcaseEditing: false,
  setIsUploadedShowcaseEditing: () =>
    set((state) => ({ isUploadedShowcaseEditing: !state.isUploadedShowcaseEditing })),
  setCommentInfo: (commentInfo: CommentInfo) =>
    set(() => ({ commentInfo: commentInfo })),
  setReplyData: (replyData: ReplyData) => set(() => ({ replyData: replyData })),
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
