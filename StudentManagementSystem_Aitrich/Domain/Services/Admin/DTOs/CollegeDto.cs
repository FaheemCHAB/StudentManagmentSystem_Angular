using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class CollegeDto
    {
        public Guid CollegeId { get; set; }
        public string CollegeName { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string District { get; set; } = null!;
        public string State { get; set; } = null!;
        public string ?Phone { get; set; }
        public string Description { get; set; } = null!;
    }
}
