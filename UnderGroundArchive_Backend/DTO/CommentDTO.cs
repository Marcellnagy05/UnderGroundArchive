namespace UnderGroundArchive_Backend.DTO
{
    public class CommentDTO
    {
        public int CommentId { get; set; }
        public int BookId { get; set; }
        public string CommentMessage { get; set; }
        public int? ParentCommentId { get; set; }
        public int ThreadId { get; set; }
    }
}
