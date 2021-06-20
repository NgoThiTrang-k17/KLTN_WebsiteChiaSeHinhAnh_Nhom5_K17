export class Comment {
    id: number;
    content: string;
    created: string;
    parrentId: number;
    isParent: boolean;
    isChild: boolean;
    childCount: number;
    reactionCount: number;
    ownerName: string;
    ownerId: number;
    ownerAvatar: string;
    isReactedByThisUser: boolean;
    postId: number;
}
