using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;

namespace WebApi.Services
{
    public interface INotificationService
    {
        void PublishNotification();//subscribe-user
        void SendNotification(IEnumerable<Account> acounts);//target-user
    }
    public class NotificationService : INotificationService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly IEmailService _emailService;
        public NotificationService(
            DataContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _emailService = emailService;
        }


        public void PublishNotification()
        {
            var acounts = _context.Accounts;
            SendNotification(acounts);
        }

        public void SendNotification(IEnumerable<Account> acounts)
        {

        }
    }
}

