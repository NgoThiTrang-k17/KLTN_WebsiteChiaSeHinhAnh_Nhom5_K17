﻿//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.SignalR;
//using WebApi.Interface;

//namespace WebApi.Hubs
//{
//    public class NotificationUserHub : Hub

//    {
//        private readonly IUserConnectionManager _userConnectionManager;

//        public NotificationUserHub(IUserConnectionManager userConnectionManager)
//        {
//            _userConnectionManager = userConnectionManager;
//        }
//        public string GetConnectionId()
//        {
//            var httpContext = this.Context.GetHttpContext();
//            var userId = httpContext.Request.Query["userId"];
//            _userConnectionManager.KeepUserConnection(userId, Context.ConnectionId);

//            return Context.ConnectionId;
//        }

//        //Called when a connection with the hub is terminated.
//        public async override Task OnDisconnectedAsync(Exception exception)
//        {
//            //get the connectionId
//            var connectionId = Context.ConnectionId;
//            _userConnectionManager.RemoveUserConnection(connectionId);
//            var value = await Task.FromResult(0);//adding dump code to follow the template of Hub > OnDisconnectedAsync
//        }
//    }

//}
