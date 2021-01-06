﻿using System;
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

        [HttpGet("GetState/{accountId:int}")]
        public ActionResult<FollowState> GetState(int accountId)
        {

            var state = _followService.GetState(accountId,Account.Id);
            return Ok(state);
        }

    }
}