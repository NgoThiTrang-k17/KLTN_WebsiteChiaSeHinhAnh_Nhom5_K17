
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Extensions;
using WebApi.Models.Notifications;
using WebApi.Services;

namespace WebApi.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;

        public NotificationHub(
            INotificationService notificationService, 
            IMapper mapper, 
            IHubContext<PresenceHub> presenceHub, 
            PresenceTracker tracker)
        {
            _notificationService = notificationService;
            _mapper = mapper;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }
        public override async Task OnConnectedAsync()
        {
            //var httpContext = Context.GetHttpContext();
            //var otherUserId = int.Parse(httpContext.Request.Query["userId"]);
            var currentUserId = Context.User.GetUserId();
            //string groupName = GetNotificationGroupName(currentUserId);
            //await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            //var group = await AddToNotificationGroup(groupName);
            //await Clients.Client  .Group(groupName).SendAsync("UpdatedGroup", group);

            var notifications =   _notificationService.GetNotificationThread(currentUserId );
            await Clients.Caller.SendAsync("ReceiveNotificationThread", notifications);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //var group = await RemoveFromNotificationGroup();
            //await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
