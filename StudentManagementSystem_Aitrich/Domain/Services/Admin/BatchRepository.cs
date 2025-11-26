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
    public class BatchRepository : IBatchRepository
    {
        private readonly StudentManagementDbContext _studentManagementDbContext;
        private readonly ICourseRepository _courseRepository;
        public BatchRepository(StudentManagementDbContext studentManagementDbContext, ICourseRepository courseRepository)
        {
            _studentManagementDbContext = studentManagementDbContext;
            _courseRepository = courseRepository;
        }
        public async Task AddBatch(Batch batch)
        {

            if (_studentManagementDbContext.Batches.Any(b => b.BatchName == batch.BatchName))
            {
                throw new ItemAlreadyExistException("Batch already available");
            }
            _studentManagementDbContext.Batches.Add(batch);
            await _studentManagementDbContext.SaveChangesAsync();
        }

        public async Task<bool> DeleteBatch(Guid id)
        {
            var delete = await GetBatchById(id);
            if (delete == null)
            {
                throw new NotImplementedException("Batch not found");
            }
            _studentManagementDbContext.Remove(delete);
            await _studentManagementDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Batch>> GetAllBatches()
        {
            var batchList = await _studentManagementDbContext.Batches.ToListAsync();
            return batchList;

        }

        public async Task<Batch> GetBatchById(Guid id)
        {
            var batch = await _studentManagementDbContext.Batches.FindAsync(id);
            if (batch == null)
            {
                throw new ItemNotFoundException("Batch not found");
            }
            return batch;
        }

        public async Task<List<Batch>> SearchByName(string name)
        {
            name = name.ToLower();
            var batch = await _studentManagementDbContext.Batches
                      .Where(b => b.BatchName.ToLower().Contains(name) || b.BatchDescription.ToLower().Contains(name)).ToListAsync();
            return batch;
        }

        public async Task<Batch> UpdateBatch(Batch batch)
        {
            _studentManagementDbContext.Batches.Update(batch);
            await _studentManagementDbContext.SaveChangesAsync();
            return batch;
        }
    }
}
