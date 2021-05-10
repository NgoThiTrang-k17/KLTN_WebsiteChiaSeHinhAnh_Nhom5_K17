using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WebApi.Models.Chats;
using WebApi.Models.Notifications;

namespace WebApi.Helpers
{
        [Authorize]
    public class PresenceHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.Others.SendAsync("UserIsOnline" /*Context.User.GetUsername()*/);
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Others.SendAsync("UserIsOffline"/*, Context.User.GetUsername()*/);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
