using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;

namespace Domain.Services.Admin
{
    public class CollegeService : ICollegeService
    {
        private readonly ICollegeRepository collegeRepository;
        IMapper mapper;

        public CollegeService(ICollegeRepository collegeRepository, IMapper mapper)
        {
            this.collegeRepository = collegeRepository;
            this.mapper = mapper;
        }

        public async Task<CollegeDto> AddCollege(CollegeDto collegeDto)
        {
            var college = mapper.Map<College>(collegeDto);
            await collegeRepository.AddCollege(college);
            return collegeDto;
        }

        public async Task<bool> DeleteCollegeById(Guid collegeId)
        {
            await collegeRepository.DeleteCollegeById(collegeId);
            return true;
        }

        public async Task<List<CollegeDto>> GetAllColleges()
        {
            var colleges = await collegeRepository.GetAllColleges();
            return mapper.Map<List<CollegeDto>>(colleges);
        }

        public async Task<CollegeDto> GetCollegeById(Guid collegeId)
        {
            var college = await collegeRepository.GetCollegeById(collegeId);
            return mapper.Map<CollegeDto>(college);
        }

        public async Task<List<CollegeDto>> GetCollegeByName(string name)
        {
            var college = await collegeRepository.GetCollegeByName(name);
            var collegeList = mapper.Map<List<CollegeDto>>(college);
            return collegeList;
        }

        public async Task<CollegeDto> UpdateCollege(Guid CollegeId, CollegeDto collegeDto)
        {
            var college = await collegeRepository.GetCollegeById(CollegeId);

            if (college == null)
            {
                throw new KeyNotFoundException("College not found");
            }
            college.CollegeName = string.IsNullOrWhiteSpace(collegeDto.CollegeName) ? college.CollegeName : collegeDto.CollegeName;
            

            college.Location = string.IsNullOrWhiteSpace(collegeDto.Location) ? college.Location : collegeDto.Location;
            college.District = string.IsNullOrWhiteSpace(collegeDto.District) ? college.District : collegeDto.District;
            college.State = string.IsNullOrWhiteSpace(collegeDto.State) ? college.State : collegeDto.State;

            college.Phone = string.IsNullOrWhiteSpace(collegeDto.Phone) ? college.Phone : collegeDto.Phone;


            college.Description = string.IsNullOrWhiteSpace(collegeDto.Description) ? college.Description : collegeDto.Description;

            var updatedCollege = await collegeRepository.UpdateCollege(college);
            return mapper.Map<CollegeDto>(updatedCollege);
        }
    }
}
