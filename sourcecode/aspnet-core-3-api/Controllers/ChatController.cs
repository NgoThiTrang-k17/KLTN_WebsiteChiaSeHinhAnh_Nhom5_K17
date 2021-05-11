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
        private readonly IChatService _chatService;
        public ChatController(
             IChatService chatService
             )
        {
            _chatService = chatService;
        }
        [HttpPost]
        public ActionResult<ChatMessageResponse> Send(CreateChatMessageRequest model)
        {
            model.OwnerId = Account.Id;
            var message = _chatService.SendMessage(model);
            return Ok(message);
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            _chatService.DeleteMessage(id);
            return Ok(new { message = "Message deleted successfully" });
        }

        [HttpGet]
        public ActionResult<ChatMessageResponse> GetAll()
        {
            var messages = _chatService.GetAll();
            return Ok(messages);
        }

        [HttpGet("GetByChatRoomId/{id:int}")]
        public ActionResult<ChatMessageResponse> GetByChatRoomId(int id)
        {
            var messages = _chatService.GetByChatRoomId(id);
            return Ok(messages);
        }
    }
}
