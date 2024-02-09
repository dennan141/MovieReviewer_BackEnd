using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieReviewer.Data;
using MovieReviewer.Models;

namespace MovieReviewer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        // ----------------- Database and constructor ------------------------
        private readonly DatabaseContext _context;

        public MoviesController(DatabaseContext context)
        {
            _context = context;
        }


        // ----------------- API FUNCTIONS ------------------------

        // GET: Fetch all movies 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }


        // GET: Fetch specific movie from ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }
            movie.Reviews = GetReviews(movie);

            return movie;
        }


        // GET: All reviews from a movie ID
        //Returns a list of all reviews to that movie
        [HttpGet("{id}/reviews")]
        public async Task<ActionResult<List<Review>>> GetMovieReviews(int id)
        {
            var movie = await _context.Movies.FindAsync(id);


            if (movie == null)
            {
                //404 
                return NotFound();
            }
            
            var reviews = GetReviews(movie);
            if (reviews.Count == 0)
            {
                //204, movie found but no reviews
                return NoContent();
            }
            //Return list of reviews and 200
            return reviews;
        }


        // PUT: Update a movie from movie ID
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> PutMovie(int id, Movie movie)
        {
            if (id != movie.Id)
            {
                return BadRequest();
            }

            _context.Entry(movie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
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

        // POST: Create a new movie
        [HttpPost, Authorize]
        public async Task<ActionResult<Movie>> PostMovie(Movie movie)
        {
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovie", new { id = movie.Id }, movie);
        }

        // DELETE: Remove a movie from ID
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // ----------------- PRIVATE FUNCTIONS ------------------------
        private bool MovieExists(int id)
        {
            return _context.Movies.Any(e => e.Id == id);
        }

        //Find and return a list of all reviews belonging to a movie
        private List<Review> GetReviews(Movie movie)
        {
            return _context.Reviews.Where(e => e.MovieId == movie.Id).ToList();
        }
    }
}
