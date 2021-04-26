using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Chats;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : BaseController
    {
        private readonly IHubContext<ChatHub> _ChatContext;
        private readonly IUserConnectionManager _userConnectionManager;
        private readonly IChatService _chatService;
        public ChatController(IHubContext<ChatHub> hubContext,
            IUserConnectionManager userConnectionManager,
        IChatService chatService)
        {
            _ChatContext = hubContext;
            _userConnectionManager = userConnectionManager;
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<ActionResult> SendToSpecificUser(CreateChatMessageRequest model)
        {
            var connections = _userConnectionManager.GetUserConnections(model.userId);
            if (connections != null && connections.Count > 0)
            {
                foreach (var connectionId in connections)
                {
                    await _ChatContext.Clients.Client(connectionId).SendAsync("sendToUser", model.User, model.Message);
                }
            }
            return Ok(new { message = "Ok" });
        }
    }
}
