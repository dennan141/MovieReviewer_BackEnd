using Microsoft.AspNetCore.Identity;

namespace MovieReviewer.Models
{
    public class CustomUser : IdentityUser
    {
       public ICollection<Review> Reviews { get; set; }
    }
}
