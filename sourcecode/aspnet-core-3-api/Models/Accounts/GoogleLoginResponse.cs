﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Accounts
{
    public class GoogleLoginResponse
    {
        [Required]
        public string IdToken { get; set; }
    }
}
