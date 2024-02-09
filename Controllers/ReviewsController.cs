using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using MovieReviewer.Data;
using MovieReviewer.Models;
using NuGet.Common;

namespace MovieReviewer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {

        // ----------------- Database and constructor ------------------------
        private readonly DatabaseContext _context;

        public ReviewsController(DatabaseContext context)
        {
            _context = context;
        }

        // ----------------- API FUNCTIONS ------------------------


        //GET: fetch a list of all reviews.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReviewFromId(int id)
        {
            var result = await _context.Reviews.FindAsync(id);
            
            if(result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        // POST: Create new review
        [HttpPost, Authorize]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            //Find movie and include it's reviews. 
            var result = await _context.Movies
                    .Include(movie => movie.Reviews)
                    .FirstOrDefaultAsync(obj => obj.Id == review.MovieId);


            review.UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);


            if (result == null)
            {
                return NotFound(result);
            }


            result.Reviews.Add(review);
            _context.Reviews.Add(review);

            await _context.SaveChangesAsync();

            return Ok();
        }



        // PUT: Update a review
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> PutReview(int id, Review newReview)
        {

            var result = await _context.Reviews.FindAsync(id);

            //Error checking
            if (id != newReview.Id)
            {
                return BadRequest("ID's don't match");
            }
            if (result == null)
            {
                return NotFound("No review with that id exists");
            }
            //Below is success
            result.Comment = newReview.Comment;
            result.Score = newReview.Score;

            _context.Entry(result).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // DELETE: Delete a review
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //GET all reviews made my a specific user
        [HttpGet("User"), Authorize]
        public async Task<IActionResult> GetUsersReview()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (currentUserId == null)
            {
                return NotFound("No user found");
            }

            var result = await _context.Reviews.Where(obj => obj.UserId == currentUserId).ToListAsync();
            if (result.Count <= 0)
            {
                return NoContent();
            }

            return Ok(result);
        }


        // ------- PRIVATE METHODS --------
        private bool ReviewExists(int id)
        {
            return _context.Reviews.Any(e => e.Id == id);
        }
    }
}
