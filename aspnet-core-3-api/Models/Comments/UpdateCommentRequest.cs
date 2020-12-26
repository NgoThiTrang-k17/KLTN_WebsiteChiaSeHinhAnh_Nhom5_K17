using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Comments
{
    public class UpdateCommentRequest
    {
        private string _content;
 

        public string Content
        {
            get => _content;
            set => _content = replaceEmptyWithNull(value);
        }
        

        // helpers

        private string replaceEmptyWithNull(string value)
        {
            // replace empty string with null to make field optional
            return string.IsNullOrEmpty(value) ? null : value;
        }

    }
}
