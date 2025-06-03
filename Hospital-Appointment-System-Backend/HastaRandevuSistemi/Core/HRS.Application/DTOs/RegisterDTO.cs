using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRS.Application.DTOs
{
    public class RegisterDTO
    {
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
        public List<string> Roles { get; set; } = new List<string> { "Hasta" };
        
        // Addres
        public string Ulke { get; set; }
        public string Mahalle { get; set; }
        public string CaddeSokak { get; set; }
        public string DisKapiNo { get; set; }
        public string IcKapiNo { get; set; }
        public int Il_ID { get; set; }
        public int Ilce_ID { get; set; }

        // Iletisim
        public string TelNo { get; set; }
        public string TelNo2 { get; set; }
        public string Email { get; set; }
    }
}
