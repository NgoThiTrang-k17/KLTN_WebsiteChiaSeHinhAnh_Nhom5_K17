using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Hubs;
using WebApi.Interface;
using WebApi.Models.Posts;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PostsController : BaseController
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IPostService _postService;
        private readonly IMapper _mapper;
        private readonly IUserConnectionManager _userConnectionManager;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IHubContext<NotificationUserHub> _notificationUserHubContext;


        public PostsController(
            IWebHostEnvironment webHostEnvironment,
            IPostService postService,
            IMapper mapper,
            IUserConnectionManager userConnectionManager) {
            _webHostEnvironment = webHostEnvironment;
            _postService = postService;
            _mapper = mapper;
            _userConnectionManager = userConnectionManager;
        }
        [HttpGet]
        public ActionResult<IEnumerable<PostResponse>> GetAll()
        {
            var posts = _postService.GetAll();
            return Ok(posts);

        }
        [HttpPost]
        public ActionResult<PostResponse> Create (CreatePostRequest model)
        {
            var post = _postService.CreatePost(model);
            post.OwnerId = Account.Id;

            return Ok(post);
        }
        [Authorize]
        [HttpPut("{id:int}")]
        public ActionResult<PostResponse> Update(int id, UpdatePostRequest model)
        {
            
            var post = _postService.UpdatePost(id, model);

            return Ok(post);
        }
        [HttpGet]
        private ActionResult<IEnumerable<PostResponse>> GetPath()
        {
            string path = _webHostEnvironment.ContentRootPath;
            return Ok(path);
        }


        //[HttpPost]
        //public void SendToSpecificUser(Post model)
        //{
        //    var connections = _userConnectionManager.GetUserConnections(model.OwnerId);
        //    if (connections != null && connections.Count > 0)
        //    {
        //        foreach (var connectionId in connections)
        //        {
        //             _notificationUserHubContext.Clients.Client(connectionId.SendAsync("sendToUser", model.Title, model.OwnerId));
        //        }
        //    }
            
        //}

    }
}
