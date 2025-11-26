using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class ExperienceDTO
    {
        public Guid ExperienceId { get; set; }
        public Guid StudentId { get; set; }
        public string Position { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string TotalExperience { get; set; } = null!;
    }
}
