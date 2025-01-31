﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public enum NotificationType
    {
        Posted,
        ReactedPost,       
        Commented,
        FollowRequest,
        FollowRequestAwser,
        ReactedComment
    }
    public enum Status
    {
        Created,
        Seen,
        Opened,
        Sent, //đã gửi
        Accepted,
        Declined,
        Public,
        Private
    }
    public class Notification
    {
        public int Id { get; set; }
        public int ActionOwnerId { get; set; }
        public NotificationType NotificationType { get; set; }
        public int? PostId { get; set; }
        public int? CommentId { get; set; }
        public int ReiceiverId { get; set; }
        public DateTime Created { get; set; }
        public Status  Status { get; set; }
    }
}
