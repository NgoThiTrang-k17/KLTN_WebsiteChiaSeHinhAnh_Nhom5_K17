using AutoMapper;
using Microsoft.Extensions.Options;

using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Comments;
using WebApi.Models.Notification;

namespace WebApi.Services
{
    public interface INotificationService
    {
        public NotificationResponse CreateNotification(CreateNotificationRequest model);
        public NotificationResponse UpdateNotification(int id, UpdateNotificationRequest model);
        public void DeleteNotification(int id);
        IEnumerable<NotificationResponse> GetAll();
        IEnumerable<NotificationResponse> GetAllByUserId(int id);
    }
    public class NotificationService : INotificationService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public NotificationService(DataContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //Create
        public NotificationResponse CreateNotification(CreateNotificationRequest model)
        {
            var notification = _mapper.Map<Notification>(model);
            if (notification == null) throw new AppException("Create Notification failed");
            _context.Notifications.Add(notification);
            _context.SaveChanges();
            return _mapper.Map<NotificationResponse>(notification);
        }

        //Update
        public NotificationResponse UpdateNotification(int id, UpdateNotificationRequest model)
        {
            var notification = getNotification(id);
            if (notification == null) throw new AppException("Update Notification failed");
            _mapper.Map(model, notification);
            _context.Notifications.Update(notification);
            _context.SaveChanges();
            return _mapper.Map<NotificationResponse>(notification);
        }

        //Delete
        public void DeleteNotification(int id)
        {
            var notification = getNotification(id);
            _context.Notifications.Remove(notification);
            _context.SaveChanges();

        }

        //Get all notification
        public IEnumerable<NotificationResponse> GetAll()
        {

            var notifications = _context.Notifications;
            return _mapper.Map<IList<NotificationResponse>>(notifications);
        }

        //Get notifications for each user
        public IEnumerable<NotificationResponse> GetAllByUserId(int id)
        {

            var notifications = _context.Notifications.Where(p => p.ReiceiverId == id);
            return _mapper.Map<IList<NotificationResponse>>(notifications);
        }

        //Helper methods
        private Notification getNotification(int id)
        {
            var notification = _context.Notifications.Find(id);
            if (notification == null) throw new KeyNotFoundException("Notification not found");
            return notification;
        }

    }
}
