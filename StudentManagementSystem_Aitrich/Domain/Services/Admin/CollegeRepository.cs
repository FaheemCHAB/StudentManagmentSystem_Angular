using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Domain.Services.Admin
{
    public class CollegeRepository : ICollegeRepository
    {
        private readonly StudentManagementDbContext _dbcontext;

        public CollegeRepository(StudentManagementDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<College> AddCollege(College college)
        {
            if (college == null)
            {
                throw new ArgumentNullException(nameof(college));
            }
            if (_dbcontext.Colleges.Any(c => c.CollegeName == college.CollegeName && c.Location == college.Location))
            {
                throw new ItemAlreadyExistException("College already exist");
            }
            _dbcontext.Colleges.Add(college);
            await _dbcontext.SaveChangesAsync();

            return college;
        }


        public async Task<bool> DeleteCollegeById(Guid collegeId)
        {
            var college = await _dbcontext.Colleges.FindAsync(collegeId);

            if (college == null)
                throw new ItemNotFoundException("College not found");

            _dbcontext.Colleges.Remove(college);
            await _dbcontext.SaveChangesAsync();
            return true;
        }


        public async Task<List<College>> GetAllColleges()
        {
            return await _dbcontext.Colleges.ToListAsync();
        }

        public async Task<College> GetCollegeById(Guid collegeId)
        {
            var college = await _dbcontext.Colleges.FindAsync(collegeId);
            if(college == null)
            {
                return null;
            }
            return college;
        }

        public async Task<College> GetCollegeByName(string collegeName)
        {
            return await _dbcontext.Colleges
                .FirstOrDefaultAsync(c => c.CollegeName == collegeName);
        }

        public async Task<College> UpdateCollege(College college)
        {
            _dbcontext.Colleges.Update(college);
            await _dbcontext.SaveChangesAsync();
            return college;
        }
    }
}
