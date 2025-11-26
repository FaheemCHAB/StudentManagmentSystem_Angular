using AutoMapper;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;
        private readonly IMapper _mapper;
        public CourseService(ICourseRepository courseRepository, IMapper mapper)
        {
            _courseRepository = courseRepository;
            _mapper = mapper;
        }

        public async Task AddCourse(CourseDTO newCourse)
        {
            Course course=_mapper.Map<Course>(newCourse);
            await _courseRepository.AddCourse(course);

        }

        public async Task<bool> DeleteCourseAsync(Guid id)
        {
            try {
                var deleted = await _courseRepository.DeleteAsync(id);
                if (!deleted)
                {
                    throw new KeyNotFoundException("Course Not found 0r Already existed");
                }
                return true;
            } catch (Exception ex) {
                throw new ApplicationException("Anerror occured while deleting the course");
            }
        }

        public async Task<List<CourseDTO>> GetAllCourses()
        {
            var courses=await _courseRepository.GetAllCourses();
            var courseList = _mapper.Map<List<CourseDTO>>(courses);
            return courseList;
        }

        public async Task<CourseDTO> GetCourseById(Guid CourseId)
        {
            var course=await _courseRepository.GetCourseById(CourseId);
            if (course == null)
            {
                throw new ItemNotFoundException("Course not found");
            }
            var getCourse=_mapper.Map<CourseDTO>(course);
            return getCourse;
        }

        public async Task<List<CourseDTO>> GetCourseByName(string name)
        {
            var course=await _courseRepository.GetCourseByName(name);
            var courseList=_mapper.Map<List<CourseDTO>>(course);
            return courseList;
        }

        public async Task<CourseDTO> UpdateCourseAsync(Guid id, CourseDTO dto)
        {
            var existing = await _courseRepository.GetCourseById(id);
            if (existing == null)
            {
                throw new KeyNotFoundException("Course not found");
            }
            existing.CourseName = string.IsNullOrWhiteSpace(dto.CourseName) ? existing.CourseName : dto.CourseName;
            existing.CourseFee = dto.CourseFee == 0 ? existing.CourseFee : dto.CourseFee;
            existing.CourseDuration = string.IsNullOrWhiteSpace(dto.CourseDuration) ? existing.CourseDuration : dto.CourseDuration;
            existing.InstallmentCount = dto.InstallmentCount == 0 ? existing.InstallmentCount : dto.InstallmentCount;
            existing.CourseDescription = string.IsNullOrWhiteSpace(dto.CourseDescription) ? existing.CourseDescription : dto.CourseDescription;

            var result = await _courseRepository.UpdateAsync(existing);
            return _mapper.Map<CourseDTO>(result);

        }   
    }
}
