using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Reports;
using WebApi.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportsController : BaseController
    {

        private readonly IReportService _reportService;
        public ReportsController(IReportService reportService
            )
        {
            _reportService = reportService;
        }

        [HttpGet]
        public async Task<IEnumerable<ReportResponse>> Get()
        {
           return await _reportService.GetAll();
        }

        [HttpPost]
        public async Task<ReportResponse> Create(CreateReportRequest model)
        {
            return await _reportService.CreateReport(model);
        }

        [HttpPut("{id}")]
        public async Task<ReportResponse> Update(int id, UpdateReportRequest model)
        {
            return await _reportService.UpdateReport(id, model);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _reportService.DeleteReport(id);
        }
    }
}
