namespace HRS.Domain.Entities
{
    public class Haber
    {
        public int ID { get; set; }
        public string Baslik { get; set; }
        public string Icerik { get; set; }
        public string Resim { get; set; }
        public DateTime Tarih { get; set; }
    }
}
