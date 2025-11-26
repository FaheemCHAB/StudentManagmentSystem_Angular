using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class CourseDTO
    {
        public Guid CourseId { get; set; }
        public string CourseName { get; set; } = null!;
        public double CourseFee { get; set; }
        public string CourseDuration { get; set; } = null!;
        public int InstallmentCount { get; set; }
        public string CourseDescription { get; set; } = null!;
    }
}
