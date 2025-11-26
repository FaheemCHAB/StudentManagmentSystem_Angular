using Domain.Models;

namespace StudentManagement.API.Admin.RequestObjects
{
    public class FeeStructureRequest
    {
        public Guid StudentId { get; set; }
        public Guid CourseDetailId { get; set; }
        public int TotalInstallment { get; set; }
        //public List<Fee> FeeInstallment { get; set; } = new List<Fee>();
    }
}
