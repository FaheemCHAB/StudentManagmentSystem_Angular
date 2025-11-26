namespace StudentManagement.API.Admin.RequestObjects
{
    public class RegistrationFeeRequest
    {
        public Guid TrialStudentId { get; set; }
        public double Fee { get; set; }
    }
}
