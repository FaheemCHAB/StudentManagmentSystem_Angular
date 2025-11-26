using Domain.Enums;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface IStudentProfileRepository
    {
        Task<StudentProfile> AddStudentProfile(StudentProfile newStudent);
      
        Task<List<StudentProfile>> GetAllStudentProfiles();
        Task<StudentProfile> GetStudentProfileById(Guid id);
        Task<bool> DeleteStudentProfile(Guid id);
        Task<StudentProfile> UpdateStudentProfile(StudentProfile student);
        Task<List<StudentProfile>> SearchByName(string name);
        Task<StudentProfile> UploadDocument(Guid StudentId, byte[] file);
        Task<byte[]> GetDocumentByStudentId(Guid StudentId);

        Task AddQualification(Qualification newQualification);
        Task<List<Qualification>> GetAllQualifications();
        Task<Qualification> GetQualificationById(Guid id);
        Task<bool> DeleteQualification(Guid id);
        Task<Qualification> UpdateQualification(Qualification qualification);
        Task<List<Qualification>> SearchQualification(string name);
        Task<List<Qualification>> GetQualificationsByStudentId(string studentId);


        Task AddExperience(Experience newExperience);
        Task<List<Experience>> GetAllExperience();
        Task<Experience> GetExperienceById(Guid id);
        Task<bool> DeleteExperience(Guid id);
        Task<Experience> UpdateExperience(Experience experience);
        Task<List<Experience>> SearchExperience(string name);
        Task<List<Experience>> GetExperiencesByStudentId(string studentId);

        Task<CourseDetails> AddCourseDetails(CourseDetails newCourseDetails);
        Task<List<CourseDetails>> GetAllCourseDetails();
        Task<CourseDetails> GetCourseDetailsById(Guid id);
        Task<bool> DeleteCourseDetails(Guid id);
        Task<List<CourseDetails>> SearchCourseDetails(string name);
        Task<CourseDetails> UpdateCourseDetails(Guid id,CourseDetails courseDetails);
        Task<List<CourseDetails>> GetCourseDetailsByStudentId(string studentProfileId);

        Task<FeeStructure> AddFeeStructure(FeeStructure newFeeStructure);
        Task<List <FeeStructure>> GetAllFeeStructure();
        Task<FeeStructure> GetFeeStructureById(Guid id);
        Task<bool> DeleteFeeStructure(Guid id);
        Task<List<FeeStructure>> SearchFeeStructure(string name);
        Task<FeeStructure> UpdateFeeStructure(FeeStructure feeStructure);
        Task<List<FeeStructure>> GetFeeStructuresByStudentId(string studentId);
        Task AddFee(List<Fee> fees);
        //Task AddMoreCourseFee(List<Fee> fees);
        Task<List<Fee>> GetAllFee(Guid feeStructureId);
        Task<List<Fee>> GetAllFees();
        Task<Fee> GetFeeById(Guid feeId);
        Task<bool> DeleteFee(Guid feeId);
        Task<List<TodayPendingFeeDTO>> SearchFee(DateOnly dueDate);
        Task<List<Fee>> SearchFeeByRange(DateOnly startDate, DateOnly endDate, InstallmentStatus? status);
        Task<Fee> UpdateFee(Fee fee);
        Task<List<Fee>> UpdateFeeByFeeStructureId(Guid feeStructureId,List<Fee> feeRequests);
        Task<List<Fee>> UpdateFeeByFeeStructureIdAllocation(Guid feeStructureId, List<Fee> feeRequests);
       
        Task<List<Fee>> GetFeesByFeeStructureId(string feeStructureId);
        Task DeleteRelatedQualifications(Guid studentId);
        Task DeleteRelatedExperiences(Guid studentId);
        Task DeleteRelatedCourseDetails(Guid studentId);
        Task DeleteRelatedFeeStructures(Guid studentId);
        Task DeleteRelatedFees(Guid installmentId);

        Task<List<Fee>> GetFeesByStudentId(string studentId);  //ADDED
        Task<SecondaryContact> AddSecondaryContactAsync(SecondaryContact contact); //ADDED
        Task<SecondaryContact?> GetSecondaryContactByStudentIdAsync(Guid studentId); //ADDED
        Task<SecondaryContact?> UpdateSecondaryContactAsync(SecondaryContact contact); //ADDED
    }
}
