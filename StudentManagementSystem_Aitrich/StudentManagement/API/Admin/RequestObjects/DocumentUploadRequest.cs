using System.ComponentModel.DataAnnotations;

namespace StudentManagement.API.Admin.RequestObjects
{
    public class DocumentUploadRequest
    {
        
        public string? Title { get; set; }
        public IFormFile? File { get; set; }
    }
}
