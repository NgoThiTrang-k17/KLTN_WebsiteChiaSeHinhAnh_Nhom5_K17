export class Post {
    id: number;
    title: string;
    created: string;
    imageName: string;
    path: string;
    ownerId: number;
    isReactedByThisUser: boolean;
    reactionCount: number;
    commentCount: number;
    followerCount: number;
}