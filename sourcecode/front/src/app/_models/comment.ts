export class Comment {
    id: number;
    content: string;
    created: string;
    parrentId: number;
    isParent: boolean;
    isChild: boolean;
    ownerId: number;
    isCreatedByThisUser: boolean;
    postId: number;
}