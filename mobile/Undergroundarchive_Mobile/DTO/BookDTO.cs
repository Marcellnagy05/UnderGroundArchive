using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Undergroundarchive_Mobile.DTO
{
    public class CommentDTO
    {
        public string CommentMessage { get; set; }
    }

    public class ReaderRatingDTO
    {
        public int RatingValue { get; set; }
    }

    public class CriticRatingDTO
    {
        public int RatingValue { get; set; }
    }

    public class BookDTO
    {
        public int Id { get; set; }
        public string BookName { get; set; }
        public int GenreId { get; set; }
        public int CategoryId { get; set; }
        public string BookDescription { get; set; }
        public List<CommentDTO> Comments { get; set; }
        public List<ReaderRatingDTO> ReaderRatings { get; set; }
        public List<CriticRatingDTO> CriticRatings { get; set; }
        public double AverageRating { get; set; }
        public string AuthorId { get; set; }
    }
}
