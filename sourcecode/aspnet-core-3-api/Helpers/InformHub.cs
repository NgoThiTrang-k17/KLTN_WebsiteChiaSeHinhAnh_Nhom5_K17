using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WebApi.Entities;
using WebApi.Models.Notifications;

namespace WebApi.Helpers
{
    public interface IHubClient
    {
        Task InformClient(ChatMessage message);
    }
    public class InformHub : Hub<IHubClient>
    {
       
    }
}
