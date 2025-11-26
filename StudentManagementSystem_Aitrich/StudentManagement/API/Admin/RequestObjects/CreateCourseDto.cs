using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class CreateCourseDto
    {
      
        public string CourseName { get; set; } = null!;
        public decimal CourseFee { get; set; }
        public string CourseDuration { get; set; } = null!;
        public string CourseDescription { get; set; } = null!;
        public int InstallmentCount { get; set; }
    }
}
