namespace UnderGroundArchive_Backend.Models
{
    public class Requests
    {
        public int RequestId { get; set; }
        public string RequesterId { get; set; }
        public DateTime RequestDate { get; set; }
        public bool IsApproved { get; set; }
        public int RequestType { get; set; }
        public ApplicationUser Users { get; set; }
    }
}
