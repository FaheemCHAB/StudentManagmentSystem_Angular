namespace StudentManagement.API.Admin.RequestObjects
{
    public class CollegeRequest
    {
        public string CollegeName { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string District { get; set; } = null!;
        public string State { get; set; } = null!;
        public string? Phone { get; set; }
        public string Description { get; set; } = null!;
    }
}
