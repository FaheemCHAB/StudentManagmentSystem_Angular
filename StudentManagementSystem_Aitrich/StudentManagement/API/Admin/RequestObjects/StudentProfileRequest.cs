using Domain.Enums;
using Domain.Models;

namespace StudentManagement.API.Admin.RequestObjects
{
    public class StudentProfileRequest
    {
        public string? StudentReferenceId { get; set; }
        public Guid? TrialStudentId { get; set; }
        public Reference ReferredBy { get; set; }
        public DateOnly DOB { get; set; }
        public EnrollmentType EnrollmentType { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        public IFormFile? PhotoFile { get; set; }
        public string? PhotoUrl { get; set; }//added
        public StudentStatus studentStatus { get; set; }
        public DateTime RegistrationTime { get; set; }
        


        //public List<Qualification> Qualification { get; set; } = new List<Qualification>();
        //public List<Experience> Experience { get; set; } = new List<Experience>();
        //public List<CourseDetails> Course { get; set; } = new List<CourseDetails>();
        //public byte[]? Documents { get; set; }
    }
}
