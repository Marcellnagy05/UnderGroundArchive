namespace UnderGroundArchive_Backend.Models
{
    public class ReportTypes
    {
        public int ReportTypeId { get; set; }
        public string ReportTypeName { get; set; }
        public virtual ICollection<Reports> Reports { get; set; } = new List<Reports>();
    }
}
