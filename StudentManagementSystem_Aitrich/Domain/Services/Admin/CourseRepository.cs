using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin
{
    public class CourseRepository : ICourseRepository
    {
        private readonly StudentManagementDbContext _studentManagementDbContext;
        public CourseRepository(StudentManagementDbContext studentManagementDbContext)
        {
            _studentManagementDbContext = studentManagementDbContext;
        }
        public async Task AddCourse(Course newCourse)
        {
            if (_studentManagementDbContext.Courses.Any(c => c.CourseName == newCourse.CourseName))
            {
                throw new ItemAlreadyExistException("Course already available");
            }
            _studentManagementDbContext.Courses.Add(newCourse);
            await _studentManagementDbContext.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var course=await GetCourseById(id);
            if (course == null)
            {
                throw new ItemNotFoundException("Course not found");
            }
            _studentManagementDbContext.Courses.Remove(course);
            await _studentManagementDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Course>> GetAllCourses()
        {
            return await _studentManagementDbContext.Courses.ToListAsync();
            
        }

        public async Task<Course> GetCourseById(Guid CourseId)
        {
            var course=await _studentManagementDbContext.Courses.FindAsync(CourseId);
            if(course == null)
            {
                throw new ItemNotFoundException("Course not found");
            }
            return course;
        }

        public async Task<List<Course>> GetCourseByName(string name)
        {
            var course=await _studentManagementDbContext.Courses
                       .Where(c=>c.CourseName.Contains(name)).ToListAsync();
            return course;
        }

        public async Task<Course> UpdateAsync(Course course)
        {
            _studentManagementDbContext.Courses.Update(course);
            await _studentManagementDbContext.SaveChangesAsync();
            return course;
        }
    }
}
