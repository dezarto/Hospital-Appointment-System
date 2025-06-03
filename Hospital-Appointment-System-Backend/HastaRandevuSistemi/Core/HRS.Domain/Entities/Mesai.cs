namespace HRS.Domain.Entities
{
    public class Mesai
    {
        public int MesaiID { get; set; }
        public bool Aktif { get; set; }
        public DateTime Tarih { get; set; }
        public TimeSpan BaslangicSaati { get; set; }
        public TimeSpan BitisSaati { get; set; }
    }
}
