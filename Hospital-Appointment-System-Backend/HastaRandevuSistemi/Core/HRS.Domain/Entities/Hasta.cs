using System.ComponentModel.DataAnnotations;

namespace HRS.Domain.Entities
{
    public class Hasta
    {
        [Key]
        public string Hasta_TC { get; set; }
        public DateTime DogumTarihi { get; set; }
        public string Isim { get; set; }
        public string Soyisim { get; set; }
        public string AnneAdi { get; set; }
        public string BabaAdi { get; set; }
        public string SaglikGecmisi { get; set; }
        public string DogumYeri { get; set; }
        public bool Cinsiyet { get; set; }
        public string Sifre { get; set; }
        public int Adres_ID { get; set; }
        public int Iletisim_ID { get; set; }
        public List<string> Roles { get; set; } = new List<string> { "Hasta" };
    }
}
