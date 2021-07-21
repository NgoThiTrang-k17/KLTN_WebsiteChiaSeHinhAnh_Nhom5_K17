using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Chats;

namespace WebApi.Services
{
    public interface IMessageService
    {
        MessageResponse SendMessage(CreateChatMessageRequest model);
        void DeleteMessage(Message message);
        IEnumerable<MessageResponse> GetAll();
        IEnumerable<MessageResponse> GetByChatRoomId(int id);

        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection> GetConnection(string connectionId);
        Task<Group> GetMessageGroup(string groupName);
        Task<Group> GetGroupForConnection(string connectionId);
        Task<Message> AddMessage(CreateChatMessageRequest model);
        Task<Message> GetMessage(int id);
        Task<IEnumerable<MessageResponse>> GetMessagesForUser(int currentUserId);
        Task<IEnumerable<MessageResponse>> GetMessageThread(int currentUserId, int recipientId);
        Task<int> NewMessageCount(int currentUserId);
        Task<bool> SaveAllAsync();
    }
    public class MessageService : IMessageService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;

        public MessageService(
            DataContext context,
            IMapper mapper,
            IAccountService accountService)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
        }

        public MessageResponse SendMessage(CreateChatMessageRequest model)
        {

            //var message = _mapper.Map<Message>(model);
            //_context.Messages.Add(message);

            //if (!IsExistChatRoom(model.SenderId, model.RecipientId))
            //{
            //    var ownerAccount = _accountService.GetById(model.SenderId);
            //    var receiverAccount = _accountService.GetById(model.RecipientId);
            //    _mapper.Map<AppUser>(ownerAccount);
            //    _mapper.Map<AppUser>(receiverAccount);
            //    //create chatroom if not exist
            //    var chatRoom = new ChatRoom();
            //    if (ownerAccount != null && receiverAccount != null)
            //    {
            //        throw new KeyNotFoundException("Account not found");
            //    }
            //    //chatRoom.Accounts.Add(_mapper.Map<Account>(ownerAccount));
            //    //chatRoom.Accounts.Add(_mapper.Map<Account>(receiverAccount));
            //    chatRoom.Messages.Add(message);
            //    _context.ChatRooms.Add(chatRoom);
            //}
            //else
            //{
            //    //var chatRoom = _context.ChatRooms.Find(model.ChatRoomId);
            //    //chatRoom.Messages.Add(message);
            //    //_context.ChatRooms.Update(chatRoom);
            //}
            //_context.SaveChanges();
            //return _mapper.Map<MessageResponse>(message);
            return new MessageResponse();
        }

        public void DeleteMessage(Message message)
        {
            _context.Remove(message);
            _context.SaveChanges();
        }

        public IEnumerable<MessageResponse> GetAll()
        {
            var messages = _context.Messages;
            return _mapper.Map<List<MessageResponse>>(messages);
        }

        public IEnumerable<MessageResponse> GetByChatRoomId(int id)
        {
            var messages = _context.Messages.Find(id);
            return _mapper.Map<List<MessageResponse>>(messages);
        }

        public async Task<Message> GetMessage(int id)
        {
            var messages = await _context.Messages.FindAsync(id);
            if (messages == null) throw new KeyNotFoundException("Message not found");
            return messages;
        }

        

        //
        public async Task<Message> AddMessage(CreateChatMessageRequest model)
        {
            var message = _mapper.Map<Message>(model);
            await _context.Messages.AddAsync(message);

            return message;
        }


        public async Task<IEnumerable<MessageResponse>> GetMessagesForUser(int currentUserId)
        {
             
            var query = _context.Messages.Where(m=>m.SenderId == currentUserId || m.RecipientId == currentUserId).OrderByDescending(m=>m.Created);
            var messages = _mapper.Map<IEnumerable<MessageResponse>>(query);

            List<MessageResponse> response = new List<MessageResponse>();
            foreach (var message in messages)
            {
                if (!response.Any(m => (m.SenderId == message.SenderId && m.RecipientId == message.RecipientId)))
                {
                    if (!response.Any(m => (m.SenderId == message.RecipientId && m.RecipientId == message.SenderId)))
                    {

                        var sender = await _accountService.getAccount(message.SenderId);
                        var recipient = await _accountService.getAccount(message.RecipientId);
                        if (sender != null && recipient != null)
                        {
                            message.SenderName = sender.Name;
                            message.SenderAvatarPath = sender.AvatarPath;
                            message.RecipientName = recipient.Name;
                            message.RecipientAvatarPath = recipient.AvatarPath;

                        }
                        response.Add(message);
                    
                    }
                }

            }
            //return await PagedList<MessageResponse>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
            return response.OrderBy(m=>m.Created);
;
        }

        public async Task<IEnumerable<MessageResponse>> GetMessageThread(int currentUserId, int recipientId)
        {
            var messages = await _context.Messages
                .Where(m => (m.RecipientId == currentUserId && m.SenderId == recipientId && !m.RecipientDeleted)
                || (m.RecipientId == recipientId && m.SenderId == currentUserId && !m.SenderDeleted))
                .OrderBy(m => m.Created)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.Read == null && m.RecipientId == currentUserId).ToList();
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.Read = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }

            var response = _mapper.Map<IEnumerable<MessageResponse>>(messages);
            var currentUser = await _accountService.getAccount(currentUserId);
            var recipientUser = await _accountService.getAccount(recipientId);
            if (currentUser != null && recipientUser != null)
            {
                foreach (var message in response)
                {
                    if (message.SenderId == currentUserId)
                    {
                        message.SenderName = currentUser.Name;
                        message.SenderAvatarPath = currentUser.AvatarPath;
                        message.RecipientName = recipientUser.Name;
                        message.RecipientAvatarPath = recipientUser.AvatarPath;
                    }
                    else
                    {
                        message.SenderName = recipientUser.Name;
                        message.SenderAvatarPath = recipientUser.AvatarPath;
                        message.RecipientName = currentUser.Name;
                        message.RecipientAvatarPath = currentUser.AvatarPath;
                    }
                }
            }

            return response;
        }

        public async Task<int> NewMessageCount(int currentUserId)
        {

            var query = await _context.Messages.Where(m => m.Read == null && m.RecipientId == currentUserId).ToListAsync();
            var messages = _mapper.Map<IEnumerable<MessageResponse>>(query);

            List<MessageResponse> response = new List<MessageResponse>();
            foreach (var message in messages)
            {
                if (!response.Any(m => (m.SenderId == message.SenderId && m.RecipientId == message.RecipientId)))
                {
                    if (!response.Any(m => (m.SenderId == message.RecipientId && m.RecipientId == message.SenderId)))
                    {
                        response.Add(message);
                    }
                }

            }
           
            return response.Count();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups
                .Include(x=>x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups
                    .Include(c => c.Connections)
                    .Where(c => c.Connections.Any(x => x.ConnectionId == connectionId))
                    .FirstOrDefaultAsync();
        }
    }
}
