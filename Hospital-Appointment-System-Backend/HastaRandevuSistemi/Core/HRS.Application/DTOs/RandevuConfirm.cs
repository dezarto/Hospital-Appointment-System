namespace HRS.Application.DTOs
{
    public class RandevuConfirm
    {
        public string Hasta_TC { get; set; }
        public string Doktor_TC { get; set; }
        public int PoliklinikID { get; set; }
        public int MesaiID { get; set; }
        public DateTime Tarih { get; set; }
        public TimeSpan BaslangicZamani { get; set; }
        public TimeSpan BitisZamani { get; set; }
    }
}
