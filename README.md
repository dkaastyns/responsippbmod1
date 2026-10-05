# REST API Pencatatan Peminjaman Buku Perpustakaan

**Dikembangkan oleh:**
- **Nama**: Ahmad Dika Styansah
- **NIM**: 21120124130052
- **Kelompok**: Kelompok 23
- **Shift**: Shift 04

Proyek ini adalah REST API sederhana yang dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase**. API ini ditujukan untuk layanan pencatatan peminjaman buku perpustakaan sebagai bagian dari Responsi PPB 2026.

## 📝 Deskripsi Umum & Tujuan Proyek

Tujuan dari proyek ini adalah menyediakan antarmuka *backend* berupa REST API untuk mengelola data peminjaman buku. Sistem ini memungkinkan operasi CRUD (Create, Read, Update, Delete) data peminjaman oleh anggota perpustakaan. Terdapat pula fitur query filter untuk memudahkan pencarian data, contohnya menampilkan buku yang statusnya terlambat dikembalikan.

## 🗄️ Struktur Data / Schema

Database menggunakan Supabase (PostgreSQL). Berikut adalah struktur tabel `loans` yang digunakan:

| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `UUID` (Primary Key) | Identifier unik untuk setiap peminjaman (generate otomatis) |
| `created_at` | `Timestamp` | Waktu data dibuat (generate otomatis) |
| `member_name` | `String` / `Text` | Nama anggota yang meminjam buku |
| `book_title` | `String` / `Text` | Judul buku yang dipinjam |
| `borrow_date` | `Date` | Tanggal peminjaman |
| `return_date` | `Date` (Nullable) | Tanggal pengembalian buku |
| `status` | `String` / `Text` | Status peminjaman (contoh: 'Dipinjam', 'Dikembalikan', 'Terlambat') |

*(Catatan: Anda dapat membuat tabel ini di Supabase SQL Editor atau Table Editor)*

## 🚀 Panduan Instalasi & Cara Menjalankan Lokal

1. **Clone repository ini**
   ```bash
   git clone <URL_REPO_GITHUB_ANDA>
   cd responsi-ppb-2026
   ```

2. **Install dependensi**
   Pastikan Anda telah menginstal `Node.js` dan `npm`. Kemudian jalankan:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   - Buat file `.env` di root direktori.
   - Tambahkan variabel berikut (sesuaikan dengan kredensial Supabase Anda):
     ```env
     PORT=3000
     SUPABASE_URL=https://<project-ref>.supabase.co
     SUPABASE_KEY=<your-anon-key>
     ```

4. **Jalankan Server Lokal**
   Untuk mode development (dengan nodemon auto-restart):
   ```bash
   npm run dev
   ```
   Atau mode standar:
   ```bash
   npm start
   ```

   Server akan berjalan di `http://localhost:3000`.

## 🌐 Link Hasil Deployment Vercel

API ini dapat diakses secara publik melalui URL berikut:
**[https://responsippbmod1-ten.vercel.app](https://responsippbmod1-ten.vercel.app)**

---

## 🛠️ Panduan Menguji API (Menggunakan Postman)

Anda dapat menguji API ini menggunakan aplikasi seperti **Postman** atau **Thunder Client**. Berikut adalah langkah-langkah umumnya:

1. **Siapkan URL Target**
   - Jika menguji secara lokal, gunakan: `http://localhost:3000`
   - Jika menguji dari Vercel, gunakan base URL Vercel berikut: `https://responsippbmod1-ten.vercel.app`
2. **Pilih HTTP Method yang Sesuai**
   - `GET` : Mengambil data.
   - `POST` : Menambah data baru.
   - `PUT` : Mengubah data yang sudah ada.
   - `DELETE` : Menghapus data.
3. **Pilih Endpoint yang Tepat**
   - Untuk melakukan Create/Read All, arahkan URL ke `/loans` (Contoh: `POST https://.../loans`). Jangan melakukan `POST` ke `/` karena akan menghasilkan pesan error `Cannot POST /`.
   - Untuk Update/Delete, tambahkan ID di belakangnya (Contoh: `PUT https://.../loans/:id`).
4. **Isi Body Request (Bila Berlaku)**
   - Saat menggunakan method `POST` dan `PUT`, pindah ke tab **Body** di Postman.
   - Pilih tipe data **raw** dan ubah formatnya dari Text menjadi **JSON**.
   - Ketikkan data JSON yang valid sesuai kebutuhan tabel Anda.
5. **Kirim (Send)**
   - Tekan **Send** dan lihat respon HTTP Status Code dan response data di panel bawah.

## 📖 Contoh Request dan Response

### 1. Create (Tambah Data Peminjaman)
- **Endpoint**: `POST /loans`
- **Request Body**:
  ```json
  {
    "member_name": "Budi Santoso",
    "book_title": "Belajar Express JS",
    "borrow_date": "2026-10-01",
    "status": "Dipinjam"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Data peminjaman berhasil ditambahkan",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "member_name": "Budi Santoso",
      "book_title": "Belajar Express JS",
      "borrow_date": "2026-10-01",
      "return_date": null,
      "status": "Dipinjam",
      "created_at": "2026-10-05T10:00:00.000Z"
    }
  }
  ```

### 2. Read All (Ambil Semua Data Peminjaman)
- **Endpoint**: `GET /loans`
- **Response (200 OK)**:
  ```json
  {
    "message": "Berhasil mengambil data peminjaman",
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "member_name": "Budi Santoso",
        "book_title": "Belajar Express JS",
        "status": "Dipinjam",
        "borrow_date": "2026-10-01"
      }
    ]
  }
  ```

### 3. Read All dengan Filter Status
- **Endpoint**: `GET /loans?status=Terlambat`
- **Response (200 OK)**:
  ```json
  {
    "message": "Berhasil mengambil data peminjaman",
    "data": [
      {
        "id": "987fcdeb-51a2-43d7-9012-345678901234",
        "member_name": "Siti Aminah",
        "book_title": "Algoritma Pemrograman",
        "status": "Terlambat",
        "borrow_date": "2026-09-15"
      }
    ]
  }
  ```

### 4. Read One (Ambil Data Spesifik)
- **Endpoint**: `GET /loans/:id`
- **Response (200 OK)**:
  ```json
  {
    "message": "Berhasil mengambil data peminjaman",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "member_name": "Budi Santoso",
      "book_title": "Belajar Express JS",
      "status": "Dipinjam"
    }
  }
  ```

### 5. Update (Perbarui Data Peminjaman)
- **Endpoint**: `PUT /loans/:id`
- **Request Body**:
  ```json
  {
    "member_name": "Budi Santoso",
    "book_title": "Belajar Express JS",
    "borrow_date": "2026-10-01",
    "return_date": "2026-10-05",
    "status": "Dikembalikan"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Data peminjaman berhasil diperbarui",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "member_name": "Budi Santoso",
      "book_title": "Belajar Express JS",
      "borrow_date": "2026-10-01",
      "return_date": "2026-10-05",
      "status": "Dikembalikan",
      "created_at": "2026-10-05T10:00:00.000Z"
    }
  }
  ```

### 6. Delete (Hapus Data Peminjaman)
- **Endpoint**: `DELETE /loans/:id`
- **Response (200 OK)**:
  ```json
  {
    "message": "Data peminjaman berhasil dihapus",
    "data": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "member_name": "Budi Santoso",
      "book_title": "Belajar Express JS"
    }
  }
  ```
