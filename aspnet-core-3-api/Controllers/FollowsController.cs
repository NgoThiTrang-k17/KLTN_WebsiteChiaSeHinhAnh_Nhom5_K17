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
        [HttpGet("GetState/{accountId:int}")]
        public ActionResult<FollowState> GetState(int accountId)
        {

            var state = _followService.GetState(accountId,Account.Id);
            return Ok(state);
        }

    }
}
