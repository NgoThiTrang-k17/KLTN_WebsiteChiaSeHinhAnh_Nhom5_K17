using System.Collections.Generic;
using System.Threading.Tasks;
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
        public async Task<ActionResult<IEnumerable<NotificationResponse>>> NewNotificationCount(int id)
        {
            var notifications = await _notificationService.NewNotificationCount(id);
            return Ok(notifications);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationResponse>>> GetAll()
        {
            var notifications = await _notificationService.GetAll();
            return Ok(notifications);
        }
        [HttpGet("GetAllByUserId/{id:int}")]
        public async Task<ActionResult<IEnumerable<NotificationResponse>>> GetAllByUserId(int id)
        {
            var notifications = await _notificationService.GetNotificationThread(id);
            return Ok(notifications);
        }

        [HttpPost]
        public async Task<ActionResult<NotificationResponse>> Create(CreateNotificationRequest model)
        {
            var notification = await _notificationService.CreateNotification(model);
            return Ok(notification);
        }

        [HttpPut("UpdateNotificationStatus/{id:int}")]
        public async Task<ActionResult<NotificationResponse>> UpdateNotificationStatus(int id, Status status)
        {
            var notification = await _notificationService.UpdateNotificationStatus(id, status);
            return Ok(notification);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<NotificationResponse>> Update(int id, UpdateNotificationRequest model)
        {
            var notification =  await _notificationService.UpdateNotification(id, model);
            return Ok(notification);
        }

        //[Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _notificationService.DeleteNotification(id);
            return Ok(new { message = "Notification deleted successfully" });
        }
    }
}
