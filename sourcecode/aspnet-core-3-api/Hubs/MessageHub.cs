using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Extensions;
using WebApi.Models.Chats;
using WebApi.Services;

namespace WebApi.Hubs
{
    public class MessageHub : Hub
    {
        private readonly IMessageService _messageService;
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;

        public MessageHub(IMessageService messageService, IAccountService accountService,
            IMapper mapper, IHubContext<PresenceHub> presenceHub, PresenceTracker tracker)
        {
            _messageService = messageService;
            _accountService = accountService;
            _mapper = mapper;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUserId = int.Parse(httpContext.Request.Query["userId"]);
            var currentUserId = Context.User.GetUserId();
            string groupName = GetGroupName(otherUserId, currentUserId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var userMessages = await _messageService.GetMessagesForUser(Context.User.GetUserId());
            await Clients.Caller.SendAsync("ReceiveUserMessages", userMessages);

            var messages = await _messageService.GetMessageThread(currentUserId, otherUserId);
            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }



        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateChatMessageRequest model)
        {
            var senderId = Context.User.GetUserId();

            if (senderId == model.RecipientId)
            {
                throw new HubException("Cannot send mesage to yourself");
            }
            var sender = _accountService.GetById(senderId);
            var recipient = _accountService.GetById(model.RecipientId);
            if (recipient == null) throw new HubException("User not found");

            model.SenderId = sender.Id;
            model.Created = DateTime.Now;
            var groupName = GetGroupName(sender.Id, recipient.Id);
            var group = await _messageService.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.UserId == recipient.Id))
            {
                model.Read = DateTime.Now;
            }
            else
            {
                var connections = await _tracker.GetConnectionForUser(recipient.Id);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", new { userId = sender.Id, name = sender.Name });
                }
            }

            var message = _messageService.AddMessage(model);

            if (await _messageService.SaveAllAsync())
            {
                var response = _mapper.Map<MessageResponse>(message);
                if (sender != null && recipient != null)
                {
                    response.SenderName = sender.Name;
                    response.SenderAvatarPath = sender.AvatarPath;
                    response.RecipientName = recipient.Name;
                    response.RecipientAvatarPath = recipient.AvatarPath;

                }
                await Clients.Group(groupName).SendAsync("NewMessage", response);
            }
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _messageService.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUserId());
            if (group == null)
            {
                group = new Group(groupName);
                _messageService.AddGroup(group);
            }
            group.Connections.Add(connection);

            if (await _messageService.SaveAllAsync()) return group;
            throw new HubException("Fail to join the chat");
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _messageService.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _messageService.RemoveConnection(connection);
            if (await _messageService.SaveAllAsync()) return group;
            throw new HubException("Fail to remove from the chat");
        }

        private string GetGroupName(int otherUserId, int currentUserId)
        {
            return currentUserId < otherUserId ? $"{currentUserId}-{otherUserId}" : $"{otherUserId}-{currentUserId}";
        }

    }
}
