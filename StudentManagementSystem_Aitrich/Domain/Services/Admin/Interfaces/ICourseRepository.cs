using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface ICourseRepository
    {
        Task AddCourse(Course newCourse);
        Task<List<Course>> GetAllCourses();
        Task<Course> GetCourseById(Guid CourseId);
        Task<List<Course>> GetCourseByName(string name);
        Task<Course> UpdateAsync(Course course);
        Task<bool> DeleteAsync(Guid id);

    }
}
