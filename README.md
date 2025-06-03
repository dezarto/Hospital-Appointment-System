# Hospital Reservation System (HRS)

[TÜRKÇE]

## Genel Bakış
**Hastane Randevu Sistemi (HRS)**, hastane işlemlerini yönetmek için tasarlanmış kapsamlı bir ASP.NET Core Web API'sidir. Sistem, randevu yönetimi, doktor ve hasta verileri, hastane bilgileri ve idari görevleri destekler. Çoklu kullanıcı rolleri (Yönetici, Doktor, Hasta) için rol tabanlı yetkilendirme sunar ve sağlık yönetimi için sağlam bir backend ve frontend sağlar.

## Özellikler

### Kimlik Doğrulaması Olmayan Uç Noktalar (`UnAuthController`)
- Şehir ve ilçe bilgilerini alma.
- Hastane ID'sine göre doktorları getirme.
- Hastane ID'sine göre detaylı hastane bilgisi alma.
- Tüm hastaneleri listeleme.
- Hastane ID'sine göre slaytlar, etkinlikler, duyurular ve haberler alma.
- Doktor uzmanlıklarını getirme.

### Hasta Uç Noktaları (`HastaController`)
- Rol: `Yönetici`, `Hasta`
- Mevcut randevuları arama.
- Hasta TC numarasına göre randevuları görüntüleme.
- Randevu onaylama.
- Hasta verilerini alma ve güncelleme.
- Hasta TC ve randevu ID'sine göre randevu detaylarını alma.

### Doktor Uç Noktaları (`DoktorController`)
- Rol: `Yönetici`, `Doktor`
- Doktor TC numarasına göre doktor verilerini alma ve güncelleme.
- Doktor mesai saatlerini alma.
- Doktorlar için randevu listesi ve detaylarını görüntüleme.
- Randevu notlarını güncelleme.

### Kimlik Doğrulama Uç Noktaları (`AuthController`)
- Hasta kaydı ve girişi.
- Yetkili kullanıcılar (Yönetici, Hasta, Doktor) için şifre güncelleme.

### Yönetici Uç Noktaları (`AdminController`)
- Rol: `Yönetici`
- **Hastane Yönetimi**:
  - Hastaneleri listeleme, ekleme, güncelleme ve silme.
  - Hastane iletişim, adres ve hakkımızda bilgilerini yönetme.
- **Hasta Yönetimi**:
  - Hastaları listeleme, ekleme, güncelleme ve silme.
  - Hasta iletişim ve adres bilgilerini yönetme.
- **Şehir/İlçe Yönetimi**:
  - Şehir (il) ve ilçe ekleme, güncelleme ve silme.
- **İçerik Yönetimi**:
  - Hastaneler için duyuru, haber, etkinlik ve slaytları yönetme (CRUD işlemleri).
- **Doktor Yönetimi**:
  - Hastane veya polikliniğe göre doktorları listeleme.
  - Doktor ekleme, güncelleme ve silme.
- **Mesai Yönetimi**:
  - Doktor mesai saatlerini yönetme.
- **Randevu Yönetimi**:
  - Hastaneye göre randevuları listeleme ve silme.
- **Bölüm ve Poliklinik Yönetimi**:
  - Hastane bölümleri (bölüm) ve poliklinikleri yönetme (CRUD işlemleri).

## Teknolojiler
- **Framework**: ASP.NET Core
- **Dil**: C#
- **Kimlik Doğrulama**: `[Authorize]` öznitelikleriyle rol tabanlı yetkilendirme.
- **Bağımlılık Enjeksiyonu**: Servis entegrasyonu için kullanılır (örn. `IUnAuthService`, `IAdminService`).
- **HTTP Yöntemleri**: RESTful API tasarımı için GET, POST, PUT, DELETE.
- **Veri Aktarım Nesneleri (DTOs)**: Yapılandırılmış veri alışverişi için kullanılır.

## Başlangıç

### Ön Koşullar
- .NET Core SDK (sürüm 6.0 veya üstü)
- Uygulamayla uyumlu bir veritabanı (örn. SQL Server)
- Visual Studio veya C# destekleyen herhangi bir IDE

