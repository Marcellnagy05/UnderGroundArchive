using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnderGroundArchive_WPF.Models
{
    public class RequestModel
    {
        public int RequestId { get; set; }
        public string RequesterId { get; set; }
        public string RequestMessage { get; set; }
        public DateTime RequestDate { get; set; }
        public int RequestType { get; set; }
        public bool IsApproved { get; set; }
        public bool IsHandled { get; set; }
    }
}
