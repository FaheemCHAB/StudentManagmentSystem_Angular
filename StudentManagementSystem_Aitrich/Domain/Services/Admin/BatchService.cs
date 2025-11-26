using AutoMapper;
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
    public class BatchService : IBatchService
    {
        private readonly IBatchRepository _batchRepository;
        private readonly IMapper _mapper;
        public BatchService(IBatchRepository batchRepository, IMapper mapper)
        {
            _batchRepository = batchRepository;
            _mapper = mapper;
        }
        public async Task AddBatchAsync(BatchDTO batch)
        {
            Batch newBatch = _mapper.Map<Batch>(batch);
            await _batchRepository.AddBatch(newBatch);
        }

        public async Task<bool> DeleteBatchAsync(Guid id)
        {
            try
            {
                var result = await _batchRepository.DeleteBatch(id);
                if (!result)
                {
                    throw new KeyNotFoundException("Batch not found or already deleted");
                }
                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occured while deleting the batch", ex);
            }
            
        }

        public async Task<List<BatchDTO>> GetAllBatchesAsync()
        {
            var batchList = await _batchRepository.GetAllBatches();
            var batches = _mapper.Map<List<BatchDTO>>(batchList);
            return batches;

        }

        public async Task<BatchDTO> GetBatchByIdAsync(Guid id)
        {
            var batch = await _batchRepository.GetBatchById(id);
            var getBatch = _mapper.Map<BatchDTO>(batch);
            return getBatch;
        }

        public async Task<List<BatchDTO>> SearchByNameAsync(string name)
        {
            var batches = await _batchRepository.SearchByName(name);
            var batchList = _mapper.Map<List<BatchDTO>>(batches);
            return batchList;
        }

        public async Task<BatchDTO> UpdateBatchAsync(Guid id, BatchDTO batch)
        {
            try
            {
                var existingbatch = await _batchRepository.GetBatchById(id);
                if (existingbatch == null)
                {
                    throw new InvalidOperationException("Batch not found");
                }
                existingbatch.BatchName = string.IsNullOrWhiteSpace(batch.BatchName) ? existingbatch.BatchName : batch.BatchName;
                
                existingbatch.BatchTime = string.IsNullOrWhiteSpace(batch.BatchTime) ? existingbatch.BatchTime : batch.BatchTime;

                existingbatch.BatchDescription = string.IsNullOrWhiteSpace(batch.BatchDescription) ? existingbatch.BatchDescription : batch.BatchDescription;

                var result = await _batchRepository.UpdateBatch(existingbatch);
                return _mapper.Map<BatchDTO>(result);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occured while updating the batch",ex);
            }
        }
    }
}
