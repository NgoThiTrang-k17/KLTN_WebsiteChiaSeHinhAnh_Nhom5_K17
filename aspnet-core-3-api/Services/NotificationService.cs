using AutoMapper;
using Microsoft.Extensions.Options;

using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Notification;

namespace WebApi.Services
{
    public interface INotificationService
    {
        public void AddNotification(CreateNotificationRequest model);
        IEnumerable<NotificationResponse> GetAll();
        IEnumerable<NotificationResponse> GetByUserId(int id);
    }
    public class NotificationService : INotificationService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly IEmailService _emailService;
        public NotificationService(DataContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _emailService = emailService;
        }
        public void AddNotification(CreateNotificationRequest model)
        {
            var comment = _mapper.Map<Notification>(model);
            _context.Notifications.Add(comment);
            _context.SaveChanges();
        }

        public IEnumerable<NotificationResponse> GetAll()
        {

            var notifications = _context.Notifications;
            return _mapper.Map<IList<NotificationResponse>>(notifications);
        }
        public IEnumerable<NotificationResponse> GetByUserId(int id)
        {

            var notifications = _context.Notifications.Where(p => p.ReiceiverId == id);
            return _mapper.Map<IList<NotificationResponse>>(notifications);
        }

    }
}
