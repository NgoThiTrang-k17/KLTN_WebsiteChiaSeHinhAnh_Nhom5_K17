using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApi.Helpers;
using WebApi.Models.Comments;
using WebApi.Models.Notification;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        //private IHubContext<ChartHub> _hub;
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
        [HttpGet("{id:int}")]
        public ActionResult<IEnumerable<NotificationResponse>> GetByUserId(int id)
        {
            var notifications = _notificationService.GetByUserId(id);
            return Ok(notifications);
        }
        //public IActionResult Get()
        //{
        //    List<CommentResponse> respones = DataManager.GetData();
        //    var timerManager = new TimerManager(() => _hub.Clients.All.SendAsync("transferchartdata", respones));
        //    if (timerManager!=null)
        //    return Ok(respones);
        //    else
        //        return Ok(new { Message = "Request Failed" });
        //}
    }
}
