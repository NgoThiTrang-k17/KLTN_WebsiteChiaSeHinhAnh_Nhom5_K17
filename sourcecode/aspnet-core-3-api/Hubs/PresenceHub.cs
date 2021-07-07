using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WebApi.Extensions;
using WebApi.Services;

namespace WebApi.Hubs
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly INotificationService _notificationService;
        private readonly IMessageService _messageService;
        private readonly PresenceTracker _tracker;

        public PresenceHub(
            INotificationService notificationService,
            IMessageService messageService,
            PresenceTracker tracker)
        {
            _notificationService = notificationService;
            _messageService = messageService;
            _tracker = tracker;
        }


        public override async Task OnConnectedAsync()
        {
            var isOnline = await _tracker.UserConnected(Context.User.GetUserId(), Context.ConnectionId);
            if (isOnline) 
            { 
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUserId());
            }
             

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);

            var currentUserId = Context.User.GetUserId();

            var notifications = await _notificationService.GetNotificationThread(currentUserId);
            await Clients.Caller.SendAsync("ReceiveNotificationThread", notifications);

            var userMessages = await _messageService.GetMessagesForUser(currentUserId);
            await Clients.Caller.SendAsync("ReceiveUserMessages", userMessages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var isOffline = await _tracker.UserDisconnected(Context.User.GetUserId(), Context.ConnectionId);
            if(isOffline) 
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUserId());

            //var currentUsers = await _tracker.GetOnlineUsers();
            //await Clients.All.SendAsync("GetOnlineUsers", currentUsers);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
