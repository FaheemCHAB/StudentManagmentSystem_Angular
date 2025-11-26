using Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class QualificationDTO
    {
       
        public Guid QualificationId { get; set; }
        public Guid StudentId { get; set; }

        public Guid CollegeId { get; set; } 



        public string CollegeName { get; set; } = null!;

        public string QualificationName { get; set; } = null!;
     
        public string PassOutYear { get; set; } = null!;
       
    }
}
