export class Comment {
    id: number;
    content: string;
    dateCreated: string;
    ownerId: number;
    isCreatedByThisUser: boolean;
    postId: number;
}