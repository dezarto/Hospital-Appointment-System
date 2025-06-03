namespace HRS.Application.DTOs
{
    public class PoliklinikDTO
    {
        public int PoliklinikID { get; set; }
        public string PoliklinikAdi { get; set; }
        public int Iletisim_ID { get; set; }
        public int Adres_ID { get; set; }
    }

    public class AdresDTO
    {
        public int ID { get; set; }
        public string Ulke { get; set; }
        public string Mahalle { get; set; }
        public string CaddeSokak { get; set; }
        public string? DisKapiNo { get; set; }
        public string? IcKapiNo { get; set; }
        public int Il_ID { get; set; }
        public int Ilce_ID { get; set; }
    }

    public class BolumDTO
    {
        public int BolumID { get; set; }
        public string BolumAdi { get; set; }
        public string BolumAciklama { get; set; }
        public int? Iletisim_ID { get; set; }
    }

    public class DuyuruDTO
    {
        public int ID { get; set; }
        public string Baslik { get; set; }
        public string Icerik { get; set; }
        public string Resim { get; set; }
        public DateTime Tarih { get; set; }
    }

    public class EtkinlikDTO
    {
        public int ID { get; set; }
        public string Baslik { get; set; }
        public string Icerik { get; set; }
        public string Resim { get; set; }
        public DateTime Tarih { get; set; }
    }

    public class HaberDTO
    {
        public int ID { get; set; }
        public string Baslik { get; set; }
        public string Icerik { get; set; }
        public string Resim { get; set; }
        public DateTime Tarih { get; set; }
    }

    public class HastaneDTO
    {
        public int ID { get; set; }
        public string HastaneAdi { get; set; }
        public int YatakKapasitesi { get; set; }
        public string Aciklama { get; set; }
        public int Iletisim_ID { get; set; }
        public int Adres_ID { get; set; }
        public int About_ID { get; set; }
    }

    public class SliderDTO
    {
        public int ID { get; set; }
        public string SlideBaslik { get; set; }
        public string Resim { get; set; }
    }

    public class MesaiDTO
    {
        public int MesaiID { get; set; }
        public bool Aktif { get; set; }
        public DateTime Tarih { get; set; }
        public TimeSpan BaslangicSaati { get; set; }
        public TimeSpan BitisSaati { get; set; }
    }

    public class HastaDTO
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
        public int Adres_ID { get; set; }
        public int Iletisim_ID { get; set; }
        public List<string> Roles { get; set; } = new List<string> { "Hasta" };
    }

    public class DoktorDTO
    {
        public string Doktor_TC { get; set; }
        public string Isim { get; set; }
        public string Soyisim { get; set; }
        public bool Cinsiyet { get; set; }
        public string Sifre { get; set; }
        public int Poliklinik_ID { get; set; }
        public int Uzmanlik_ID { get; set; }
        public int Iletisim_ID { get; set; }
        public int Adres_ID { get; set; }
    }

    public class DoktorUzmanlik
    {
        public int UzmanlikID { get; set; }
        public string UzmanlikAdi { get; set; }
    }

    public class IletisimDTO
    {
        public int? ID { get; set; }
        public string TelNo { get; set; }
        public string? TelNo2 { get; set; }
        public string Email { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public string? Instagram { get; set; }
        public string? Linkedin { get; set; }
    }

    public class HakkimdaHastaneDTO
    {
        public string Misyon { get; set; }
        public string Vizyon { get; set; }
    }

    public class IlDTO
    {
        public int ID { get; set; }
        public string IlAdi { get; set; }
    }

    public class IlceDTO
    {
        public int ID { get; set; }
        public string IlceAdi { get; set; }
    }

    public class RandevuDTO
    {
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
