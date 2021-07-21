using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApi.Extensions;
using WebApi.Helpers;
using WebApi.Models.Chats;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessagesController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IMessageService _messageService;
        private readonly IAccountService _accountService;
        public MessagesController(
             IMessageService messageService,
             IAccountService accountService,
             IMapper mapper
             )
        {
            _mapper = mapper;
            _messageService = messageService;
            _accountService = accountService;
        }
        //[HttpPost]
        //public ActionResult<ChatMessageResponse> Send(CreateChatMessageRequest model)
        //{
        //    model.SenderId = Account.Id;
        //    var message = _chatService.SendMessage(model);
        //    return Ok(message);
        //}



        //[HttpGet]
        //public ActionResult<MessageResponse> GetAll()
        //{
        //    var messages = _messageService.GetAll();
        //    return Ok(messages);
        //}
        [HttpGet("NewMessageCount")]
        public async Task<ActionResult<IEnumerable<MessageResponse>>> NewNotificationCount()
        {
            var newMessageCount = await _messageService.NewMessageCount(User.GetUserId());
            return Ok(newMessageCount);
        }
        [HttpGet("GetByChatRoomId/{id:int}")]
        public ActionResult<MessageResponse> GetByChatRoomId(int id)
        {
            var messages = _messageService.GetByChatRoomId(id);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<ActionResult<MessageResponse>> CreateMessages(CreateChatMessageRequest model)
        {
            var sender = Account;
            if (sender==null)
            {
                return BadRequest("Not authorized");
            }
            if (sender.Id == model.RecipientId)
            {
                return BadRequest("Cannot send mesage to yourself");
            }

            var recipient = _accountService.GetById(model.RecipientId);
            if (recipient == null) return NotFound();

            model.SenderId = Account.Id;
            model.Created = DateTime.Now;

            var message = _messageService.AddMessage(model);
            if (await _messageService.SaveAllAsync()) return Ok(_mapper.Map<MessageResponse>(message));
            return BadRequest("send message failed");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageResponse>>> GetMessagesForUser()
        {
            //Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

            return Ok(await _messageService.GetMessagesForUser(User.GetUserId()));
        }

        [HttpGet("thread/{userId:int}")]
        public async Task<ActionResult<IEnumerable<MessageResponse>>> GetMessageThread(int userId)
        {
            var currentUserId = User.GetUserId();
            return Ok(await _messageService.GetMessageThread(currentUserId, userId));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var currentUserId = User.GetUserId();
            var message = await _messageService.GetMessage(id);
            if (message.SenderId == currentUserId)
            {
                message.SenderDeleted = true;
            }
            else if (message.RecipientId == currentUserId)
            {
                message.RecipientDeleted = true;
            }
            else return Unauthorized();
            if(message.SenderDeleted && message.RecipientDeleted)
            {
                _messageService.DeleteMessage(message);
            }
            if (await _messageService.SaveAllAsync()) return Ok(new { message = "Message deleted successfully" });
            return BadRequest("Message delete failed");
        }
    }
}
