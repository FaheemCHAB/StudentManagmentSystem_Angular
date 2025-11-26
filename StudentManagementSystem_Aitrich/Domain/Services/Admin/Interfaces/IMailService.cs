using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface IMailService
    {
        Task SendBulkEmailAsync(MailRequest request);
    }
}
