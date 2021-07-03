using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public enum ReportTarget
    {
        User, Post, Comment
    }
    public enum ReportType
    {
        User, Post, Comment
    }
    public class Report
    {
        public int Id { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public int OwnerId { get; set; }
        public ReportTarget TargetType { get; set; }
        public int TargetId { get; set; }
        public string ReportType { get; set; }
        public string Detail { get; set; }
    }
}
