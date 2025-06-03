using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class MesaiService : IMesaiService
    {
        private readonly IMesaiRepository _service;

        public MesaiService(IMesaiRepository service)
        {
            _service = service;
        }

        public async Task<Mesai> AddMesaiAsync(Mesai mesai)
        {
            return await _service.AddMesaiAsync(mesai);
        }

        public async Task<bool> DeleteMesaiAsync(int id)
        {
            return await _service.DeleteMesaiAsync(id);
        }

        public async Task<IEnumerable<Mesai>> GetAllMesailerAsync()
        {
            return await _service.GetAllMesailerAsync();
        }

        public async Task<Mesai> GetMesaiByIdAsync(int id)
        {
            return await _service.GetMesaiByIdAsync(id);
        }

        public async Task<Mesai> UpdateMesaiAsync(Mesai mesai)
        {
            return await _service.UpdateMesaiAsync(mesai);
        }
    }
}
