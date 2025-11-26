using AutoMapper;
using Domain.Models;
using Domain.Services.Admin.DTOs;

using StudentManagement.API.Admin.RequestObjects;


namespace StudentManagement.Extensions
{
    public class AutoMapperProfile:Profile
    {
       public AutoMapperProfile() 
        {
            CreateMap<Course, CourseDTO>().ReverseMap();
            CreateMap<CreateCourseDto,CourseDTO>().ReverseMap();
            CreateMap<CreateCourseDto,Course>().ReverseMap();

            CreateMap<CollegeDto, College>().ReverseMap();
            CreateMap<CollegeRequest, College>().ReverseMap();
            CreateMap<CollegeRequest, CollegeDto>().ReverseMap();

            CreateMap<BatchDTO, Batch>().ReverseMap();
            CreateMap<CreateBatchDTO, Batch>().ReverseMap();
            CreateMap<CreateBatchDTO, BatchDTO>().ReverseMap();

            CreateMap<TrialStudentDto, TrialStudent>().ReverseMap();
            CreateMap<TrialStudentRequest, TrialStudentDto>().ReverseMap();
            CreateMap<TrialStudentRequest, TrialStudent>().ReverseMap();
            CreateMap<TrialStudent, TrialStudentDto>()
    .ForMember(dest => dest.CourseName, opt => opt.MapFrom(src => src.Courses.CourseName));

            CreateMap<TrialStudentDto, TrialStudent>();


            CreateMap<CourseDetailDTO,CourseDetails>().ReverseMap();
            CreateMap<CourseDetailDTO,CourseDetailRequest>().ReverseMap();
            CreateMap<CourseDetailRequest, CourseDetails>().ReverseMap();

            CreateMap<ExperienceDTO, Experience>().ReverseMap();
            CreateMap<ExperienceDTO, ExperienceRequest>().ReverseMap();
            CreateMap<ExperienceRequest, Experience>().ReverseMap();

            CreateMap<FeeStructureDTO,FeeStructure>().ReverseMap();
            CreateMap<FeeStructureRequest, FeeStructureDTO>().ReverseMap();
            CreateMap<FeeStructure, FeeStructureRequest>().ReverseMap();

            CreateMap<Qualification, QualificationDTO>()
     .ForMember(dest => dest.CollegeName,
                opt => opt.MapFrom(src => src.College != null ? src.College.CollegeName : "N/A"))
     .ReverseMap();

            CreateMap<QualificationDTO, QualificationRequest>().ReverseMap();
            CreateMap<QualificationRequest, Qualification>().ReverseMap();


            CreateMap<StudentProfileRequest, StudentProfileDTO>()
    .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<StudentProfileDTO, StudentProfile>().ReverseMap();


            //       CreateMap<StudentProfileDTO, StudentProfile>().ReverseMap();
            ////       CreateMap<StudentProfileRequest, StudentProfileDTO>()
            ////.ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));    ///MYY
            //       CreateMap<StudentProfileDTO, StudentProfileRequest>().ReverseMap();  //CHANGED
            //       CreateMap<StudentProfileRequest, StudentProfile>().ReverseMap();

            //CHANGED

            CreateMap<Fee, FeeDTO>()
      .ForMember(dest => dest.FeeStructureId,
          opt => opt.MapFrom(src => src.FeeStructure.InstallmentId)) 
      .ForMember(dest => dest.StudentName, opt =>
          opt.MapFrom(src =>
              src.FeeStructure.StudentProfile.TrialStudent != null
                  ? src.FeeStructure.StudentProfile.TrialStudent.FirstName + " " +
                    src.FeeStructure.StudentProfile.TrialStudent.LastName
                  : src.FeeStructure.StudentProfile.FirstName + " " +
                    src.FeeStructure.StudentProfile.LastName))
      .ForMember(dest => dest.CourseName,
          opt => opt.MapFrom(src => src.FeeStructure.CourseDetail.Course.CourseName))
      .ForMember(dest => dest.StudentId,
        opt => opt.MapFrom(src => src.FeeStructure.StudentId))
      .ReverseMap()
      .ForMember(dest => dest.FeeStructure, opt => opt.Ignore());



            //    CreateMap<Fee, FeeDTO>()
            //.ForMember(dest => dest.StudentName, opt => opt.MapFrom(src =>
            //    src.FeeStructure != null && src.FeeStructure.StudentProfile != null
            //        ? (
            //            src.FeeStructure.StudentProfile.TrialStudent != null
            //                ? src.FeeStructure.StudentProfile.TrialStudent.FirstName + " " + src.FeeStructure.StudentProfile.TrialStudent.LastName
            //                : src.FeeStructure.StudentProfile.FirstName + " " + src.FeeStructure.StudentProfile.LastName
            //          )
            //        : "Unknown"))
            //.ForMember(dest => dest.CourseName, opt => opt.MapFrom(src =>
            //    src.FeeStructure != null && src.FeeStructure.CourseDetail != null && src.FeeStructure.CourseDetail.Course != null
            //        ? src.FeeStructure.CourseDetail.Course.CourseName
            //        : "N/A"))
            //.ReverseMap();

            CreateMap<FeeRequest, FeeDTO>().ReverseMap();
            CreateMap<FeeRequest, Fee>().ReverseMap();



            CreateMap<FeeRequest,FeeDTO>().ReverseMap();
            CreateMap<FeeRequest, Fee>().ReverseMap();

            CreateMap<StudentProfile,TrialStudentDto>().ReverseMap();

            CreateMap<ReturnFee, ReturnFeeDTO>().ReverseMap();
            CreateMap<ReturnFeeRequest, ReturnFeeDTO>().ReverseMap();


            CreateMap<Transaction,TransactionDTO>().ReverseMap();
        

			CreateMap<QualificationMasterRequestDTO, QualificationMasterDTO>().ReverseMap();
			CreateMap<QualificationMasterDTO, QualificationMaster>().ReverseMap();
            //added
            CreateMap<SecondaryContact, SecondaryContactDto>().ReverseMap();

        }

    }
    }

