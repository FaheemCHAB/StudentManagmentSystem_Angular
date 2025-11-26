using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Domain.Services.Admin.DTOs;

namespace Domain.Services.Admin.Interfaces
{
    public interface ICollegeService
    {
        public Task<CollegeDto> AddCollege(CollegeDto college);
        public Task<List<CollegeDto>> GetAllColleges();
        public Task<CollegeDto> GetCollegeById(Guid collegeId);
        public Task<CollegeDto> UpdateCollege(Guid collegeId, CollegeDto college);


        public Task<bool> DeleteCollegeById(Guid collegeId);
        public Task<List<CollegeDto>> GetCollegeByName(string name);


    }
}
