using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
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
        //private readonly IUserConnectionManager _userConnectionManager;
        //private readonly IHubContext<NotificationHub> _notificationHubContext;
        //private readonly IHubContext<NotificationUserHub> _notificationUserHubContext;


        public PostsController(
            IWebHostEnvironment webHostEnvironment,
            IPostService postService,
            IMapper mapper)
        {
            _webHostEnvironment = webHostEnvironment;
            _postService = postService;
            _mapper = mapper;
        }
        [HttpGet]
        public ActionResult<IEnumerable<PostResponse>> GetAll()
        {
            var posts = _postService.GetAll();
            return Ok(posts);

        }
        //[HttpPost]
        //public ActionResult<PostResponse> Create (CreatePostRequest model)
        //{
        //    var post = _postService.CreatePost(model);
        //    post.OwnerId = Account.Id;
        //
        //    return Ok(post);
        //}

        //[HttpPost]
        //public ActionResult<PostResponse> Create(CreatePostRequest model)
        //{
        //    // Getting Name
        //    //string name = std.Name;
        //    // Getting Image
        //    var image = model.Image;
        //    // Saving Image on Server
        //
        //    if (image.Length > 0)
        //    {
        //        using (var fileStream = new FileStream(image.FileName, FileMode.Create))
        //        {
        //            image.CopyTo(fileStream);
        //        }
        //    }
        //    var post = _postService.CreatePost(model);
        //    return Ok(post);
        //}

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult CreatePost([FromForm] CreatePostRequest post)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    var model = new CreatePostRequest
                    {
                        PostTitle = post.PostTitle,
                        Created = DateTime.Now,
                        ImagePath = dbPath,
                        OwnerId = 1
                    };

                    var temp = _postService.CreatePost(model);

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
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
