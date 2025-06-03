namespace HRS.Domain.Entities
{
    public class Adres
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
}
