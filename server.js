const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'walas'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to DB:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// ========================
// CRUD SISWA
// ========================

// READ semua siswa
app.get('/api/siswa', (req, res) => {
  db.query('SELECT * FROM siswa', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// READ satu siswa berdasarkan NIS
app.get('/api/siswa/:nis', (req, res) => {
  const { nis } = req.params;
  db.query('SELECT * FROM siswa WHERE nis = ?', [nis], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

// CREATE siswa
app.post('/api/siswa', (req, res) => {
  const { nis, nama_siswa, tanggal_lahir, alamat, id_kelas } = req.body;
  const sql = 'INSERT INTO siswa (nis, nama_siswa, tanggal_lahir, alamat, id_kelas) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nis, nama_siswa, tanggal_lahir, alamat, id_kelas], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Siswa berhasil ditambahkan', id: result.insertId });
  });
});

// UPDATE siswa
app.put('/api/siswa/:nis', (req, res) => {
  const { nis } = req.params;
  const { nama_siswa, tanggal_lahir, alamat, id_kelas } = req.body;
  const sql = 'UPDATE siswa SET nama_siswa=?, tanggal_lahir=?, alamat=?, id_kelas=? WHERE nis=?';
  db.query(sql, [nama_siswa, tanggal_lahir, alamat, id_kelas, nis], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Siswa berhasil diperbarui' });
  });
});

// DELETE siswa
app.delete('/api/siswa/:nis', (req, res) => {
  const { nis } = req.params;
  db.query('DELETE FROM siswa WHERE nis = ?', [nis], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Siswa berhasil dihapus' });
  });
});

// GET daftar kelas
app.get('/api/kelas', (req, res) => {
  db.query('SELECT id_kelas, nama_kelas FROM kelas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ========================
// CRUD GURU
// ========================

// READ semua guru
app.get('/api/guru', (req, res) => {
  db.query('SELECT * FROM guru', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// READ guru berdasarkan id_guru
app.get('/api/guru/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM guru WHERE id_guru = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

// CREATE guru
app.post('/api/guru', (req, res) => {
  const { nama_guru, kontak, alamat } = req.body;
  const sql = 'INSERT INTO guru (nama_guru, kontak, alamat) VALUES (?, ?, ?)';
  db.query(sql, [nama_guru, kontak, alamat], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Guru berhasil ditambahkan', id: result.insertId });
  });
});

// UPDATE guru
app.put('/api/guru/:id', (req, res) => {
  const { id } = req.params;
  const { nama_guru, kontak, alamat } = req.body;
  const sql = 'UPDATE guru SET nama_guru=?, kontak=?, alamat=? WHERE id_guru=?';
  db.query(sql, [nama_guru, kontak, alamat, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Guru berhasil diperbarui' });
  });
});

// DELETE guru
app.delete('/api/guru/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM guru WHERE id_guru=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Guru berhasil dihapus' });
  });
});

// ========================
// LOGIN ADMIN
// ========================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE username=? AND password=?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).json({ message: 'Login gagal' });
    res.json({ message: 'Login berhasil' });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
