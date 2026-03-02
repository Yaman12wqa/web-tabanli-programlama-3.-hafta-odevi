# BEUBlog

BEUBlog, React tabanli bir istemci ve Node.js/Express tabanli bir REST API ile gelistirilmis tam yigin bir blog uygulamasidir. Proje; kullanici kimlik dogrulamasi, rol bazli yetkilendirme, yazi yonetimi, kategori yonetimi ve moderasyon akislarini tek bir yapida toplar.

## Proje Ozeti

Bu uygulamada:

- Kullanicilar kayit olabilir ve giris yapabilir.
- Kullanicilar kendi yazilarini olusturabilir, duzenleyebilir ve silebilir.
- Normal kullanici tarafindan olusturulan yazilar once moderasyona duser.
- Admin kullanicilar yazilari onaylayabilir, beklemeye alabilir veya askiya alabilir.
- Admin kullanicilar kategori ekleyip silebilir.
- Yazilar slug tabanli URL ile goruntulenir.
- Yazi ve profil gorseli yukleme desteklenir.

## Ozellikler

- JWT ile kayit, giris ve oturum dogrulama
- `user` ve `admin` rol destegi
- React Quill ile zengin metin editoru
- Yazilar icin begen / begenmekten vazgec akisi
- Yazi durumlari: `pending`, `approved`, `suspended`
- Profil bilgisi, biyografi ve profil fotografi guncelleme
- Sifre degistirme
- Kapak gorseli yukleme
- Acik / koyu tema destegi
- MongoDB tabanli veri saklama
- Docker ve Docker Compose ile calistirma destegi

## Kullanilan Teknolojiler

### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- React Quill
- Lucide React

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Multer
- slugify

### DevOps

- Docker
- Docker Compose
- Nginx

## Proje Yapisi

```text
.
+-- backend/
|   +-- middleware/
|   +-- models/
|   +-- routes/
|   +-- uploads/
|   +-- make-admin.js
|   +-- migrate-slugs.js
|   `-- server.js
+-- frontend/
|   +-- src/
|   |   +-- components/
|   |   +-- context/
|   |   `-- pages/
|   +-- Dockerfile
|   `-- nginx.conf
`-- docker-compose.yml
```

## Kurulum

### Gereksinimler

- Node.js 20 veya uzeri
- npm
- MongoDB
- Docker (opsiyonel)

### 1. Repoyu klonlayin

```bash
git clone <repo-url>
cd beublog
```

### 2. Backend kurulumu

```bash
cd backend
npm install
```

`backend/.env` dosyasini olusturun:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=guclu-bir-secret-key
```

Backend sunucusunu baslatin:

```bash
npm run dev
```

### 3. Frontend kurulumu

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### 4. Uygulamayi acin

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Docker ile Calistirma

Proje kok dizininde bir `.env` dosyasi olusturup asagidaki degiskeni ekleyebilirsiniz:

```env
JWT_SECRET=guclu-bir-secret-key
```

Ardindan:

```bash
docker compose up --build
```

Servisler:

- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Ortam Degiskenleri

Backend tarafinda kullanilan degiskenler:

- `PORT`: API sunucusunun calisacagi port
- `MONGODB_URI`: MongoDB baglanti adresi
- `JWT_SECRET`: JWT imzalama anahtari

## Yardimci Komutlar

Bir kullaniciyi admin yapmak icin:

```bash
node backend/make-admin.js <email>
```

Mevcut yazilar icin slug alanlarini doldurmak icin:

```bash
node backend/migrate-slugs.js
```

## API ve Gelistirme Notlari

- Frontend, API isteklerini varsayilan olarak `http://localhost:5000/api` adresine gonderir.
- Farkli bir ortama deploy edecekseniz `frontend/src/api.js` dosyasindaki `baseURL` alanini guncellemeniz gerekir.
- Yazi ve profil gorselleri `backend/uploads` klasorune kaydedilir.
- Gorsel yuklemede desteklenen formatlar: `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`
- Maksimum gorsel boyutu: `10 MB`

## Mevcut Sayfalar

- Ana sayfa
- Giris
- Kayit
- Yonetim paneli
- Profil
- Yeni yazi olusturma
- Yazi duzenleme
- Yazi detay
- Admin paneli

## Lisans

Bu proje egitim amacli gelistirilmistir.
