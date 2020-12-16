using AutoMapper;
using WebApi.Entities;
using WebApi.Models.Accounts;
using WebApi.Models.Comments;
using WebApi.Models.Notification;
using WebApi.Models.Posts;

namespace WebApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        // mappings between model and entity objects
        public AutoMapperProfile()
        {
            //
            CreateMap<Notification, NotificationResponse>();
            CreateMap<CreateNotificationRequest, Notification>();
            //
            CreateMap<Post , PostResponse>();

            CreateMap<CreatePostRequest, Post>();

            CreateMap<UpdatePostRequest, Post>();
            //
            CreateMap<Comment, CommentResponse>();

            CreateMap<CreateCommentRequest, Comment>();
            //
            CreateMap<Account, AccountResponse>();

            CreateMap<Account, AuthenticateResponse>();

            CreateMap<RegisterRequest, Account>();

            CreateMap<CreateRequest, Account>();

            CreateMap<UpdateRequest, Account>()
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        // ignore null & empty string properties
                        if (prop == null) return false;
                        if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                        // ignore null role
                        if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

                        return true;
                    }
                ));
        }
    }
}