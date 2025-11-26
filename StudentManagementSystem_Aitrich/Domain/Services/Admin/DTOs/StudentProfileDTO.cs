using Domain.Enums;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class StudentProfileDTO
    {
        public Guid StudentId { get; set; }
        public string? StudentReferenceId { get; set; }
        public Guid? TrialStudentId { get; set; } 

        public EnrollmentType EnrollmentType { get; set; } 

        public Reference ReferredBy { get; set; }
        public DateOnly DOB { get; set; }
        public TrialStudentDto? TrialStudent { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public byte[]? Photo { get; set; }
        public string? PhotoUrl { get; set; }//added
        public StudentStatus studentStatus { get; set; }
        public DateTime RegistrationTime { get; set; }

        //public List<Qualification> Qualification { get; set; } = new List<Qualification>();
        //public List<Experience> Experience { get; set; } = new List<Experience>();
        //public List<CourseDetails> Course { get; set; } = new List<CourseDetails>();
        //public byte[]? Documents { get; set; }

       
    }
}
