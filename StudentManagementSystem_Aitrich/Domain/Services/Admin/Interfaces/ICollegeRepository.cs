using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.Services.Admin.Interfaces
{
    public interface ICollegeRepository
    {
        public Task<College> AddCollege(College college);
        public Task<List<College>> GetAllColleges();
        public Task<College> GetCollegeByName(string name);
        public Task<College> GetCollegeById(Guid collegeId);
        public Task<College> UpdateCollege(College college);

        public Task<bool> DeleteCollegeById(Guid collegeId);
    }
}
