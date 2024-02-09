using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MovieReviewer.Models;
using System.Data.Common;

namespace MovieReviewer.Data
{
    public class DatabaseContext : IdentityDbContext<CustomUser>
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Review> Reviews { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) :
            base(options)
        {

        }
    }
}
