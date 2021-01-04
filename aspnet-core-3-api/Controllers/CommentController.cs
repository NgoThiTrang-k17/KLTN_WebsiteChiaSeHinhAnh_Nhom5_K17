using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Models.Comments;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController : BaseController
    {
        private readonly ICommentService _commentService;
        public CommentController(
            ICommentService commentService
            )
        {
            _commentService = commentService;
        }

        [HttpGet("GetAll")]
        public ActionResult<IEnumerable<CommentResponse>> GetAll()
        {
            var comments = _commentService.GetAll();
            return Ok(comments);
        }

        [HttpGet("GetAllByPostId/{id:int}")]
        public ActionResult<IEnumerable<CommentResponse>> GetAllByPostId(int id)
        {
            var comments = _commentService.GetAllByPostId(id);
            return Ok(comments);
        }

        [HttpPost]
        public ActionResult<CommentResponse> Create([FromForm]CreateCommentRequest comment)
        {
            //var model = new CreateCommentRequest
            //{
            //    Content = comment.Content,
            //    DateCreated = DateTime.Now,
            //    OwnerId = Account.Id,
            //    //comment.OwnerId, 
            //    PostId = //Post.Id
            //    comment.PostId
            //};
            comment.DateCreated = DateTime.Now;
            comment.OwnerId = Account.Id;
            _commentService.CreateComment(comment);
            return Ok(comment);
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public ActionResult<CommentResponse> Update(int id, UpdateCommentRequest model)
        {

            var comment = _commentService.UpdateComment(id, model);

            return Ok(comment);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {

            _commentService.DeleteComment(id);
            return Ok(new { message = "Comment deleted successfully" });
        }
    }
}