### API Kullanımı
- Temel URL: `http://localhost:5000/api/[controller]`
- Örnek Uç Noktalar:
  - Genel: `GET /api/UnAuth/city-district-information`
  - Hasta: `GET /api/Hasta/get-randevularim/{hastaTC}`
  - Doktor: `GET /api/Doktor/get-mesai/{doktorTC}`
  - Yönetici: `POST /api/Admin/add-new-hastane`
  - Kimlik Doğrulama: `POST /api/Auth/hasta-register`

### Kimlik Doğrulama
- API, rol tabanlı kimlik doğrulaması kullanır. Korumalı uç noktalar için geçerli bir JWT belirteci gereklidir.
- Roller: `Yönetici`, `Hasta`, `Doktor`.
- Belirteç almak için `/api/Auth/login` uç noktasını kullanın.

## İletişim
Sorular veya sorunlar için lütfen GitHub'da bir sorun açın veya proje sorumlularıyla iletişime geçin.

---

[ENGLISH]

## Overview
The **Hospital Reservation System (HRS)** is a comprehensive ASP.NET Core Web API designed to manage hospital-related operations, including appointments, doctor and patient data, hospital information, and administrative tasks. The system supports multiple user roles (Admin, Doctor, Patient) with role-based authorization and provides a robust backend for healthcare management.

## Features

### Unauthenticated Endpoints (`UnAuthController`)
- Retrieve city and district information.
- Fetch doctors by hospital ID.
- Get detailed hospital information by hospital ID.
- List all hospitals.
- Retrieve sliders, events, announcements, and news by hospital ID.
- Fetch doctor specializations.

### Patient Endpoints (`HastaController`)
- Role: `Admin`, `Hasta` (Patient)
- Search available appointments.
- View patient-specific appointments by TC number.
- Confirm appointments.
- Retrieve and update patient data.
- Get appointment details by patient TC and appointment ID.

### Doctor Endpoints (`DoktorController`)
- Role: `Admin`, `Doktor` (Doctor)
- Retrieve and update doctor data by TC number.
- Fetch doctor working hours (mesai).
- List and view appointment details for doctors.
- Update appointment notes.

### Authentication Endpoints (`AuthController`)
- Patient registration and login.
- Password update for authenticated users (Admin, Patient, Doctor).

### Admin Endpoints (`AdminController`)
- Role: `Admin`
- **Hospital Management**:
  - List, add, update, and delete hospitals.
  - Manage hospital communication, address, and about-us information.
- **Patient Management**:
  - List, add, update, and delete patients.
  - Manage patient communication and address information.
- **City/District Management**:
  - Add, update, and delete cities (il) and districts (ilce).
- **Content Management**:
  - Manage announcements, news, events, and sliders for hospitals (CRUD operations).
- **Doctor Management**:
  - List doctors by hospital or polyclinic.
  - Add, update, and delete doctors.
- **Working Hours (Mesai)**:
  - Manage doctor working hours.
- **Appointment Management**:
  - List and delete appointments by hospital.
- **Department and Polyclinic Management**:
  - Manage hospital departments (bolum) and polyclinics (CRUD operations).

## Technologies
- **Framework**: ASP.NET Core
- **Language**: C#
- **Authentication**: Role-based authorization using `[Authorize]` attributes.
- **Dependency Injection**: Used for service integration (e.g., `IUnAuthService`, `IAdminService`).
- **HTTP Methods**: GET, POST, PUT, DELETE for RESTful API design.
- **Data Transfer Objects (DTOs)**: Used for structured data exchange.

## Getting Started

### Prerequisites
- .NET Core SDK (version 6.0 or later)
- A database compatible with the application (e.g., SQL Server)
- Visual Studio or any IDE supporting C#

### API Usage
- Base URL: `http://localhost:5000/api/[controller]`
- Example Endpoints:
  - Public: `GET /api/UnAuth/city-district-information`
  - Patient: `GET /api/Hasta/get-randevularim/{hastaTC}`
  - Doctor: `GET /api/Doktor/get-mesai/{doktorTC}`
  - Admin: `POST /api/Admin/add-new-hastane`
  - Auth: `POST /api/Auth/hasta-register`

### Authentication
- The API uses role-based authentication. Ensure you have a valid JWT token for protected endpoints.
- Roles: `Admin`, `Hasta`, `Doktor`.
- Use the `/api/Auth/login` endpoint to obtain a token.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Contact
For issues or questions, please open an issue on GitHub or contact the project maintainers.
