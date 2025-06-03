using HRS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Persistence
{
    public class SqlDbContext : DbContext
    {
        public DbSet<Hasta> Hastalar { get; set; }
        public DbSet<Iletisim> Iletisimler { get; set; }
        public DbSet<Adres> Adresler { get; set; }
        public DbSet<Il> Iller { get; set; }
        public DbSet<Ilce> Ilceler { get; set; }
        public DbSet<Hastane> Hastaneler { get; set; }
        public DbSet<IlIlce> IlIlceler { get; set; }
        public DbSet<HakkimdaHastane> HakkimdaHastaneler { get; set; }
        public DbSet<Haber> Haberler { get; set; }
        public DbSet<Duyuru> Duyurular { get; set; }
        public DbSet<Etkinlik> Etkinlikler { get; set; }
        public DbSet<Slider> Sliderler { get; set; }
        public DbSet<HastaneDuyuru> HastaneDuyurular { get; set; }
        public DbSet<HastaneHaber> HastaneHaberler { get; set; }
        public DbSet<HastaneEtkinlik> HastaneEtkinlikler { get; set; }
        public DbSet<HastaneSlider> HastaneSliderler { get; set; }

        public DbSet<HastaneBolum> HastaneBolumler { get; set; }
        public DbSet<BolumPoliklinik> BolumPoliklinikler { get; set; }
        public DbSet<Bolum> Bolumler { get; set; }
        public DbSet<Doktor> Doktorlar { get; set; }
        public DbSet<DoktorUzmanlik> DoktorUzmanliklar { get; set; }
        public DbSet<Mesai> Mesailer { get; set; }
        public DbSet<DoktorMesai> DoktorMesailer { get; set; }
        public DbSet<Poliklinik> Poliklinikler { get; set; }
        public DbSet<Randevu> Randevular { get; set; }

        public SqlDbContext(DbContextOptions<SqlDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IlIlce>()
            .HasKey(ililce => new { ililce.Il_ID, ililce.Ilce_ID });

            modelBuilder.Entity<HastaneDuyuru>()
            .HasKey(hastaneDuyuru => new { hastaneDuyuru.ID_Duyuru, hastaneDuyuru.Hastane_ID });

            modelBuilder.Entity<HastaneEtkinlik>()
            .HasKey(hastaneEtkinlik => new { hastaneEtkinlik.Etkinlik_ID, hastaneEtkinlik.Hastane_ID });

            modelBuilder.Entity<HastaneHaber>()
            .HasKey(hastaneHaber => new { hastaneHaber.Haber_ID, hastaneHaber.Hastane_ID });

            modelBuilder.Entity<HastaneSlider>()
            .HasKey(hastaneSlider => new { hastaneSlider.Slider_ID, hastaneSlider.Hastane_ID });

            modelBuilder.Entity<HastaneBolum>()
            .HasKey(hastaneBolum => new { hastaneBolum.Bolum_ID, hastaneBolum.Hastane_ID });

            modelBuilder.Entity<BolumPoliklinik>()
            .HasKey(bolumPoliklinik => new { bolumPoliklinik.Bolum_ID, bolumPoliklinik.Poliklinik_ID });

            modelBuilder.Entity<DoktorUzmanlik>()
            .HasKey(doktorUzmanlik => new { doktorUzmanlik.UzmanlikID });

            modelBuilder.Entity<DoktorMesai>()
            .HasKey(doktorMesai => new { doktorMesai.MesaiID, doktorMesai.Doktor_TC });
        }
    }
}
