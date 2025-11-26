using Domain.Enums;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class CourseDetailDTO
    {
        public Guid CourseDetailId { get; set; }
        public Guid StudentProfileId { get; set; }
        public Guid CourseId { get; set; }        
        public Guid BatchId { get; set; }
        public string TimeSlot { get; set; } = null!;
        public Status Status { get; set; }
        public Mode Mode { get; set; }
        
    }
}
