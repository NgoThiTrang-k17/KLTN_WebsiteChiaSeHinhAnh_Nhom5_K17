using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using Nest;
using System.Configuration;

namespace WebApi.Helpers
{
    public static class ElasticsearchExtensions
    {
        public static class ElasticConfig
        {
            public static string IndexName
            {
                get { return ConfigurationManager.AppSettings["indexName"]; }
            }

            public static string ElastisearchUrl
            {
                get { return ConfigurationManager.AppSettings["elastisearchUrl"]; }
            }

            public static IElasticClient GetClient()
            {
                var node = new Uri("http://localhost:9200");
                var settings = new ConnectionSettings(node);
                settings.DefaultIndex(IndexName);
                return new ElasticClient(settings);
            }
        }

    }
}
