namespace HRS.Application.DTOs
{
    public class NewHastane
    {
        public string HastaneAdi { get; set; }
        public int YatakKapasitesi { get; set; }
        public string Aciklama { get; set; }
        public int Iletisim_ID { get; set; }
        public int Adres_ID { get; set; }
        public int About_ID { get; set; }

        public string TelNo { get; set; }
        public string? TelNo2 { get; set; }
        public string Email { get; set; }

        public string Ulke { get; set; }
        public string Mahalle { get; set; }
        public string CaddeSokak { get; set; }
        public string DisKapiNo { get; set; }
        public string IcKapiNo { get; set; }
        public int Il_ID { get; set; }
        public int Ilce_ID { get; set; }

        public string Misyon { get; set; }
        public string Vizyon { get; set; }
    }
}
