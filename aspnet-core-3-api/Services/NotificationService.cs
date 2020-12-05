//using Abp;
//using Abp.Dependency;
//using Abp.Domain.Entities;
//using Abp.Notifications;
//using AutoMapper;
//using Microsoft.Extensions.Options;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using WebApi.Entities;
//using WebApi.Helpers;

//namespace WebApi.Services
//{
//    public class MyService : ITransientDependency
//    {
//        private readonly INotificationSubscriptionManager _notificationSubscriptionManager;
//        private readonly INotificationPublisher _notificationPublisher;

//        public MyService(INotificationSubscriptionManager notificationSubscriptionManager,
//            INotificationPublisher notificationPublisher)
//        {
//            _notificationSubscriptionManager = notificationSubscriptionManager;
//            _notificationPublisher = notificationPublisher;
//        }

//        //Subscribe to a general notification
//        public async Task Subscribe_SentFriendshipRequest(int? tenantId, long userId)
//        {
//            await _notificationSubscriptionManager.SubscribeAsync(new UserIdentifier(tenantId, userId), "SentFriendshipRequest");
//        }

//        //Subscribe to an entity notification
//        public async Task Subscribe_CommentPhoto(int? tenantId, long userId, Guid postId)
//        {
//            await _notificationSubscriptionManager.SubscribeAsync(new UserIdentifier(tenantId, userId), "CommentPhoto", new EntityIdentifier(typeof(Post), postId));
//        }

    



//        //Send a general notification to a specific user
//        public async Task Publish_SentFrendshipRequest(string senderUserName, string friendshipMessage, UserIdentifier targetUserId)
//        {
//            await _notificationPublisher.PublishAsync("SentFrendshipRequest", new SentFrendshipRequestNotificationData(senderUserName, friendshipMessage), userIds: new[] { targetUserId });
//        }

//        //Send an entity notification to a specific user
//        public async Task Publish_CommentPhoto(string commenterUserName, string comment, Guid photoId, UserIdentifier photoOwnerUserId)
//        {
//            await _notificationPublisher.PublishAsync("CommentPhoto", new CommentPhotoNotificationData(commenterUserName, comment), new EntityIdentifier(typeof(Photo), photoId), userIds: new[] { photoOwnerUserId });
//        }

//        //Send a general notification to all subscribed users in current tenant (tenant in the session)
//        public async Task Publish_LowDisk(int remainingDiskInMb)
//        {
//            //Example "LowDiskWarningMessage" content for English -> "Attention! Only {remainingDiskInMb} MBs left on the disk!"
//            var data = new LocalizableMessageNotificationData(new LocalizableString("LowDiskWarningMessage", "MyLocalizationSourceName"));
//            data["remainingDiskInMb"] = remainingDiskInMb;

//            await _notificationPublisher.PublishAsync("System.LowDisk", data, severity: NotificationSeverity.Warn);
//        }
//    }
//}

