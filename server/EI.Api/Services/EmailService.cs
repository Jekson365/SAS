using System.Net;
using System.Net.Mail;
using EI.Api.Interfaces;

namespace EI.Api.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string body)
    {
        var host      = _config["Email:SmtpHost"];
        var portStr   = _config["Email:SmtpPort"] ?? "587";
        var username  = _config["Email:SmtpUsername"];
        var password  = _config["Email:SmtpPassword"];
        var fromEmail = _config["Email:FromEmail"];
        var fromName  = _config["Email:FromName"] ?? fromEmail;

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(fromEmail))
        {
            _logger.LogWarning("SMTP not configured. Email to {To} with subject '{Subject}' was NOT sent. Body: {Body}", to, subject, body);
            return;
        }

        var port = int.Parse(portStr);

        using var client = new SmtpClient(host, port)
        {
            EnableSsl   = true,
            Credentials = new NetworkCredential(username, password)
        };

        using var message = new MailMessage
        {
            From       = new MailAddress(fromEmail, fromName),
            Subject    = subject,
            Body       = body,
            IsBodyHtml = false
        };
        message.To.Add(to);

        await client.SendMailAsync(message);
    }
}
