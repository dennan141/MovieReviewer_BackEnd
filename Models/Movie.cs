using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using MovieReviewer.Data;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieReviewer.Models
{
    public class Movie
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public int ReleaseYear { get; set; }
        public List<Review>? Reviews { get; set; } = new List<Review>();
        [ForeignKey("AspNetUsers")]
        public int UserId { get; set; }

        public Movie(string title, int releaseYear)
        {
            Title = title;
            ReleaseYear = releaseYear;
        }

        public Movie()
        {

        }
    }
}
