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
        ChatMessageResponse Create(CreateChatMessageRequest model);
        IEnumerable<ChatMessageResponse> GetAll();
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

        public ChatMessageResponse Create(CreateChatMessageRequest model)
        {
            var message = _mapper.Map<ChatMessage>(model);
            _context.ChatMessages.Add(message);
            _context.SaveChanges();
            return _mapper.Map<ChatMessageResponse>(message);
        }

        public IEnumerable<ChatMessageResponse> GetAll()
        {
            var messages = _context.ChatMessages;
            return _mapper.Map<List<ChatMessageResponse>>(messages);
        }
    }
}
