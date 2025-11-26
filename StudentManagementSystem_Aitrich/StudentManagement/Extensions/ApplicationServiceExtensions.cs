using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Domain.Models;
using Domain.Services.Admin.Interfaces;
using Domain.Services.Admin;
namespace StudentManagement.Extensions
{
    public static class ApplicationServiceExtensions
    {
       public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config)
        {
            services.AddDbContext<StudentManagementDbContext>(options => options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<ICollegeService, CollegeService>();
            services.AddScoped<ICollegeRepository, CollegeRepository>();
            services.AddScoped<IBatchRepository, BatchRepository>();
            services.AddScoped<IBatchService, BatchService>();
            services.AddScoped<ITrialStudentRepository, TrialStudentRepository>();
            services.AddScoped<ITrialStudentService, TrialStudentService>();
            services.AddScoped<IStudentProfileRepository, StudentProfileRepository>();
            services.AddScoped<IStudentProfileService,StudentProfileService>();
            services.AddScoped<IMailService, MailService>();
            services.AddScoped<IReturnFeeRepository, ReturnFeeRepository>();
            services.AddScoped<IReturnFeeService, ReturnFeeService>();

            services.AddScoped<ITransactionRepository, TransactionRepository>();
            services.AddScoped<ITransactionService, TransactionService>();
			      services.AddScoped<IQualificationService, QualificationService>();
			      services.AddScoped<IQualificationRepository, QualificationRepository>();
            services.AddScoped<IEmailService, EmailService>();  //added email service

            return services;

        }
    }
}
