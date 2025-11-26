namespace StudentManagement.API.Admin.RequestObjects
{
    public class QualificationRequest
    {
        public Guid StudentId { get; set; }
        public Guid CollegeId { get; set; }
        public string QualificationName { get; set; } = null!;
     
        public string PassOutYear { get; set; } = null!;
    }
}
