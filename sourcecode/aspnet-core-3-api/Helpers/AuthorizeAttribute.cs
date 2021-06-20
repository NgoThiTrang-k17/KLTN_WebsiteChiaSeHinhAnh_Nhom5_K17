using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly IList<UserRole> _roles;

    public AuthorizeAttribute(params UserRole[] roles)
    {
        _roles = roles ?? new UserRole[] { };
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var account = (User)context.HttpContext.Items["Account"];
        if (account == null  /*||(_roles.Any() && !_roles.Contains(account.Role))*/)
        {
            // not logged in or role not authorized
            context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
        }
    }
}