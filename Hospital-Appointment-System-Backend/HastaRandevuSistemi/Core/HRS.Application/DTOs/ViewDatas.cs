namespace HRS.Application.DTOs
{
    public class DoktorView
    {
        public DoktorV DoktorBilgisi { get; set; }
        public AdresDTO AdresBilgisi { get; set; }
        public IletisimDTO IletisimBilgisi { get; set; }
    }

    public class DoktorV
    {
        public string Doktor_TC { get; set; }
        public string Isim { get; set; }
        public string Soyisim { get; set; }
        public bool Cinsiyet { get; set; }
        public string Sifre { get; set; }
        public string PoliklinikAdi { get; set; }
        public string UzmanlikAdi { get; set; }
    }

    public class RandevuV
    {
        public int RandevuID { get; set; }
        public string DoktorAdiSoyadi { get; set; }
        public string Hasta_TC { get; set; }
        public string PoliklinikAdi { get; set; }
        public string BolumAdi { get; set; }
        public string HastaneAdi { get; set; }
        public DateTime? RandevuTarihi { get; set; }
        public TimeSpan? BaslangıcSaati { get; set; }
        public TimeSpan? BitisSaati { get; set; }
    }

    public class HastaView
    {
        public HastaDTO HastaBilgisi { get; set; }
        public AdresDTO AdresBilgisi { get; set; }
        public IletisimDTO IletisimBilgisi { get; set; }
    }

    public class  IlveIlceV
    {
        public int IlId { get; set; }
        public string IlAdi { get; set; }
        public List<IlceDTO> IlceBilgisi { get; set; }
    }

    public class RandevuBilgisiV
    {
        public int RandevuID { get; set; }
        public DoktorDTO Doktor { get; set; }
        public HastaDTO Hasta { get; set; }
        public RandevuDTO RandevuDetay { get; set; }
    }
}
