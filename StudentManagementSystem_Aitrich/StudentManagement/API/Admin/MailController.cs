using Domain.Models;
using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Controllers;

namespace StudentManagement.API.Admin
{
    
    [ApiController]
    [Authorize]
    public class MailController : BaseAPIController<MailController>
    {
        private readonly IMailService _mailService;
        public MailController(IMailService mailService)
        {
            _mailService = mailService;
        }

        [HttpPost("reminders")]
        public async Task<IActionResult> SendReminders([FromBody] List<string> emails)
        {
            if (emails == null || !emails.Any())
                return BadRequest("Email list is empty.");

            var request = new MailRequest
            {
                ToEmails = emails,
                Subject = "Pending Fee Reminder",
                Body = "<p>Dear Student,<br><br>This is a reminder to clear your pending fee.<br><br>Regards,<br>Admin</p>"
            };

            await _mailService.SendBulkEmailAsync(request);
            return Ok(new { message = "Reminders sent successfully." });
        }
    }
}
