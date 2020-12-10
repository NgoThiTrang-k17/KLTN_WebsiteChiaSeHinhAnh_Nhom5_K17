using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Comments;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController : BaseController
    {
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;

        public CommentController(
            ICommentService commentService,
            IMapper mapper)
        {
            _commentService = commentService;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<CommentResponse>> GetAll()
        {
            var comments = _commentService.GetAll();
            return Ok(comments);
        }

        [HttpGet("{id:int}")]
        public ActionResult<IEnumerable<CommentResponse>> GetAllByPostId(int id)
        {
            var comments = _commentService.GetAllByPostId(id);
            return Ok(comments);
        }
        [HttpPost]
        public IActionResult Create(CreateCommentRequest comment)
        {
            var model = new CreateCommentRequest
            {
                Content = comment.Content,
                DateCreated = DateTime.Now,
                OwnerId = //Account.Id, 
                comment.OwnerId, 
                PostId = comment.PostId
                
            };
            _commentService.CreateComment(model);
            return Ok(new { message = "Adding comment succesful!" });
        }
    }
}
