export class Comment {
    id: number;
    content: string;
    created: string;
    parrentId: number;
    isParent: boolean;
    isChild: boolean;
    childCount: number;
    reactionCount: number;
    ownerId: number;
    ownerName: string;
    ownerAvatar: string;
    isReactedByThisUser: boolean;
    postId: number;
}
