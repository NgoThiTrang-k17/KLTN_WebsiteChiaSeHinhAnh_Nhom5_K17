using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApi.Models.Comments;

namespace WebApi.Helpers
{
    public static class DataManager
    {
        public static List<CommentResponse> GetData()
        {
            var r = new Random();
            return new List<CommentResponse>()
        {
           new CommentResponse { Content = "Data1" },
           new CommentResponse { Content = "Data2" },
           new CommentResponse { Content = "Data3" },
           new CommentResponse { Content = "Data4" }
        };

        }
    }
    public class ChartModel
    {
        public List<int> Data { get; set; }
        public string Label { get; set; }

        public ChartModel()
        {
            Data = new List<int>();
        }
    }
    public class ChartHub : Hub
    {
        public async Task BroadcastChartData(List<ChartModel> data, string connectionId)
            => await Clients.Client(connectionId).SendAsync("broadcastchartdata", data);

        public string GetConnectionId() => Context.ConnectionId;
    }
}
