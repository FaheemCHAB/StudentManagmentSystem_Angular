using Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class FeeStructureDTO
    {
        public Guid InstallmentId { get; set; }
        public Guid StudentId { get; set; }
        public Guid CourseDetailId { get; set; }
        public int TotalInstallment { get; set; }
        public CoursesDTO? Course { get; set; }

        public virtual CourseDetails? CourseDetail { get; set; }
        public List<FeeDTO> FeeInstallments { get; set; } = new List<FeeDTO>();

        //public StudentProfileDTO StudentProfile { get; set; }  //CHANGED





    }
}
