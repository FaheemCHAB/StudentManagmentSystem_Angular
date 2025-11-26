using Domain.Models;
using Domain.Services.Admin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface ICourseService
    {
        Task AddCourse(CourseDTO newCourse);
        Task<List<CourseDTO>> GetAllCourses();
        Task<CourseDTO> GetCourseById(Guid CourseId);
        Task<List<CourseDTO>> GetCourseByName(string name);
        Task<CourseDTO> UpdateCourseAsync(Guid id,CourseDTO dto);
        Task<bool> DeleteCourseAsync(Guid id);
    }
}
