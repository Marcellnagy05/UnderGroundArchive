﻿namespace UnderGroundArchive_Backend.Models
{
    public class Comments
    {
        public int CommentId {  get; set; }
        public int BookId { get; set; }
        public string CommentMessage { get; set; }
        public string CommenterId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? ModifiedAt { get; set; }
        public int? ParentCommentId { get; set; }
        public int ThreadId { get; set; }
        public virtual Books Books { get; set; }
        public virtual ApplicationUser Users { get; set; }
    }
}
