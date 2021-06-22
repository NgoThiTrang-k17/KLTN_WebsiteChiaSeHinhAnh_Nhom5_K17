export interface Notification {
  id: number;
  actionOwnerId: number;
  notificationType: number;
  postId?: number;
  CommentId?: number;
  reiceiverId: number;
  created: Date;
  status: number;
  actionOwnerName: string;
  actionOwnerAvatarPath: string;
  reiceiverName: string;
}
