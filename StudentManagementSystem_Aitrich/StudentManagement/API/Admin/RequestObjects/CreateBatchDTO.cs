namespace StudentManagement.API.Admin.RequestObjects
{
    public class CreateBatchDTO
    {
        public string BatchName { get; set; } = null!;
      
        public string BatchTime { get; set; } = null!;
        public string BatchDescription { get; set; } = null!;
    }
}
