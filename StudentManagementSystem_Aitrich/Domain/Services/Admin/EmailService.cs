using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(EmailDto email)
    {
        var settings = _config.GetSection("EmailSettings");

        var msg = new MimeMessage();
        msg.From.Add(MailboxAddress.Parse(settings["From"]));
        msg.To.Add(MailboxAddress.Parse(email.To));
        msg.Subject = email.Subject;
        msg.Body = new BodyBuilder { HtmlBody = email.Body }.ToMessageBody();

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            settings["Host"],
            int.Parse(settings["Port"]),
            MailKit.Security.SecureSocketOptions.StartTls
        );

        await smtp.AuthenticateAsync(
            settings["Username"],
            settings["Password"]
        );

        await smtp.SendAsync(msg);
        await smtp.DisconnectAsync(true);
    }
}
