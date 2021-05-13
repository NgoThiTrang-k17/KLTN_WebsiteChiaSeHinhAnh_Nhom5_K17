using AutoMapper;

using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Notifications;

namespace WebApi.Services
{
    public interface INotificationService
    {
        NotificationResponse CreateNotification(CreateNotificationRequest model);
        NotificationResponse UpdateNotification(int id, UpdateNotificationRequest model);
        NotificationResponse UpdateNotificationStatus(int id, Status status);
        void DeleteNotification(int id);
        IEnumerable<NotificationResponse> GetAll();
        IEnumerable<NotificationResponse> GetAllByUserId(int id);
        int NewNotificationCount(int id);
    }
    public class NotificationService : INotificationService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        private readonly IAccountService _accountService;
        public NotificationService(DataContext context,
            IMapper mapper,
            IAccountService accountService)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
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
        public NotificationResponse UpdateNotificationStatus(int id, Status status)
        {
            var notification = getNotification(id);
            if (notification == null) throw new AppException("Update Notification failed");
            notification.Status = status;
            _context.Notifications.Update(notification);
            _context.SaveChanges();
            return _mapper.Map<NotificationResponse>(notification);
        }

        //Update
        public NotificationResponse UpdateNotification(int id, UpdateNotificationRequest model)
        {
            var notification = getNotification(id);
            if (notification == null) throw new AppException("Update Notification failed");
            //_mapper.Map(model, notification);
            if (notification.Status < model.Status)
                notification.Status = model.Status;
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
            var notificationResponses = _mapper.Map<IList<NotificationResponse>>(notifications);
            foreach (NotificationResponse notificationResponse in notificationResponses)
            {
                var actionOwner = _accountService.GetById(notificationResponse.ActionOwnerId);

                bool IsActionOwnerNameNull = actionOwner.Name == null;
                notificationResponse.ActionOwnerName = IsActionOwnerNameNull ? "" : actionOwner.Name;

                notificationResponse.ActionOwnerAvatarPath = actionOwner.AvatarPath;

                var receiver = _accountService.GetById(notificationResponse.ReiceiverId);
                bool IsReceiverNull = receiver.Name == null;
                notificationResponse.ReiceiverName = IsReceiverNull ? "" : receiver.Name;
            }
            return _mapper.Map<IList<NotificationResponse>>(notificationResponses);
        }

        //Get notifications for each user
        public IEnumerable<NotificationResponse> GetAllByUserId(int id)
        {

            var notifications = _context.Notifications.Where(p => p.ReiceiverId == id);
            var notificationResponses = _mapper.Map<IList<NotificationResponse>>(notifications);
            foreach (NotificationResponse notificationResponse in notificationResponses)
            {
                var actionOwner = _accountService.GetById(notificationResponse.ActionOwnerId);
                bool IsActionOwnerNameNull = actionOwner.Name == null;
                notificationResponse.ActionOwnerName = IsActionOwnerNameNull ? "" : actionOwner.Name;

                notificationResponse.ActionOwnerAvatarPath = actionOwner.AvatarPath;

                var receiver = _accountService.GetById(notificationResponse.ReiceiverId);
                bool IsReceiverNull = receiver.Name == null;
                notificationResponse.ReiceiverName = IsReceiverNull ? "" : receiver.Name;
            }
            return _mapper.Map<IList<NotificationResponse>>(notificationResponses);
        }

        //Get notifications for each user
        public int NewNotificationCount(int id)
        {

            var notifications = _context.Notifications.Where(p => p.ReiceiverId == id && p.Status == 0);
            var notificationResponses = _mapper.Map<IList<NotificationResponse>>(notifications);
            return notificationResponses.Count();
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
