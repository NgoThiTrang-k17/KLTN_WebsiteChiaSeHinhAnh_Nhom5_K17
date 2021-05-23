export interface Member {
    id: number
    avatarPath: string
    title: string
    name: string
    email: string
    role: string
    created: Date
    updated: Date
    isVerified: boolean
    followerCount: number
    followingCount: number
    isFollowedByCurrentUser: number
}