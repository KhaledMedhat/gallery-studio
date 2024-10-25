export enum isAlbumOrFileEnum {
  file = "file",
  album = "album",
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
export interface UserSession {
  id: string;
  image?: string;
  email: string;
  name: string;
  bio?: string;
  password?: string;
  emailVerified?: Date;
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
  progress: number;
  selectedFiles: selectedFiles[];
  setIsSelecting: () => void;
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
