export enum isAlbumOrFileEnum {
  file = "file",
  album = "album",
}

export const enum SearchType {
  Accounts,
  Tags,
}

export enum DrawerEnum {
  ADD_FEEDBACK,
  UPDATE_COMMENT,
}

export interface EmojiSelectEvent {
  native: string;
  id: string;
  keywords: string[];
  name: string;
  shortcodes: string;
  unified: string;
}

export interface AddShowcaseType {
  url: string;
  fileKey: string;
  fileType: string;
  filePrivacy: "public" | "private";
  caption: string;
  tags: string[];
  gallerySlug: string;
}
export interface ShowcaseFormData {
  filePrivacy: boolean;
  caption: string;
  tags: string[] | undefined;
  gallerySlug: string;
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
  filePrivacy: "public" | "private" | null;
  galleryId: number;
  commentsCount: number;
  likesInfo: LikesInfo[] | null;
  likedUsers: User[];
  user?: User | null | undefined;
  commentsInfo: Comment[] | null;
  comments?: Comment[];
}
export interface Feedback {
  id: number;

  feedback: string;

  userId: string;

  createdAt: Date;

  user: User;
}
export interface Comment {
  id: string;
  fileId: string;
  userId: string;
  content: string;
  parentId: string | null;
  isReply: boolean | null;
  createdAt: Date;
  user: User;
  replies?: Comment[];
  likedUsers?: User[];
  likesInfo: LikesInfo[] | null;
}

export interface LikesInfo {
  liked: boolean;
  userId: string;
}

export interface Follower {
  followed: boolean;
  userId: string;
}

export interface UserProfileType {
  user: User;
  followers: Follower[] | null;
  files?: Showcase[];
}

export interface UserImage {
  imageUrl: string;
  imageKey: string;
}
export interface User {
  email: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date | null;
  profileImage: UserImage | null;
  coverImage: UserImage | null;
  followers: Follower[] | null;
  followings: Follower[] | null;
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
  filePrivacy: "public" | "private" | null;
  galleryId: number;
}

export interface UserGallery {
  createdAt: Date;
  id: number;
  createdById: string;
  slug: string;
}

export interface UserRegistry {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  image: UserImage;
}

export interface Store {
  userRegistrationInfo: UserRegistry;
  isUserUpdating: boolean;
  setIsUserUpdating: (isUpdating: boolean) => void;
  setUserRegistry: (user: UserRegistry) => void;
  setUserImage: (image: UserImage) => void;
}

export interface selectedFiles {
  id: string;
  fileKey: string;
}
export interface CommentInfo {
  commentId: string | undefined;
  commentUsername: string | undefined;
}

export interface ReplyData {
  commentId: string;
  content: string;
  isReplying: boolean;
}
export interface FileStore {
  formData: ShowcaseFormData;
  setFormData: (formData: ShowcaseFormData) => void;
  showcaseUrl: {
    url: string;
    type: string;
  };
  setShowcaseUrl: (showcaseUrl: { url: string; type: string }) => void;
  croppedImage: string;
  setCroppedImage: (croppedImage: string) => void;
  showcaseOriginalName: string;
  setShowcaseOriginalName: (showcaseOriginalName: string) => void;
  commentInfo: CommentInfo;
  replyData: ReplyData;
  fileUrl: string;
  fileKey: string;
  fileType: string;
  isUploading: boolean;
  isUpdating: boolean;
  isCommentUpdating: boolean;
  isUpdatingPending: boolean;
  isSelecting: boolean;
  isCommenting: boolean;
  progress: number;
  selectedFiles: selectedFiles[];
  setCommentInfo: (commentInfo: CommentInfo) => void;
  setReplyData: (replyData: ReplyData) => void;
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
  setCommentIsUpdating: (isCommentUpdating: boolean) => void;
  setIsUpdatingPending: (isUpdatingPending: boolean) => void;
}

export interface Crop {
  x: number;
  y: number;
}
