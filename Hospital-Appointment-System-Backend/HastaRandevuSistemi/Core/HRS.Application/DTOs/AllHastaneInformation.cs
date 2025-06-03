namespace HRS.Application.DTOs
{
    public class AllHastaneInformation
    {
        //Hastane
        public int ID { get; set; }
        public string HastaneAdi { get; set; }
        public int YatakKapasitesi { get; set; }
        public string Aciklama { get; set; }
        public int Iletisim_ID { get; set; }
        public int Adres_ID { get; set; }
        public int About_ID { get; set; }

        //About
        public string? Misyon { get; set; }
        public string? Vizyon { get; set; }

        //Iletisim
        public string? TelNo { get; set; }
        public string? TelNo2 { get; set; }
        public string? Email { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public string? Instagram { get; set; }
        public string? Linkedin { get; set; }

        //Address
        public string? Ulke { get; set; }
        public string? Mahalle { get; set; }
        public string? CaddeSokak { get; set; }
        public string? DisKapiNo { get; set; }
        public string? IcKapiNo { get; set; }
        public string? Il { get; set; }
        public string? Ilce { get; set; }
    }
}
