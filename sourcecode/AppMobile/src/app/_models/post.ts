/* eslint-disable eol-last */
export class Post {
  id: number;
  title: string;
  description: string;
  created: string;
  categories: string;
  imageName: string;
  path: string;
  ownerId: number;
  isReactedByThisUser: boolean;
  reactionCount: number;
  commentCount: number;
  followerCount: number;
}
