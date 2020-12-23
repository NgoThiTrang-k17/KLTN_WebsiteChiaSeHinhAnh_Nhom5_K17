using AutoMapper;
using WebApi.Entities;
using WebApi.Models.Accounts;
using WebApi.Models.Comments;
using WebApi.Models.Notification;
using WebApi.Models.Posts;
using WebApi.Models.Reactions;

namespace WebApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        // mappings between model and entity objects
        public AutoMapperProfile()
        {
            //Reaction
            CreateMap<Reaction, AccountResponse>();

            CreateMap<CreateReactionRequest, Reaction>();

            CreateMap<UpdateReactionRequest, Reaction>();
            //Notification
            CreateMap<Notification, NotificationResponse>();

            CreateMap<CreateNotificationRequest, Notification>();

            CreateMap<UpdateNotificationRequest, Notification>();
            //Post
            CreateMap<Post , PostResponse>();

            CreateMap<CreatePostRequest, Post>();

            CreateMap<UpdatePostRequest, Post>();
            //Comment
            CreateMap<Comment, CommentResponse>();

            CreateMap<CreateCommentRequest, Comment>();

            CreateMap<UpdateCommentRequest, Comment>();
            //Account
            CreateMap<Account, AccountResponse>();

            CreateMap<Account, AuthenticateResponse>();

            CreateMap<RegisterRequest, Account>();

            CreateMap<CreateAccountRequest, Account>();

            CreateMap<UpdateAccountRequest, Account>()
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