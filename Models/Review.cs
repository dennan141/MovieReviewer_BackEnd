using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieReviewer.Models
{
    public class Review
    {
        [Key]   
        public int Id { get; set; }
        public string? Comment { get; set; }
        [Required, Range(1,5)]
        public int Score { get; set; }
        [ForeignKey("Movies")]
        public int MovieId { get; set; }
        [ForeignKey("AspNetUsers"), ValidateNever]
        public string UserId { get; set; }
        
        

        public Review(string? comment, int score)
        {
            Score = score;
            Comment = comment;
        }
        [JsonConstructor]
        public Review()
        {
            
        }
    }
}
