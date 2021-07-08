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
        public async Task<ActionResult<FollowResponse>> Create(CreateFollowRequest model)
        {
            model.FollowerId = Account.Id;
            model.Status = Entities.Status.Created;
            var follow = await _followService.CreateFollow(model);
            return Ok(follow);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<FollowResponse>> Update(int id, UpdateFollowRequest model)
        {
            var follow = await _followService.UpdateFollow(id, model);
            return Ok(follow);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _followService.DeleteFollow(id);
            return Ok(new { message = "Follow deleted successfully" });
        }

        [HttpDelete("DeleteByAccountId/{id:int}")]
        public async Task<IActionResult> DeleteByAccountId(int id)
        {
            await _followService.DeleteFollowBySubjectId(id, Account.Id);
            return Ok(new { message = "Follow deleted successfully" });
        }


        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<FollowResponse>>> GetAll()
        {
            var follows = await _followService.GetAll();
            return Ok(follows);
        }
        [HttpGet("GetBySubjectId/{id:int}")]
        public async Task<ActionResult<IEnumerable<FollowResponse>>> GetBySubjectId(int id)
        {
            var followers = await _followService.GetBySubjectId(id);
            foreach (FollowResponse follower in followers)
            {
                var followState = await _followService.GetState(follower.FollowerId, Account.Id);
                follower.isFollower_FollowedByCurrentUser = followState.IsCreated;
            }
            return Ok(followers);
        }

        [HttpGet("GetByFollowerId/{id:int}")]
        public async  Task<ActionResult<IEnumerable<FollowResponse>>> GetByFollowerId(int id)
        {
            var subjects = await _followService.GetByFollowerId(id);
            foreach (FollowResponse subject in subjects)
            {
                var followState = await _followService.GetState(subject.SubjectId, Account.Id);
                subject.isSubject_FollowedByCurrentUser = followState.IsCreated;

            }
            return Ok(subjects);
        }

        [HttpGet("GetState/{subjectId:int}")]
        public async Task<ActionResult<FollowState>> GetState(int subjectId)
        {

            var state = await _followService.GetState(subjectId,Account.Id);
            return Ok(state);
        }

    }
}
