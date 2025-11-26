using Domain.Services.Admin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface IBatchService
    {
        Task AddBatchAsync(BatchDTO batch);
        Task<List<BatchDTO>> GetAllBatchesAsync();
        Task<BatchDTO> GetBatchByIdAsync(Guid id);
        Task<BatchDTO> UpdateBatchAsync(Guid id, BatchDTO batch);
        Task<bool> DeleteBatchAsync(Guid id);
        Task<List<BatchDTO>> SearchByNameAsync(string name);
    }
}
