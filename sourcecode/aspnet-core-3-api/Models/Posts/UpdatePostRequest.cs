using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Posts
{
    public class UpdatePostRequest
    {
        private string _title;
        private string _description; 
        private string _categories;
        private string _path;



        public string Title
        {
            get => _title;
            set => _title = replaceEmptyWithNull(value);
        }
        public string Description
        {
            get => _description;
            set => _description = replaceEmptyWithNull(value);
        }
        public string Categories
        {
            get => _categories;
            set => _categories = replaceEmptyWithNull(value);
        }
        public string Path
        {
            get => _path;
            set => _path = replaceEmptyWithNull(value);
        }

        private string replaceEmptyWithNull(string value)
        {
            // replace empty string with null to make field optional
            return string.IsNullOrEmpty(value) ? null : value;
        }
    }
}