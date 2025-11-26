using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class DocumentDto
    {
        public string? Title { get; set; }

        public byte[]? File { get; set; }
    }
}
