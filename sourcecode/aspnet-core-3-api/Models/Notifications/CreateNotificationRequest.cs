using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;

namespace WebApi.Models.Notifications
{
    public class CreateNotificationRequest
    {
        public int ActionOwnerId { get; set; }
        public NotificationType NotificationType { get; set; }
        public int? PostId { get; set; }
        public int ReiceiverId { get; set; }
        public DateTime Created { get; set; }
        public Status Status { get; set; }
    }
}
