export class Account {
    constructor(id, avatarPath, title, name, email, role, jwtToken, followerCount, followingCount, isFollowedByCurrentUser) {
        this.id = id;
        this.avatarPath = avatarPath;
        this.title = title;
        this.name = name;
        this.email = email;
        this.role = role;
        this.jwtToken = jwtToken;
        this.followerCount = followerCount;
        this.followingCount = followingCount;
        this.isFollowedByCurrentUser = isFollowedByCurrentUser;
    }
}