namespace HRS.Domain.Entities
{
    public class Hastane
    {
        public int ID { get; set; }
        public string HastaneAdi { get; set; }
        public int YatakKapasitesi { get; set; }
        public string Aciklama { get; set; }
        public int Iletisim_ID { get; set; }
        public int Adres_ID { get; set; }
        public int About_ID { get; set; }
    }
}
