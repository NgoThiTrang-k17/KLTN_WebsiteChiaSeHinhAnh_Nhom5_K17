using RestSharp.Extensions;
using System;
using System.Collections.Generic;

namespace WebApi.Entities
{
    public class ChatRoom
    {
        public int Id { get; set; }
        public List<Account> MemberId { get; set; }
        public List<string> Nickname { get; set; }
        public List<ChatMessage> Messages { get; set; }

        public string Password { get; set; }
        public bool PasswordRequired => Password.HasValue();

        public bool HaveMember(int id)
        {
            return this.MemberId?.Find(x => x.Id == id) != null;
        }
    }
}
