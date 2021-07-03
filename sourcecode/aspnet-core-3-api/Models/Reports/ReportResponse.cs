using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;

namespace WebApi.Models.Reports
{
    public class ReportResponse
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
