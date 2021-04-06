using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : Controller
    {
        private readonly IHubContext<InformHub, IHubClient> _informHub;
        public ChatController(IHubContext<InformHub,IHubClient> hubContext)
        {
            _informHub = hubContext;
        }


        [HttpPost("message")]
        public async Task Post(ChatMessage message)
        {
           await _informHub.Clients.All.InformClient(message);
        }
    }
}
