using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class StudentManagementDbContext : DbContext
    {
        public StudentManagementDbContext() { }
        public StudentManagementDbContext(DbContextOptions<StudentManagementDbContext> options) : base(options) 
        {
            //this.ChangeTracker.LazyLoadingEnabled = true;
        }
        public virtual DbSet<SecondaryContact> SecondaryContacts { get; set; }

        public virtual DbSet<College> Colleges { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<Batch> Batches { get; set; }
        public virtual DbSet<TrialStudent> TrialStudents { get; set; }
        public virtual DbSet<Qualification> Qualifications { get; set; }
        public virtual DbSet<Experience> Experiences { get; set; }
        public virtual DbSet<CourseDetails> CourseDetails { get; set; }
        public virtual DbSet<FeeStructure> FeeStructures { get; set; }
        public virtual DbSet<StudentProfile> StudentProfiles { get; set; }
        public virtual DbSet<Fee> Fees { get; set; }
        public virtual DbSet<ReturnFee> ReturnFees { get; set; }

        public virtual DbSet<Transaction> Transactions { get; set; }
       
		    public virtual DbSet<QualificationMaster> QualificationMaster { get; set; }

        public virtual DbSet<RegistrationFee> RegistrationFees { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            optionsBuilder.UseSqlServer("Server=db30431.databaseasp.net; Database=db30431; User Id=db30431; Password=q@9Y=6Cr3b%F; Encrypt=False; MultipleActiveResultSets=True;").UseLazyLoadingProxies();

        }


        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FeeStructure>()
             .HasOne(f => f.StudentProfile)
             .WithMany(fs => fs.FeeStructure)
             .HasForeignKey(f => f.StudentId)
             .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FeeStructure>()
                        .HasOne(f => f.CourseDetail)
                        .WithMany()
                        .HasForeignKey(f => f.CourseDetailId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseDetails>()
            .HasOne(cd => cd.Course)
            .WithMany(c => c.CourseDetails)
            .HasForeignKey(cd => cd.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<StudentProfile>()
            //            .HasOne<TrialStudent>()
            //            .WithMany()
            //            .HasForeignKey(sp => sp.TrialStudentId)
            //            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FeeStructure>()
    .HasMany(f => f.FeeInstallment)
    .WithOne()
    .HasForeignKey(f => f.FeeStructureId)
    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FeeStructure>()
    .HasMany(f => f.FeeInstallment)
    .WithOne(fee => fee.FeeStructure)
    .HasForeignKey(fee => fee.FeeStructureId)
    .OnDelete(DeleteBehavior.Cascade);





            modelBuilder.Entity<TrialStudent>()
           .HasOne(t => t.RegistrationFee)
           .WithOne(r => r.TrialStudent)
           .HasForeignKey<RegistrationFee>(r => r.TrialStudentId)
           .OnDelete(DeleteBehavior.Cascade);








        }






    }
    }

