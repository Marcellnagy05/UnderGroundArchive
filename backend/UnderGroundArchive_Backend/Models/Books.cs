﻿using System.Text.Json.Serialization;

namespace UnderGroundArchive_Backend.Models
{
    public class Books
    {
        public int BookId { get; set; }
        public string? BookName { get; set; }
        public string AuthorId { get; set; }
        public int GenreId { get; set; }
        public int CategoryId { get; set; }
        public string? BookDescription { get; set; }
        public virtual Genre Genre { get; set; }
        public virtual Categories Categories { get; set; }
        public virtual ICollection<Comments> Comments { get; set; }
        public virtual ICollection<ReaderRatings> ReaderRatings { get; set; }
        public virtual ICollection<CriticRatings> CriticRatings { get;set; }

        [JsonIgnore]
        public virtual ICollection<Chapters> Chapters { get; set; }
        public virtual ICollection<Favourites> Favourites { get; set; }
    }
}
