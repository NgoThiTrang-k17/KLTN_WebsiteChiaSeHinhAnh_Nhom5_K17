using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using WebApi.Entities;
using WebApi.Models.Notifications;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotificationController : BaseController
    {
        private readonly INotificationService _notificationService;
        public NotificationController(
             INotificationService notificationService
             )
        {
            _notificationService = notificationService;

        }

        [HttpGet("NewNotificationCount/{id:int}")]
        public ActionResult<IEnumerable<NotificationResponse>> NewNotificationCount(int id)
        {
            var notifications = _notificationService.NewNotificationCount(id);
            return Ok(notifications);
        }

        [HttpGet]
        public ActionResult<IEnumerable<NotificationResponse>> GetAll()
        {
            var notifications = _notificationService.GetAll();
            return Ok(notifications);
        }
        [HttpGet("GetAllByUserId/{id:int}")]
        public ActionResult<IEnumerable<NotificationResponse>> GetAllByUserId(int id)
        {
            var notifications = _notificationService.GetAllByUserId(id);
            return Ok(notifications);
        }

        [HttpPost]
        public ActionResult<NotificationResponse> Create(CreateNotificationRequest model)
        {
            var notification = _notificationService.CreateNotification(model);
            return Ok(notification);
        }

        [HttpPut("UpdateNotificationStatus/{id:int}")]
        public ActionResult<NotificationResponse> UpdateNotificationStatus(int id, Status status)
        {
            var notification = _notificationService.UpdateNotificationStatus(id, status);
            return Ok(notification);
        }

        [HttpPut("{id:int}")]
        public ActionResult<NotificationResponse> Update(int id, UpdateNotificationRequest model)
        {
            var notification = _notificationService.UpdateNotification(id, model);
            return Ok(notification);
        }

        //[Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            _notificationService.DeleteNotification(id);
            return Ok(new { message = "Notification deleted successfully" });
        }
    }
}
