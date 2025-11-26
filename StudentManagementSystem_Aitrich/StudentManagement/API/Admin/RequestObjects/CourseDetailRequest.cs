using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class CourseDetailRequest
    {
        public Guid StudentProfileId { get; set; }
        public Guid CourseId { get; set; }
        public Guid BatchId { get; set; }
        public string TimeSlot { get; set; } = null!;
        public Status Status { get; set; }
        public Mode Mode { get; set; }
    }
}
