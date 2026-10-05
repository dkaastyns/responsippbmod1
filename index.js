const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API Pencatatan Peminjaman Buku Perpustakaan' });
});

// 1. Create - Tambah data peminjaman buku
app.post('/loans', async (req, res) => {
  try {
    const { member_name, book_title, borrow_date, return_date, status } = req.body;
    
    // Validasi input sederhana
    if (!member_name || !book_title || !borrow_date || !status) {
      return res.status(400).json({ error: 'Lengkapi semua field yang wajib (member_name, book_title, borrow_date, status)' });
    }

    const { data, error } = await supabase
      .from('loans')
      .insert([
        { member_name, book_title, borrow_date, return_date, status }
      ])
      .select();

    if (error) throw error;
    
    res.status(201).json({ message: 'Data peminjaman berhasil ditambahkan', data: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Read - Ambil semua data peminjaman (dengan opsi filter)
app.get('/loans', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = supabase.from('loans').select('*').order('created_at', { ascending: false });
    
    // Filter berdasarkan status jika query param 'status' diberikan
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    res.json({ message: 'Berhasil mengambil data peminjaman', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Read (Single) - Ambil data peminjaman berdasarkan ID
app.get('/loans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
      }
      throw error;
    }
    
    res.json({ message: 'Berhasil mengambil data peminjaman', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update - Perbarui data peminjaman
app.put('/loans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { member_name, book_title, borrow_date, return_date, status } = req.body;
    
    const { data, error } = await supabase
      .from('loans')
      .update({ member_name, book_title, borrow_date, return_date, status })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
    }
    
    res.json({ message: 'Data peminjaman berhasil diperbarui', data: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Delete - Hapus data peminjaman
app.delete('/loans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
    }
    
    res.json({ message: 'Data peminjaman berhasil dihapus', data: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Export untuk Vercel (serverless)
module.exports = app;
