using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace UnderGroundArchive_Backend.Models
{
    public class Categories
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public bool IsAgeRestricted { get; set; }
        public ICollection <Books> Books { get; set; }
    }
}
