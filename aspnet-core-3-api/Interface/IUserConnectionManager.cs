using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Interface
{
    public  interface IUserConnectionManager
    {
        void KeepUserConnection(int userId, int connectionId);
        void RemoveUserConnection(int connectionId);
        List<string> GetUserConnections(int userId);
    }
}
