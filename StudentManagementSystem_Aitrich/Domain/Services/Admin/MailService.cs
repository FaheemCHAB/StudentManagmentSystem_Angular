
using Domain.Models;
using Domain.Services.Admin.Interfaces;
using MimeKit;
using MailKit.Net.Smtp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Org.BouncyCastle.Math.EC.ECCurve;
using Microsoft.Extensions.Configuration;
namespace Domain.Services.Admin
{
    public class MailService : IMailService
    {
        private readonly IConfiguration _config;
        public MailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task SendBulkEmailAsync(MailRequest request)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["MailSettings:From"]));
            foreach (var to in request.ToEmails)
            {
                email.To.Add(MailboxAddress.Parse(to));
            }
            email.Subject = request.Subject;

            var builder = new BodyBuilder
            {
                HtmlBody = request.Body
            };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["MailSettings:SmtpServer"], int.Parse(_config["MailSettings:Port"]), true);
            await smtp.AuthenticateAsync(_config["MailSettings:From"], _config["MailSettings:Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
