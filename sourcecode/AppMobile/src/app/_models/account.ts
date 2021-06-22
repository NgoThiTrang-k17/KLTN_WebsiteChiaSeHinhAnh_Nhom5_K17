import { Role } from './role';

export class Account {
    id: number;
    avatarPath: string;
    title: string;
    name: string;
    email: string;
    role: string;
    jwtToken?: string;
    followerCount: number;
    followingCount: number;
    isFollowedByCurrentUser: number;
}
