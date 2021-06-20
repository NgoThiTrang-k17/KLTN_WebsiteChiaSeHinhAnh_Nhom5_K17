using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Reports;

namespace WebApi.Services
{
    public interface IReportService
    {
        Task<ReportResponse> CreateReport(CreateReportRequest model);
        Task<ReportResponse> UpdateReport(int id, UpdateReportRequest model); 
        void DeleteReport(int id);
        Task<IEnumerable<ReportResponse>> GetAll();  
        Task<bool> SaveAllAsync();
        Task<Connection> GetConnection(string connectionId);
    }
    public class ReportService : IReportService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        private readonly IAccountService _accountService;
        public ReportService(DataContext context,
            IMapper mapper,
            IAccountService accountService)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
        }

        //Create
        public async Task<ReportResponse> CreateReport(CreateReportRequest model)
        {
            var report = _mapper.Map<Report>(model);
            if (report == null) throw new AppException("Create Report failed");
            
            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
            return _mapper.Map<ReportResponse>(report);
        }

        //Update
        public async Task<ReportResponse> UpdateReport(int id, UpdateReportRequest model)
        {
            var Report = getReport(id);
            if (Report == null) throw new AppException("Update Report failed");
            _mapper.Map(model, Report);
  
            _context.Reports.Update(Report);
            await _context.SaveChangesAsync();
            return _mapper.Map<ReportResponse>(Report);
        }

        //Delete
        public async void DeleteReport(int id)
        {
            var Report = getReport(id);
            _context.Reports.Remove(Report);
            await _context.SaveChangesAsync();
        }

        //Get all Report
        public async Task<IEnumerable<ReportResponse>> GetAll()
        {

            var Reports = await _context.Reports.ToListAsync();
            
            return _mapper.Map<IList<ReportResponse>>(Reports);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        //Helper methods
        private Report getReport(int id)
        {
            var Report = _context.Reports.Find(id);
            if (Report == null) throw new KeyNotFoundException("Report not found");
            return Report;
        }
    }
}
