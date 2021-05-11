using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Chats;

namespace WebApi.Services
{
    public interface IChatService
    {
        ChatMessageResponse SendMessage(CreateChatMessageRequest model);
        void DeleteMessage(int id);
        IEnumerable<ChatMessageResponse> GetAll();
        IEnumerable<ChatMessageResponse> GetByChatRoomId(int id);
    }
    public class ChatService : IChatService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public ChatService(
            DataContext context,
            IMapper mapper,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;
        }

        public ChatMessageResponse SendMessage(CreateChatMessageRequest model)
        {

            var message = _mapper.Map<ChatMessage>(model);
            _context.ChatMessages.Add(message);
           
            if (!IsExistChatRoom(model.OwnerId, model.ReceiverId))
            {
                //create chatroom if not exist
                var chatRoom = new ChatRoom();
                chatRoom.MemberId.Add(model.OwnerId);
                chatRoom.MemberId.Add(model.ReceiverId);
                chatRoom.Messages.Add(message);
                _context.ChatRooms.Add(chatRoom);
            }
            else
            {
                var chatRoom = _context.ChatRooms.Find(model.ChatRoomId);
                chatRoom.Messages.Add(message);
                _context.ChatRooms.Update(chatRoom);
            }
            _context.SaveChanges();
            return _mapper.Map<ChatMessageResponse>(message);
        }

        public void DeleteMessage(int id)
        {
            var message = GetMessage(id);
            _context.Remove(message);
            _context.SaveChanges();
        }

        public IEnumerable<ChatMessageResponse> GetAll()
        {
            var messages = _context.ChatMessages;
            return _mapper.Map<List<ChatMessageResponse>>(messages);
        }

        public IEnumerable<ChatMessageResponse> GetByChatRoomId(int id)
        {
            var messages = _context.ChatRooms.Find(id).Messages;
            return _mapper.Map<List<ChatMessageResponse>>(messages);
        }

        private ChatMessage GetMessage(int id)
        {
            var messages = _context.ChatMessages.Find(id);
            if (messages == null) throw new KeyNotFoundException("Comment not found");
            return messages;
        }

        private bool IsExistChatRoom(int firstAccountId, int secondAccountId)
        {
            var chatRoomCount = _context.ChatRooms.Count(c => c.HaveMember(firstAccountId)
                             && c.HaveMember(secondAccountId)
                             && c.MemberId.Count() == 2);
            if (chatRoomCount == 1)
                return true;
            else return false;
        }
    }
}
