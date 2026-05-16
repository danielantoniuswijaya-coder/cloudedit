# CloudEdit - Platform Jasa Editing Berbasis Cloud

CloudEdit adalah platform profesional yang dirancang untuk memudahkan interaksi antara pelanggan dan editor kreatif melalui sistem berbasis cloud. Project ini dibangun sebagai demonstrasi tugas **Cloud Computing** yang mengimplementasikan arsitektur modern (React, Node.js, dan Firebase).

## Fitur Utama
- **Landing Page Modern**: Desain premium dengan tema biru gelap & putih (Responsive).
- **Sistem Pemesanan**: Form order multi-step dengan upload file raw langsung ke cloud storage.
- **Dashboard User**: Pantau progres pengerjaan dan unduh hasil edit secara real-time.
- **Admin Dashboard**: Kelola antrean pesanan, ubah status (Pending, Proses, Selesai), dan kirim hasil akhir.
- **Auth & Security**: Registrasi, Login, dan proteksi rute (Guest/User/Admin).

## Teknologi Stack
- **Frontend**: React 19, Tailwind CSS 4, Framer Motion (Animations).
- **Backend/API**: Express.js (Node.js).
- **Database & Cloud Services**: Firebase (Auth, Firestore, Cloud Storage).

## Cara Konfigurasi (Opsional)
Jika ingin menjalankan secara lokal dengan Firebase sendiri:
1. Ganti konfigurasi di `firebase-applet-config.json`.
2. Pastikan Firestore Rules sudah di-deploy menggunakan file `firestore.rules`.
3. Set level akses Admin secara manual di Firestore pada koleksi `users` dengan field `role: "admin"`.

## Akun Admin Default (Percobaan)
Untuk masuk sebagai admin pertama kali di lingkungan demo ini, Anda dapat mendaftar lalu mengubah role di konsol Firestore, atau gunakan kredensial berikut (jika sudah di-seed):
- **Email**: admin@cloudedit.com
- **Password**: admin123

---
**Catatan untuk Dosen/Penilai**: Project ini menggunakan Firestore (NoSQL) karena karakteristiknya yang lebih cocok untuk sistem terdistribusi/cloud dibandingkan MySQL tradisional. Struktur data yang ekuivalen dalam versi SQL disediakan di file `database.sql`.
