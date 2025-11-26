namespace StudentManagement.API.Admin.RequestObjects
{
    public class ExperienceRequest
    {
        public Guid StudentId { get; set; }
        public string Position { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string TotalExperience { get; set; } = null!;
    }
}
