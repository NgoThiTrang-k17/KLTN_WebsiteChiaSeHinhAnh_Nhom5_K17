//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace WebApi.Interface
//{
//    public class UserConnectionManager : IUserConnectionManager
//    {
//        private static Dictionary<int, List<int>> userConnectionMap = new Dictionary<int, List<int>>();
//        private static string userConnectionMapLocker = string.Empty;

//        public void KeepUserConnection(int userId, int connectionId)
//        {
//            lock (userConnectionMapLocker)
//            {
//                if (!userConnectionMap.ContainsKey(userId))
//                {
//                    userConnectionMap[userId] = new List<int>();
//                }
//                userConnectionMap[userId].Add(connectionId);
//            }
//        }

//        public void RemoveUserConnection(int connectionId)
//        {
//            //Remove the connectionId of user 
//            lock (userConnectionMapLocker)
//            {
//                foreach (var userId in userConnectionMap.Keys)
//                {
//                    if (userConnectionMap.ContainsKey(userId))
//                    {
//                        if (userConnectionMap[userId].Contains(connectionId))
//                        {
//                            userConnectionMap[userId].Remove(connectionId);
//                            break;
//                        }
//                    }
//                }
//            }
//        }
//        //public List<String> GetUserConnections(int userId)
//        //{
//        //    var conn = new List<string>();
//        //    lock (userConnectionMapLocker)
//        //    {
//        //        conn = userConnectionMap[userId];
//        //    }
//        //    return conn;
//        //}

//    }

//}
