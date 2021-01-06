using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApi.Models.Follows;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FollowsController : BaseController
    {
        private readonly IFollowService _followService;
        public FollowsController(
             IFollowService followService
             )
        {
            _followService = followService;

        }

        [HttpPost]
        public ActionResult<FollowResponse> Create(CreateFollowRequest model)
        {
            model.FollowerId = Account.Id;
            model.Status = Entities.Status.Created;
            var follow = _followService.CreateFollow(model);
            return Ok(follow);
        }

        [HttpPut("{id:int}")]
        public ActionResult<FollowResponse> Update(int id, UpdateFollowRequest model)
        {
            var follow = _followService.UpdateFollow(id, model);
            return Ok(follow);
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            _followService.DeleteFollow(id);
            return Ok(new { message = "Follow deleted successfully" });
        }

        [HttpDelete("DeleteByAccountId/{id:int}")]
        public IActionResult DeleteByAccountId(int id)
        {
            _followService.DeleteFollowByAccountId(id, Account.Id);
            return Ok(new { message = "Follow deleted successfully" });
        }


        [HttpGet("GetAll")]
        public ActionResult<IEnumerable<FollowResponse>> GetAll()
        {
            var follows = _followService.GetAll();
            return Ok(follows);
        }
        [HttpGet("GetAllByPostId/{id:int}")]
        public ActionResult<IEnumerable<FollowResponse>> GetAllByPostId(int id)
        {
            var follows = _followService.GetAllByUserId(id);
            return Ok(follows);
        }

        [HttpGet("GetState/{accountId:int}")]
        public ActionResult<FollowState> GetState(int accountId)
        {

            var state = _followService.GetState(accountId,Account.Id);
            return Ok(state);
        }

    }
}
