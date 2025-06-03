using HRS.Domain.Entities;

namespace HRS.Application.DTOs
{
    public class RandevuAra
    {
        public List<IlBilgisiDto>? Iller { get; set; }
    }

    public class IlBilgisiDto
    {
        public int Id { get; set; }
        public string IlAdi { get; set; }
        public List<IlceBilgisiDto> Ilceler { get; set; }
    }

    public class IlceBilgisiDto
    {
        public int Id { get; set; }
        public string IlceAdi { get; set; }
        public List<HastaneBilgisi> Hastaneler { get; set; }
    }

    public class HastaneBilgisi
    {
        public int HastaneID { get; set; }
        public string HastaneAdi { get; set; }
        public AdresDTO Adres { get; set; }
        public List<Bolum> Bolumler { get; set; }
        public List<Poliklinik> Poliklinikler { get; set; }
    }

    public class Bolum
    {
        public int BolumID { get; set; }
        public string BolumAdi { get; set; }
        public string BolumAciklama { get; set; }
        public List<Doktor> Doktorlar { get; set; }
    }

    public class Poliklinik
    {
        public int PoliklinikID { get; set; }
        public string PoliklinikAdi { get; set; }
        public List<Doktor> Doktorlar { get; set; }
    }

    public class Doktor
    {
        public string Doktor_TC { get; set; }
        public string Isim { get; set; }
        public string Soyisim { get; set; }
        public string UzmanlikAdi { get; set; }
        public bool Cinsiyet { get; set; }
        public List<Mesai> DoktorMesai { get; set; }
    }
}