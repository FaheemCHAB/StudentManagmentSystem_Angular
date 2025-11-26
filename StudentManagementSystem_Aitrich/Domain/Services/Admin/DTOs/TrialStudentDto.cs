using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class TrialStudentDto
    {
        public Guid TrialStudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime RegistrationTime { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }

    }
}
