using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.Entities;
using WebApi.Helpers;

namespace WebApi.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Controller]
    public abstract class BaseController : ControllerBase
    {
        // returns the current authenticated account (null if not logged in)
        public User Account => (User)HttpContext.Items["Account"];

        
    }
}
