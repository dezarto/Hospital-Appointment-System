namespace HRS.Application.DTOs
{
    public class AllSlidersAndEtkinlikAndDuyuruAndHaber
    {
        public List<SliderDTO> Sliders { get; set; }
        public List<HaberDTO> Haberler { get; set; }
        public List<DuyuruDTO> Duyurular { get; set; }
        public List<EtkinlikDTO> Etkinlikler { get; set; }
    }
}
