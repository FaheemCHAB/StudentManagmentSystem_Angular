using Domain.Models;

namespace StudentManagement.API.Admin.RequestObjects
{
    public class TrialStudentRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime RegistrationTime { get; set; }
        public Guid CourseId { get; set; }
    }
}
