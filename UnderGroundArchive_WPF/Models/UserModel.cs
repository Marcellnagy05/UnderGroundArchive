using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnderGroundArchive_WPF.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime BirthDate { get; set; }
        public string Country { get; set; }
        public int RankPoints { get; set; }
        public decimal Balance { get; set; }
        public bool IsMuted { get; set; }
        public bool IsBanned { get; set; }
        public string RoleName { get; set; }
        public string RankName { get; set; }
        public string SubscriptionName { get; set; }
    }
}
