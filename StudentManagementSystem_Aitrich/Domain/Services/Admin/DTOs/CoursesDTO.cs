using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class CoursesDTO
    {
        public Guid CourseId { get; set; }
        public string? CourseName { get; set; }
        public double CourseFee { get; set; }
    }
}
