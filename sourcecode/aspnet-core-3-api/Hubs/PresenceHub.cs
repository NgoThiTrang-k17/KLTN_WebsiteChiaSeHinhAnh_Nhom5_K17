using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WebApi.Extensions;

namespace WebApi.Hubs
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
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
