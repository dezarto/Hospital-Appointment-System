namespace HRS.Domain.Entities
{
    public class IlIlce
    {
        public int Il_ID { get; set; }
        public int Ilce_ID { get; set; }
    }

    public class HastaneDuyuru
    {
        public int Hastane_ID { get; set; }
        public int ID_Duyuru { get; set; }
    }

    public class HastaneHaber
    {
        public int Hastane_ID { get; set; }
        public int Haber_ID { get; set; }
    }

    public class HastaneEtkinlik
    {
        public int Hastane_ID { get; set; }
        public int Etkinlik_ID { get; set; }
    }

    public class HastaneSlider
    {
        public int Hastane_ID { get; set; }
        public int Slider_ID { get; set; }
    }

    public class HastaneBolum
    {
        public int Hastane_ID { get; set; }
        public int Bolum_ID { get; set; }
    }

    public class BolumPoliklinik
    {
        public int Bolum_ID { get; set; }
        public int Poliklinik_ID { get; set; }
    }
}
