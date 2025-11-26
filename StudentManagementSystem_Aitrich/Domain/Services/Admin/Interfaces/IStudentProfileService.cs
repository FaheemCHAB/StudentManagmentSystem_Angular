using Domain.Enums;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface IStudentProfileService
    {
        Task<StudentProfileDTO> AddStudentProfile(StudentProfileDTO newStudent);
        Task<List<StudentProfileDTO>> GetAllStudentProfiles();
        Task<StudentProfileDTO> GetStudentProfileById(Guid id);
        Task<bool> DeleteStudentProfile(Guid id);
        Task<StudentProfileDTO> UpdateStudentProfile(Guid id, StudentProfileDTO student);
        Task<List<StudentProfileDTO>> SearchByName(string name);
        Task<StudentProfile> UploadDocument(Guid StudentId, byte[] file);
        Task<byte[]> GetDocumentByStudentId(Guid StudentId);


        Task<QualificationDTO> AddQualification(QualificationDTO newQualification);
        Task<List<QualificationDTO>> GetAllQualifications();
        Task<QualificationDTO> GetQualificationById(Guid id);
        Task<bool> DeleteQualification(Guid id);
        Task<QualificationDTO> UpdateQualification(Guid id, QualificationDTO qualification);
        Task<List<QualificationDTO>> SearchQualification(string name);


        Task AddExperience(ExperienceDTO newExperience);
        Task<List<ExperienceDTO>> GetAllExperience();
        Task<ExperienceDTO> GetExperienceById(Guid id);
        Task<bool> DeleteExperience(Guid id);
        Task<ExperienceDTO> UpdateExperience(Guid id, ExperienceDTO experience);
        Task<List<ExperienceDTO>> SearchExperience(string name);


        Task<CourseDetailDTO> AddCourseDetails(CourseDetailDTO newCourseDetails);
        Task<List<CourseDetailDTO>> GetAllCourseDetails();
        Task<CourseDetailDTO> GetCourseDetailsById(Guid id);
        Task<bool> DeleteCourseDetails(Guid id);
        Task<List<CourseDetailDTO>> SearchCourseDetails(string name);
        Task<CourseDetailDTO> UpdateCourseDetails(Guid id, CourseDetailDTO courseDetails);

        Task<FeeStructureDTO> AddFeeStructure(FeeStructureDTO newFeeStructure);
        Task<List<FeeStructureDTO>> GetAllFeeStructure();
        Task<FeeStructureDTO> GetFeeStructureById(Guid id);
        Task<bool> DeleteFeeStructure(Guid id);
        Task<List<FeeStructureDTO>> SearchFeeStructure(string name);
        Task<FeeStructureDTO> UpdateFeeStructure(Guid id, FeeStructureDTO feeStructure);

        Task AddFee(List<FeeDTO> newFee);
        //Task AddMoreCourseFee(List<FeeDTO> newFee);
        Task<List<FeeDTO>> GetAllFee(Guid feeStructureId);
        Task<List<FeeDTO>> GetAllFees();
        Task<FeeDTO> GetFeeById(Guid feeId);
        Task<bool> DeleteFee(Guid feeId);
        Task<List<FeesDTO>> GetFeesByStudentId(Guid studentId);



        Task<List<TodayPendingFeeDTO>> SearchFee(DateOnly dueDate);
        Task<List<FeeDTO>> SearchFeeByRange(DateOnly startDate,DateOnly endDate, InstallmentStatus? status);
        Task<FeeDTO> UpdateFee(Guid feeId,FeeDTO fee);

        Task<List<FeeDTO>> UpdateFeeByFeeStructureId(Guid feeStructureId,List<FeeDTO> feeRequests);
        Task<List<FeeDTO>> UpdateFeeByFeeStructureIdAllocation(Guid feeStructureId, List<FeeDTO> feeRequests);

        Task<List<QualificationDTO>> GetQualificationsByStudentId(string studentId);
        Task<List<ExperienceDTO>> GetExperiencesByStudentId(string studentId);
        Task<List<FeeStructureDTO>> GetFeeStructuresByStudentId(string studentId);
        Task<List<CourseDetailDTO>> GetCourseDetailsByStudentId(string studentProfileId);
        Task<List<FeeDTO>> GetFeesByFeeStructureId(string feeStructureId);
        //added
        Task<SecondaryContactDto> AddSecondaryContactAsync(SecondaryContactDto dto);
        Task<SecondaryContactDto?> GetSecondaryContactByStudentIdAsync(Guid studentId);
        Task<SecondaryContactDto?> UpdateSecondaryContactAsync(SecondaryContactDto dto);
    }
}
