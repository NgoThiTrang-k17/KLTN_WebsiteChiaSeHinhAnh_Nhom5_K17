﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Follows;
using WebApi.Models.Notifications;

namespace WebApi.Services
{
    public interface IFollowService
    {
        FollowResponse CreateFollow(CreateFollowRequest model);
        FollowResponse UpdateFollow(int id, UpdateFollowRequest model);
        void DeleteFollow(int id);
        void DeleteFollowByAccountId(int accountId, int followerId);

        IEnumerable<FollowResponse> GetAll();
        IEnumerable<FollowResponse> GetAllByUserId(int userId);

        FollowState GetState(int accountId, int followerId);
    }
    public class FollowService : IFollowService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        public FollowService(DataContext context,
            IMapper mapper,
            INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        //Create
        public FollowResponse CreateFollow(CreateFollowRequest model)
        {
            var follow = _mapper.Map<Follow>(model);
            if (follow == null) throw new AppException("Create follow failed");
            _context.Follows.Add(follow);
            _context.SaveChanges();
            SendNotification(follow);
            return _mapper.Map<FollowResponse>(follow);
        }

        //Update
        public FollowResponse UpdateFollow(int id, UpdateFollowRequest model)
        {
            var follow = getFollow(id);
            if (follow == null) throw new AppException("Update follow failed");
            _mapper.Map(model, follow);
            _context.Follows.Update(follow);
            _context.SaveChanges();

            return _mapper.Map<FollowResponse>(follow); ;
        }

        //Delete
        public void DeleteFollow(int id)
        {
            var follow = getFollow(id);
            _context.Remove(follow);
            _context.SaveChanges();
        }

        public void DeleteFollowByAccountId(int accountId, int followerId)
        {
            var follow = _context.Follows.Where(follow => follow.SubjectId == accountId && follow.FollowerId == followerId).FirstOrDefault();
            _context.Remove(follow);
            _context.SaveChanges();
        }
        //Get all Follow
        public IEnumerable<FollowResponse> GetAll()
        {
            var follows = _context.Follows;
            return _mapper.Map<List<FollowResponse>>(follows);
        }

        //Get all Follow of each user
        public IEnumerable<FollowResponse> GetAllByUserId(int userId)
        {
            var follows = _context.Follows.Where(follow => follow.SubjectId == userId); ;
            return _mapper.Map<List<FollowResponse>>(follows);
        }

        public FollowState GetState(int subjectId, int followerId)
        {

            var follow = _context.Follows.Where(follow => follow.SubjectId == subjectId && follow.FollowerId == followerId).Count();
            var followState = new FollowState
            {
                IsCreated = 0
            };
            if (follow != 0)
            {
                followState.IsCreated = 1;
                return followState;
            }
            else

                return followState;
        }

        //Helper methods

        private void SendNotification(Follow model)
        {
            var notification = new CreateNotificationRequest
            {
                ActionOwnerId = model.FollowerId,
                NotificationType = NotificationType.FollowRequest,
                PostId = 0,
                ReiceiverId = model.SubjectId,
                Created = DateTime.Now,
                Status = Status.Created
            };
            _notificationService.CreateNotification(notification);
        }

        private Follow getFollow(int id)
        {
            var follow = _context.Follows.Find(id);
            if (follow == null) throw new KeyNotFoundException("Follow not found");
            return follow;
        }
    }
}
