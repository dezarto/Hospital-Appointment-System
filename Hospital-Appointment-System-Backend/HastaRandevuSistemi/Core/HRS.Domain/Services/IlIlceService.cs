using System.Linq.Expressions;
using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class IlIlceService : IIlIlceService
    {
        private readonly IGenericRepository<IlIlce> _ilIlceRepository;
        private readonly IIlIlceRepository _ilIlceCustomRepository;

        public IlIlceService(IGenericRepository<IlIlce> ilIlceRepository, IIlIlceRepository ilIlceCustomRepository)
        {
            _ilIlceRepository = ilIlceRepository;
            _ilIlceCustomRepository = ilIlceCustomRepository;
        }

        public async Task<int> AddAsync(IlIlce ilIlce)
        {
            return await _ilIlceRepository.AddAsync(ilIlce);
        }

        public async Task<bool> AnyAsync(Expression<Func<IlIlce, bool>> predicate)
        {
            return await _ilIlceRepository.AnyAsync(predicate);
        }

        public async Task CustomAddAsync(IlIlce ilIlce)
        {
            await _ilIlceCustomRepository.AddAsync(ilIlce);
        }

        public async Task<bool> CustomDeleteByIlceIdAsync(int ilceId)
        {
            await _ilIlceCustomRepository.DeleteByIlceIdAsync(ilceId);

            return true;
        }

        public async Task<IEnumerable<IlIlce>> CustomGetAllAsync()
        {
            return await _ilIlceCustomRepository.GetAllAsync();
        }

        public async Task CustomUpdateAsync(IlIlce ilIlce)
        {
            await _ilIlceCustomRepository.UpdateAsync(ilIlce);
        }

        public async Task<IEnumerable<IlIlce>> GetAllAsync()
        {
            return await _ilIlceRepository.GetAllAsync();
        }
    }
}
