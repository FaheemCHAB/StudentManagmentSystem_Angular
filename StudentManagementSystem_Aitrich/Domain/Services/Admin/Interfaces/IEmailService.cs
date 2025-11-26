using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Services.Admin.DTOs;

namespace Domain.Services.Admin.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailDto email);
    }
}
