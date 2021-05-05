using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using WebApi.Entities;

namespace WebApi.Helpers
{
    public class DataContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }
        
        public DbSet<Post> Posts { get; set; }

        public DbSet<Comment> Comments { get;  set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Follow> Follows { get; set; }

        public DbSet<Reaction> Reactions { get; set; }

        private readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sqlserver database
             options.UseSqlServer(Configuration.GetConnectionString("DefaultTrang"));
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
        internal object Map<T>(object comments)
        {
            throw new NotImplementedException();
        }
    }
}