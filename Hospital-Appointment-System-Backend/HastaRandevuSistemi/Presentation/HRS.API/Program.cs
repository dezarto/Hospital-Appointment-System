using System.Text;
using HRS.Application.Interfaces;
using HRS.Application.Services;
using HRS.Domain.Interfaces;
using HRS.Domain.Services;
using HRS.Infrastructure.Persistence;
using HRS.Infrastructure.Repositories;
using HRS.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
builder.Services.AddControllers();

// SQL Server Baglantisi
builder.Services.AddDbContext<SqlDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register DbContext to resolve SqlDbContext
builder.Services.AddScoped<DbContext>(provider => provider.GetRequiredService<SqlDbContext>());

// CORS ayarlar?
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigin", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// AutoMapper Kaydi
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Yetkilendirme & Kimlik Do?rulama Middleware'leri
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = false,
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        };
    });

builder.Services.AddAuthorization();

// Swagger JWT Yetkilendirme Ayarlari
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HRS API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// Servis Bagimliliklerini Ekle
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IHastaRepository, HastaRepository>();
builder.Services.AddScoped<IHastaService, HastaService>();
builder.Services.AddScoped<IAdresService, AdresService>();
builder.Services.AddScoped<IIletisimService, IletisimService>();
builder.Services.AddScoped<IIlService, IlService>();
builder.Services.AddScoped<IIlceService, IlceService>();
builder.Services.AddScoped<IIlIlceService, IlIlceService>();
builder.Services.AddScoped<IIlIlceRepository, IlIlceRepository>();
builder.Services.AddScoped<IUnAuthService, UnAuthService>();
builder.Services.AddScoped<IHastaneService, HastaneService>();
builder.Services.AddScoped<IHakkimdaHastaneService, HakkimdaHastaneService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IHaberService, HaberService>();
builder.Services.AddScoped<IHaberRepository, HaberRepository>();
builder.Services.AddScoped<IEtkinlikService, EtkinlikService>();
builder.Services.AddScoped<IEtkinlikRepository, EtkinlikRepository>();
builder.Services.AddScoped<IDuyuruService, DuyuruService>();
builder.Services.AddScoped<ISliderService, SliderService>();
builder.Services.AddScoped<IDuyuruRepository, DuyuruRepository>();
builder.Services.AddScoped<ISliderRepository, SliderRepository>();
builder.Services.AddScoped<IHastaneDuyuruService, HastaneDuyuruService>();
builder.Services.AddScoped<IHastaneHaberService, HastaneHaberService>();
builder.Services.AddScoped<IHastaneEtkinlikService, HastaneEtkinlikService>();
builder.Services.AddScoped<IHastaneDuyuruRepository, HastaneDuyuruRepository>();
builder.Services.AddScoped<IHastaneEtkinlikRepository, HastaneEtkinlikRepository>();
builder.Services.AddScoped<IHastaneHaberRepository, HastaneHaberRepository>();
builder.Services.AddScoped<IHastaneSliderRepository, HastaneSliderRepository>();
builder.Services.AddScoped<IHastaneSliderService, HastaneSliderService>();
builder.Services.AddScoped<IHastaneBolumService, HastaneBolumService>();
builder.Services.AddScoped<IHastaneBolumRepository, HastaneBolumRepository>();
builder.Services.AddScoped<IBolumPoliklinikService, BolumPoliklinikService>();
builder.Services.AddScoped<IBolumPoliklinikRepository, BolumPoliklinikRepository>();
builder.Services.AddScoped<IBolumService, BolumService>();
builder.Services.AddScoped<IBolumRepository, BolumRepository>();
builder.Services.AddScoped<IDoktorService, DoktorService>();
builder.Services.AddScoped<IDoktorApplicationService, DoktorApplicationService>();
builder.Services.AddScoped<IDoktorRepository, DoktorRepository>();
builder.Services.AddScoped<IDoktorUzmanlikService, DoktorUzmanlikService>();
builder.Services.AddScoped<IDoktorUzmanlikRepository, DoktorUzmanlikRepository>();
builder.Services.AddScoped<IMesaiService, MesaiService>();
builder.Services.AddScoped<IMesaiRepository, MesaiRepository>();
builder.Services.AddScoped<IDoktorMesaiService, DoktorMesaiService>();
builder.Services.AddScoped<IDoktorMesaiRepository, DoktorMesaiRepository>();
builder.Services.AddScoped<IPoliklinikService, PoliklinikService>();
builder.Services.AddScoped<IPoliklinikRepository, PoliklinikRepository>();
builder.Services.AddScoped<IRandevuService, RandevuService>();
builder.Services.AddScoped<IRandevuRepository, RandevuRepository>();
builder.Services.AddScoped<IHastaRandevuService, HastaRandevuService>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

var app = builder.Build();

// Middleware Yapilandirmasi
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
