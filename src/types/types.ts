export enum isAlbumOrFileEnum {
  file = "file",
  album = "album",
}

export interface Showcase {
  createdAt: Date;
  id: string;
  url: string;
  createdById: string;
  caption: string | null;
  tags: string[] | null;
  fileKey: string | null;
  fileType: string | null;
  filePrivacy: "private" | "public" | null;
  galleryId: number;
  likes: number;
  comments: number;
  likesInfo: LikesInfo[] | null;
  user: User | null | undefined;
  commentsInfo: Comment[] | null;
}

export interface Comment {
  id: string;
  fileId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: User;
}

export interface LikesInfo {
  liked: boolean;
  userId: string;
}
export interface User {
  email: string;
  name: string | null;
  createdAt: Date | null;
  image: string | null;
  id: string;
  bio: string | null;
  password: string | null;
  provider: string | null;
  emailVerified: Date | null;
  updatedAt: Date | null;
  gallery?: Gallery | null;
}

export interface Gallery {
  id: number;
  createdById: string;
  slug: string;
  createdAt: Date;
}
export interface Album {
  id: number;
  createdAt: Date;
  name: string;
  galleryId: number;
}
export interface fileType {
  createdAt: Date;
  id: string;
  url: string;
  createdById: string;
  caption: string | null;
  tags: string[] | null;
  fileKey: string | null;
  fileType: string | null;
  filePrivacy: "private" | "public" | null;
  galleryId: number;
}

export interface UserGallery {
  createdAt: Date;
  id: number;
  createdById: string;
  slug: string;
}

export interface UserRegistry {
  fullName: string;
  email: string;
  password: string;
  image: string;
}

export interface Store {
  userRegistrationInfo: UserRegistry;
  setUserRegistry: (user: UserRegistry) => void;
  setUserImage: (image: string) => void;
}

export interface selectedFiles {
  id: string;
  fileKey: string;
}

export interface FileStore {
  fileUrl: string;
  fileKey: string;
  fileType: string;
  isUploading: boolean;
  isUpdating: boolean;
  isUpdatingPending: boolean;
  isSelecting: boolean;
  isCommenting: boolean;
  progress: number;
  selectedFiles: selectedFiles[];
  setIsSelecting: () => void;
  setIsCommenting: (isCommenting: boolean) => void;
  setSelectedFilesToEmpty: () => void;
  setSelectedFiles: (selectedFiles: selectedFiles) => void;
  removeSelectedFiles: (selectedFiles: selectedFiles) => void;
  setFileUrl: (url: string) => void;
  setFileKey: (key: string) => void;
  setFileType: (type: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  setProgress: (progress: number) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  setIsUpdatingPending: (isUpdatingPending: boolean) => void;
}
