using System.ComponentModel.DataAnnotations;

namespace HRS.Domain.Entities
{
    public class Randevu
    {
        [Key]
        public int RandevuID { get; set; }
        public string Doktor_TC { get; set; }
        public string Hasta_TC { get; set; }
        public int Poliklinik_ID { get; set; }
        public string? RandevuNotu { get; set; }
        public DateTime? RandevuTarihi { get; set; }
        public TimeSpan? BaslangıcSaati { get; set; }
        public TimeSpan? BitisSaati { get; set; }
    }
}
