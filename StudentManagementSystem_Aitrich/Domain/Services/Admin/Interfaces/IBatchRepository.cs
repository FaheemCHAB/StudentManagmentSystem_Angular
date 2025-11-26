using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface IBatchRepository
    {
        Task AddBatch(Batch batch);
        Task<List<Batch>> GetAllBatches();
        Task<Batch> GetBatchById(Guid id);
        Task<Batch> UpdateBatch(Batch batch);
        Task<bool> DeleteBatch(Guid id);
        Task<List<Batch>> SearchByName(string name);
    }
}
