export class Post {
  id: number;
  title: string;
  description: string;
  created: string;
  categories: string;
  imageName: string;
  status: number;
  path: string;
  ownerId: number;
  isReactedByThisUser: boolean;
  reactionCount: number;
  commentCount: number;
  followerCount: number;
}
