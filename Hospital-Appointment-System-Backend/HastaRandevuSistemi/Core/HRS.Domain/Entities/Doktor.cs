using System.ComponentModel.DataAnnotations;

namespace HRS.Domain.Entities
{
    public class Doktor
    {
        [Key]
        public string Doktor_TC { get; set; }
        public string Isim { get; set; }
        public string Soyisim { get; set; }
        public bool Cinsiyet { get; set; }
        public string Sifre { get; set; }
        public int Poliklinik_ID { get; set; }
        public int Uzmanlik_ID { get; set; }
        public int Iletisim_ID { get; set; }
        public int Adres_ID { get; set; }
        public List<string> Roles { get; set; } = new List<string> { "Doktor" };
    }

    public class DoktorUzmanlik
    {
        public int UzmanlikID { get; set; }
        public string UzmanlikAdi { get; set; }
    }

    public class DoktorMesai
    {
        public string Doktor_TC { get; set; }
        public int MesaiID { get; set; }
    }
}
