using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WebApi.Models.Notifications;

namespace WebApi.Helpers
{

    public class Hubs : Hub
    {
        public async Task SendMessage(NotificationResponse notificationResponse)
        {
            await Clients.All.SendAsync("ReceiveMessage", notificationResponse.NotificationType);
        }
    }
}
