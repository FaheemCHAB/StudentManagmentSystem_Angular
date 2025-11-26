using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class BatchDTO
    {
        public Guid BatchId { get; set; }
        public string BatchName { get; set; } = null!;
        public string BatchTime { get; set; } = null!;
        public string BatchDescription { get; set; } = null!;
    }
}
