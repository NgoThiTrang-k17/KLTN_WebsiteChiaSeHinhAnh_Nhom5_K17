export class Follow {
    subjectId: number;
    subjectName: string;
    subjectAvatarPath: string;
    isSubject_FollowedByCurrentUser: boolean;
    followerId: number;
    followerName: string;
    followerAvatarPath: string;
    isFollower_FollowedByCurrentUser: boolean;
    status: number;
    isCreated: number;
}