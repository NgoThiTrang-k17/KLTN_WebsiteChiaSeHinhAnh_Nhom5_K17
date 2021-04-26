using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
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
