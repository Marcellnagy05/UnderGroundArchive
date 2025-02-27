﻿using Microsoft.AspNetCore.Mvc;
using UnderGroundArchive_Backend.Dbcontext;
using Microsoft.EntityFrameworkCore;
using UnderGroundArchive_Backend.Models;
using UnderGroundArchive_Backend.DTO;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace UnderGroundArchive_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UGA_DBContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(UserManager<ApplicationUser> userManager, UGA_DBContext dBContext)
        {
            _dbContext = dBContext;
            _userManager = userManager;
        }

        //Achievement helper function
        private async Task GrantAchievementIfEligible(string userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null) return;

            int writtenCommentCount = await _dbContext.Comments.CountAsync(b => b.CommenterId == userId);
            var achievementsToCheck = new List<(int AchievementId, int RequiredComments)>
            {
                (4, 1),  //First Words – Write your first comment
                (5, 10),  // Engaged Reader – Write 10 comments
                (6, 50)  // Top Reviewer – Write 50 comments
            };

            foreach (var (achievementId, RequiredComments) in achievementsToCheck)
            {
                if (writtenCommentCount >= RequiredComments)
                {
                    bool achievementExists = await _dbContext.CompletedAchievements
                        .AnyAsync(ca => ca.AchievementId == achievementId && ca.CompleterId == userId);

                    if (!achievementExists)
                    {
                        var achievement = await _dbContext.Achievements.FindAsync(achievementId);
                        if (achievement != null)
                        {
                            _dbContext.CompletedAchievements.Add(new CompletedAchievements
                            {
                                AchievementId = achievementId,
                                CompleterId = userId
                            });

                            user.RankPoints += achievement.PointAmount;
                            await _dbContext.SaveChangesAsync();
                        }
                    }
                }
            }
        }

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _dbContext.Users
         .Where(u => u.Id == id)
        .Select(user => new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.JoinDate,
            user.BirthDate,
            user.Country,
            user.RankPoints,
            user.Balance,
            user.IsMuted,
            user.IsBanned,
            RoleName = _dbContext.UserRoles
                        .Where(ur => ur.UserId == user.Id)
                        .Join(_dbContext.Roles,
                              ur => ur.RoleId,
                              r => r.Id,
                              (ur, r) => r.Name)
                        .FirstOrDefault(),
            RankName = _dbContext.Ranks
                        .Where(r => r.RankId == user.RankId)
                        .Select(r => r.RankName)
                        .FirstOrDefault(),
            SubscriptionName = _dbContext.Subscription
                        .Where(s => s.SubscriptionId == user.SubscriptionId)
                        .Select(s => s.SubscriptionName)
                        .FirstOrDefault()
        })
                .SingleOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }


            return Ok(user);
        }

        //test:
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            // A tokenből kinyert felhasználói ID (a JWT-ban található)
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(); // Ha nincs ID, akkor 401-es válasz
            }

            // Felhasználó lekérése az ID alapján, csatlakoztatva a szerepköröket
            var user = await _dbContext.Users
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email,
                    u.PhoneNumber,
                    u.Country,
                    u.BirthDate,
                    u.RankId,
                    u.RankPoints,
                    u.Theme,
                    u.ProfilePictureId,
                    u.SubscriptionId,
                    Role = _dbContext.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(_dbContext.Roles,
                              ur => ur.RoleId,
                              r => r.Id,
                              (ur, r) => r.Name)
                        .FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(); // Ha nincs ilyen felhasználó, akkor 404
            }

            return Ok(user); // A felhasználó adatainak visszaadása
        }


        // Request endpoints

        [HttpGet("myrequests")]
        public async Task<IActionResult> GetAllRequests()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            var requests = await _dbContext.Requests
                .Where(r => r.RequesterId == userId)
                .Select(r => new
                {
                    r.RequestId,
                    r.RequesterId,
                    r.RequestMessage,
                    r.RequestDate,
                    r.IsApproved,
                    r.IsHandled,
                    r.RequestType
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet("myrequest/{id}")]
        public async Task<IActionResult> GetRequest(int id, [FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }
            var request = await _dbContext.Requests
                .Where(r => r.RequesterId == userId)
                .Where(j => j.RequestId == id)
                .Select(r => new
                {
                    r.RequestId,
                    r.RequesterId,
                    r.RequestMessage,
                    r.RequestDate,
                    r.IsApproved,
                    r.IsHandled,
                    r.RequestType
                })
                .FirstOrDefaultAsync();

            return request == null ? NotFound("Request not found.") : Ok(request);
        }

        [HttpPost("createRequest")]
        public async Task<IActionResult> CreateRequest([FromBody]RequestDTO request)
        {
            var requesterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Console.WriteLine($"Token validáció: {User.Identity.IsAuthenticated}");
            Console.WriteLine($"Felhasználó azonosító: {requesterId}");

            if (string.IsNullOrEmpty(requesterId))
            {
                return Unauthorized("User is not authenticated.");
            }

            var newRequest = new Requests
            {
                RequesterId = requesterId,
                RequestMessage = request.RequestMessage,
                RequestType = request.RequestType,
                RequestDate = DateTime.Now, 
                IsApproved = false,
                IsHandled = false
            };

            _dbContext.Requests.Add(newRequest);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Request created successfully", RequestId = newRequest.RequestId });
        }

        //report endpoints

        [HttpGet("myreports")]
        public async Task<IActionResult> GetAllReports([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }
            var reports = await _dbContext.Reports
                 .Where(r => r.ReporterId == userId)
                .Select(r => new
                {
                    r.ReportId,
                    r.ReporterId,
                    r.ReportedPersonId,
                    r.ReportedCommentId,
                    r.ReportedBookId,
                    r.ReportTypeId,
                    r.ReportMessage,
                    r.IsHandled,
                    r.CreatedAt
                })
               
                .ToListAsync();

            return Ok(reports);
        }


        [HttpGet("myreport/{id}")]
        public async Task<IActionResult> GetReport(int id, [FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }
            var report = await _dbContext.Reports
                .Where(r => r.ReporterId == userId)
                .Where(r => r.ReportId == id)
                .Select(r => new
                {
                    r.ReportId,
                    r.ReporterId,
                    r.ReportedPersonId,
                    r.ReportedCommentId,
                    r.ReportedBookId,
                    r.ReportTypeId,
                    r.ReportMessage,
                    r.IsHandled,
                    r.CreatedAt
                })
                .FirstOrDefaultAsync();

            return report == null ? NotFound("Report not found.") : Ok(report);
        }

        [HttpPost("createReport")]
        public async Task<IActionResult> CreateReport([FromBody] ReportDTO reportDto)
        {
            // Get the authenticated user's ID (reporter)
            var reporterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(reporterId))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Create a new report
            var newReport = new Reports
            {
                ReporterId = reporterId,
                ReportedPersonId = reportDto.ReportedPersonId,
                ReportedCommentId = reportDto.ReportedCommentId,
                ReportedBookId = reportDto.ReportedBookId,
                ReportTypeId = reportDto.ReportTypeId,
                ReportMessage = reportDto.ReportMessage,
                CreatedAt = DateTime.Now,
                IsHandled = false
            };

            // Add and save the report
            _dbContext.Reports.Add(newReport);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Report created successfully", ReportId = newReport.ReportId });
        }


        // ReaderRating endpoints

        [HttpGet("readerRatings")]
        public async Task<ActionResult<IEnumerable<ReaderRatingDTO>>> GetReaderRatingsByUser([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            var readerRatings = await _dbContext.ReaderRatings
                .Where(r => r.RaterId == userId)
                .Select(r => new ReaderRatingDTO
                {
                    RatingId = r.RatingId,
                    BookId = r.BookId,
                    RatingValue = r.RatingValue,
                    RaterId = r.RaterId,
                    BookName = r.Books.BookName,
                    GenreId = r.Books.GenreId,
                    CategoryId = r.Books.CategoryId
                })
                .ToListAsync();

            if (!readerRatings.Any())
            {
                return NotFound("No ratings found for the given user.");
            }

            return Ok(readerRatings);
        }

        [HttpGet("readerRatingsForBook/{bookId}")]
        public async Task<ActionResult<IEnumerable<ReaderRatingDTO>>> GetReaderRatingsForBook(int bookId)
        {
            var readerRatings = await _dbContext.ReaderRatings
                .Where(r => r.BookId == bookId)
                .Select(r => new ReaderRatingDTO
                {
                    RatingId = r.RatingId,
                    BookId = r.BookId,
                    RatingValue = r.RatingValue,
                    RaterId = r.RaterId,
                    BookName = r.Books.BookName
                })
                .ToListAsync();

            return Ok(readerRatings);
        }



        [HttpGet("readerRating/{id}")]
        public async Task<ActionResult<ReaderRatings>> GetReaderRating(int id)
        {
            var readerRating = await _dbContext.ReaderRatings.Include(j => j.Books).FirstOrDefaultAsync(j => j.RatingId == id);
            return readerRating == null ? NotFound() : readerRating;
        }

        [HttpPost("createReaderRating")]
        public async Task<IActionResult> CreateReaderRating(ReaderRatings readerRating)
        {
            // Ellenőrzés: létezik-e már értékelés a felhasználótól az adott könyvre
            var existingRating = await _dbContext.ReaderRatings
                .FirstOrDefaultAsync(r => r.BookId == readerRating.BookId && r.RaterId == readerRating.RaterId);

            if (existingRating != null)
            {
                return BadRequest("You have already rated this book. Please modify your existing rating.");
            }

            // Ha nem létezik, új értékelés mentése
            _dbContext.ReaderRatings.Add(readerRating);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReaderRating), new { id = readerRating.RatingId }, new
            {
                message = "Értékelés sikeresen mentve!",
                ratingId = readerRating.RatingId
            });

        }



        [HttpPut("modifyReaderRating/{id}")]
        public async Task<ActionResult> PutReaderRating(int id, ReaderRatings modifiedReaderRating)
        {
            // Ellenőrizd, hogy az ID egyezik-e
            if (id != modifiedReaderRating.RatingId)
            {
                return BadRequest("Invalid Rating ID.");
            }

            // Automatikusan frissítsük a módosítás dátumát
            modifiedReaderRating.ModifiedAt = DateTime.Now;

            _dbContext.Entry(modifiedReaderRating).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("The rating was not found.");
            }

            return NoContent();
        }


        [HttpDelete("deleteReaderRating/{bookId}")]
        public async Task<ActionResult> DeleteReaderRating(int bookId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var readerRating = await _dbContext.ReaderRatings
                .FirstOrDefaultAsync(r => r.BookId == bookId && r.RaterId == userId);
            if (readerRating == null)
            {
                return NotFound();
            }

            _dbContext.ReaderRatings.Remove(readerRating);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }


        // CriticRating endpoints

        [HttpGet("criticRatings")]
        [Authorize(Roles = "Critic")]
        public async Task<ActionResult<IEnumerable<CriticRatingDTO>>> GetCriticRatings([FromQuery] int bookId)
        {
            var criticRatings = await _dbContext.CriticRatings
                .Where(c => c.BookId == bookId) // Szűrés a könyv azonosítójára
                .Select(c => new CriticRatingDTO
                {
                    RatingId = c.RatingId,
                    BookId = c.BookId,
                    RatingValue = c.RatingValue,
                    RaterId = c.RaterId,
                    BookName = c.Books.BookName,
                    GenreId = c.Books.GenreId,
                    CategoryId = c.Books.CategoryId
                })
                .ToListAsync();

            if (!criticRatings.Any())
            {
                return NotFound("No ratings found for the given book.");
            }

            return Ok(criticRatings);
        }



        [HttpGet("criticRating/{id}")]
        [Authorize(Roles = "Critic")]
        public async Task<ActionResult<CriticRatings>> GetCriticRating(int id)
        {
            var criticRating = await _dbContext.CriticRatings.Include(j => j.Books).FirstOrDefaultAsync(j => j.RatingId == id);
            return criticRating == null ? NotFound() : criticRating;
        }

        [HttpGet("criticRatingsForBook/{bookId}")]
        public async Task<ActionResult<IEnumerable<CriticRatingDTO>>> GetCriticRatingsForBook(int bookId)
        {
            var criticRatings = await _dbContext.CriticRatings
                .Where(r => r.BookId == bookId)
                .Select(r => new CriticRatingDTO
                {
                    RatingId = r.RatingId,
                    BookId = r.BookId,
                    RatingValue = r.RatingValue,
                    RaterId = r.RaterId,
                    BookName = r.Books.BookName
                })
                .ToListAsync();

            return Ok(criticRatings);
        }

        [HttpPost("createCriticRating")]
        [Authorize(Roles = "Critic")]
        public async Task<ActionResult> CreateCriticRating(CriticRatingDTO criticRatingDTO)
        {
            if (criticRatingDTO == null || criticRatingDTO.BookId == 0)
            {
                return BadRequest("Book ID is required.");
            }

            var book = await _dbContext.Books.FindAsync(criticRatingDTO.BookId);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            var existingCriticRating = await _dbContext.CriticRatings
                .FirstOrDefaultAsync(cr => cr.BookId == criticRatingDTO.BookId && cr.RaterId == criticRatingDTO.RaterId);

            if (existingCriticRating != null)
            {
                return BadRequest("You have already rated this book as a critic.");
            }

            var criticRating = new CriticRatings
            {
                BookId = criticRatingDTO.BookId,
                RatingValue = criticRatingDTO.RatingValue,
                RaterId = criticRatingDTO.RaterId
            };

            _dbContext.CriticRatings.Add(criticRating);
            await _dbContext.SaveChangesAsync();

            return Ok("Rating saved successfully.");
        }

        [HttpPut("modifyCriticRating/{id}")]
        [Authorize(Roles = "Critic")]
        public async Task<ActionResult> PutCriticRating(int id, CriticRatings modifiedCriticRating)
        {
            if (id != modifiedCriticRating.RatingId)
            {
                return BadRequest();
            }

            modifiedCriticRating.ModifiedAt = DateTime.Now;
            _dbContext.Entry(modifiedCriticRating).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("deleteCriticRating/{bookId}")]
        [Authorize(Roles = "Critic")]
        public async Task<ActionResult> DeleteCriticRating(int bookId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("Felhasználói azonosító hiányzik.");
            }

            var criticRating = await _dbContext.CriticRatings
                .FirstOrDefaultAsync(r => r.BookId == bookId && r.RaterId == userId);

            if (criticRating == null)
            {
                return NotFound("Az értékelés nem található.");
            }

            _dbContext.CriticRatings.Remove(criticRating);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        // Comment endpoints
        [HttpGet("comments/{bookId}")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetComments(int bookId)
        {
            var comments = await _dbContext.Comments
                .Where(c => c.BookId == bookId)
                .OrderBy(c => c.CreatedAt)
                .Include(c => c.Users) // Ensure Users are included for accessing commenterId
                .Select(c => new CommentDTO
                {
                    CommentId = c.CommentId,
                    BookId = c.BookId,
                    CommentMessage = c.CommentMessage,
                    ParentCommentId = c.ParentCommentId,
                    ThreadId = c.ThreadId,
                    CommenterId = c.CommenterId // Add the CommenterId here
                })
                .ToListAsync();

            return Ok(comments);
        }


        [HttpGet("comment/{id}")]
        public async Task<ActionResult<CommentDTO>> GetComment(int id)
        {
            var comment = await _dbContext.Comments
                .Include(c => c.Users) // Ensure Users are included for accessing commenterId
                .FirstOrDefaultAsync(c => c.CommentId == id);

            if (comment == null)
            {
                return NotFound();
            }

            return new CommentDTO
            {
                CommentId = id,
                BookId = comment.BookId,
                CommentMessage = comment.CommentMessage,
                ParentCommentId = comment.ParentCommentId,
                ThreadId = comment.ThreadId,
                CommenterId = comment.CommenterId
            };
        }

        [HttpPost("createComment")]
        public async Task<IActionResult> CreateComment(CommentDTO commentDto)
        {
            // Check if the book exists
            var bookExists = await _dbContext.Books.AnyAsync(k => k.BookId == commentDto.BookId);
            if (!bookExists)
            {
                return BadRequest("The specified Book does not exist.");
            }

            // Retrieve the commenter ID from the current user's claims
            var commenterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(commenterId))
            {
                return Unauthorized("User is not authenticated.");
            }


            var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == commenterId);
            if (user == null)
            {
                return Unauthorized("User does not exist.");
            }
            if (user.IsMuted)
            {
                return Unauthorized("Ez a felhasználó el van tiltva kommenteléstől");
            }
            // Check if the comment is a reply or a new thread
            int threadId;
            if (commentDto.ParentCommentId == null)
            {
                // First comment in the thread
                threadId = 0; // We'll update this to the CommentId after saving
            }
            else
            {
                // Reply to an existing comment
                var parentComment = await _dbContext.Comments
                    .FirstOrDefaultAsync(c => c.CommentId == commentDto.ParentCommentId);

                if (parentComment == null)
                {
                    return BadRequest("The specified parent comment does not exist.");
                }

                threadId = parentComment.ThreadId;
            }

            // Create the comment
            var comment = new Comments
            {
                BookId = commentDto.BookId,
                CommentMessage = commentDto.CommentMessage,
                CommenterId = commenterId,  // Set the commenter ID
                ParentCommentId = commentDto.ParentCommentId,
                ThreadId = threadId
            };

            _dbContext.Comments.Add(comment);
            await _dbContext.SaveChangesAsync();

            // After the comment is saved, update the ThreadId if it's a top-level comment
            if (commentDto.ParentCommentId == null)
            {
                // Update the ThreadId to be its own CommentId
                comment.ThreadId = comment.CommentId;
                _dbContext.Comments.Update(comment);
                await _dbContext.SaveChangesAsync();
            }

            await GrantAchievementIfEligible(commenterId);

            return CreatedAtAction("GetComment", new { id = comment.CommentId }, comment);
        }

        [HttpPost("likeComment/{commentId}")]
        public async Task<IActionResult> LikeComment(int commentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            var comment = await _dbContext.Comments.FindAsync(commentId);
            if (comment == null)
            {
                return NotFound("Comment not found.");
            }

            var existingLike = await _dbContext.CommentLikes
                .FirstOrDefaultAsync(cl => cl.CommentId == commentId && cl.UserId == userId);

            if (existingLike != null)
            {
                if (existingLike.IsLike)
                {
                    return BadRequest("You have already liked this comment.");
                }

                existingLike.IsLike = true;
                comment.Likes++;
                comment.Dislikes--;
            }
            else
            {
                _dbContext.CommentLikes.Add(new CommentLike
                {
                    CommentId = commentId,
                    UserId = userId,
                    IsLike = true
                });
                comment.Likes++;
            }

            _dbContext.Comments.Update(comment);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Comment liked successfully.", likes = comment.Likes });
        }

        [HttpPost("dislikeComment/{commentId}")]
        public async Task<IActionResult> DislikeComment(int commentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            var comment = await _dbContext.Comments.FindAsync(commentId);
            if (comment == null)
            {
                return NotFound("Comment not found.");
            }

            var existingLike = await _dbContext.CommentLikes
                .FirstOrDefaultAsync(cl => cl.CommentId == commentId && cl.UserId == userId);

            if (existingLike != null)
            {
                if (!existingLike.IsLike)
                {
                    return BadRequest("You have already disliked this comment.");
                }

                existingLike.IsLike = false;
                comment.Likes--;
                comment.Dislikes++;
            }
            else
            {
                _dbContext.CommentLikes.Add(new CommentLike
                {
                    CommentId = commentId,
                    UserId = userId,
                    IsLike = false
                });
                comment.Dislikes++;
            }

            _dbContext.Comments.Update(comment);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Comment disliked successfully.", dislikes = comment.Dislikes });
        }


        [HttpPut("modifyComment/{id}")]
        public async Task<ActionResult> PutComment(int id, [FromBody] CommentDTO modifiedCommentDto)
        {
            // Check if the comment exists
            var existingComment = await _dbContext.Comments.FindAsync(id);
            if (existingComment == null)
            {
                return NotFound();
            }

            // Retrieve the commenter ID from the current user's claims
            var commenterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(commenterId))
            {
                return Unauthorized("User is not authenticated.");
            }

            // Set properties from the DTO and automatically set the modified fields
            existingComment.CommentMessage = modifiedCommentDto.CommentMessage;
            existingComment.ModifiedAt = DateTime.Now;
            existingComment.CommenterId = commenterId;  // Set the commenter ID

            // Update the entity and save changes
            _dbContext.Entry(existingComment).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }



        [HttpPut("deleteComment/{id}")]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var comment = await _dbContext.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            var commenterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(commenterId))
            {
                return Unauthorized("User is not authenticated.");
            }

            comment.CommentMessage = $"Deleted by User";

            _dbContext.Entry(comment).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return NoContent(); 
        }


        //Favourite endpoints

        [HttpGet("favourites")]
        public async Task<IActionResult> GetFavourites()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var favoriteBooks = await _dbContext.Favourites
                .Where(f => f.UserId == user.Id)
                .Select(f => f.Book)
                .ToListAsync();

            return Ok(favoriteBooks);
        }

        [HttpGet("myfavourites")]
        public async Task<IActionResult> GetMyFavourites()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            var requests = await _dbContext.Favourites
                .Where(r => r.UserId == userId)
                .Include(r => r.Book)
                .Select(r => new
                {
                    r.FavouriteId,
                    r.BookId,
                    BookName = r.Book != null ? r.Book.BookName : null,
                    r.ChapterNumber
                })
                .ToListAsync();

            return Ok(requests);
        }


        [HttpPost("addFavourite/{bookId}")]
        public async Task<IActionResult> AddFavourite(int bookId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var bookExists = await _dbContext.Books.AnyAsync(b => b.BookId == bookId);
            if (!bookExists)
            {
                return BadRequest("The specified book does not exist.");
            }

            var alreadyFavorite = await _dbContext.Favourites.AnyAsync(f => f.UserId == user.Id && f.BookId == bookId);
            if (alreadyFavorite)
            {
                return BadRequest("This book is already in your favorites.");
            }

            var favorite = new Favourites { UserId = user.Id, BookId = bookId };
            _dbContext.Favourites.Add(favorite);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book added to favorites." });
        }

        [HttpDelete("removeFavourite/{bookId}")]
        public async Task<IActionResult> RemoveFavourite(int bookId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var favorite = await _dbContext.Favourites.FirstOrDefaultAsync(f => f.UserId == user.Id && f.BookId == bookId);
            if (favorite == null)
            {
                return BadRequest("This book is not in your favorites.");
            }

            _dbContext.Favourites.Remove(favorite);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Book removed from favorites." });
        }

        [HttpPatch("updateLastReadChapter/{bookId}")]
        public async Task<IActionResult> UpdateLastReadChapter(int bookId, [FromBody] int chapterNumber)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var favorite = await _dbContext.Favourites
                .FirstOrDefaultAsync(f => f.BookId == bookId && f.UserId == user.Id);

            if (favorite == null)
            {
                return NotFound("Favorite not found.");
            }

            favorite.ChapterNumber = chapterNumber;
            await _dbContext.SaveChangesAsync();

            return Ok("Last read chapter updated successfully.");
        }


    }
}
