namespace HRS.Application.DTOs
{
    public class AddNewBolum
    {
        public BolumDTO BolumBilgisi { get; set; }
        public IletisimDTO IletisimBilgisi { get; set; }
    }

    public class AddNewPoliklinik
    {
        public PoliklinikDTO PoliklinikBilgisi { get; set; }
        public AdresDTO AdresBilgisi { get; set; }
        public IletisimDTO IletisimBilgisi { get; set; }
    }

    public class AddNewDoktor
    {
        public DoktorDTO DoktorBilgisi { get; set; }
        public AdresDTO AdresBilgisi { get; set; }
        public IletisimDTO IletisimBilgisi { get; set; }
    }
}
