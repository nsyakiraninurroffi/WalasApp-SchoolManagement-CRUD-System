// Cek login
if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = '/login.html';
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  fetchSiswa();
  fetchKelas();

  // Ambil elemen form & tombol submit
  const form = document.getElementById('siswa-form');
  const submitBtn = document.getElementById('submit-btn');

  // Event submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nis = document.getElementById('nis').value;
    const namaSiswa = document.getElementById('nama-siswa').value;
    const tanggalLahir = document.getElementById('tanggal-lahir').value;
    const alamat = document.getElementById('alamat').value;
    const idKelas = document.getElementById('id-kelas').value;

    const data = {
      nis,
      nama_siswa: namaSiswa,
      tanggal_lahir: tanggalLahir,
      alamat,
      id_kelas: idKelas
    };

    if (submitBtn.textContent === 'Tambah') {
      await createSiswa(data);
    } else {
      await updateSiswa(nis, data);
      submitBtn.textContent = 'Tambah';
      document.getElementById('nis').disabled = false;
    }

    form.reset();
    fetchSiswa();
  });

  // Aktifkan filter/search realtime
  const searchInput = document.getElementById('search-siswa');
  if (searchInput) {
    searchInput.addEventListener('input', fetchSiswa);
  }
});

// === CRUD Functions ===

// Ambil semua siswa + filter by search
async function fetchSiswa() {
  const response = await fetch('/api/siswa');
  const siswa = await response.json();
  const siswaList = document.getElementById('siswa-list');
  siswaList.innerHTML = '';

  // Ambil keyword search
  const searchInput = document.getElementById('search-siswa');
  const keyword = searchInput ? searchInput.value.toLowerCase() : "";

  // Filter hasil berdasarkan nama atau NIS
  siswa
    .filter(s => 
      (s.nama_siswa && s.nama_siswa.toLowerCase().includes(keyword)) ||
      (s.nis && s.nis.toString().includes(keyword))
    )
    .forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.nis}</td>
        <td>${s.nama_siswa}</td>
        <td>${s.tanggal_lahir ? new Date(s.tanggal_lahir).toLocaleDateString() : '-'}</td>
        <td>${s.alamat || '-'}</td>
        <td>${s.id_kelas || '-'}</td>
        <td class="actions">
          <button class="edit-btn" onclick="editSiswa('${s.nis}')">Edit</button>
          <button class="delete-btn" onclick="deleteSiswa('${s.nis}')">Hapus</button>
        </td>
      `;
      siswaList.appendChild(row);
    });
}

// Ambil daftar kelas untuk dropdown
async function fetchKelas() {
  const response = await fetch('/api/kelas');
  const kelas = await response.json();
  const select = document.getElementById('id-kelas');
  select.innerHTML = '';

  kelas.forEach(k => {
    const option = document.createElement('option');
    option.value = k.id_kelas;
    option.textContent = k.nama_kelas;
    select.appendChild(option);
  });
}

// CREATE
async function createSiswa(data) {
  await fetch('/api/siswa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// UPDATE
async function updateSiswa(nis, data) {
  await fetch(`/api/siswa/${nis}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// DELETE
async function deleteSiswa(nis) {
  const konfirmasi = confirm(`Yakin ingin menghapus siswa dengan NIS ${nis}?`);
  if (!konfirmasi) return;

  await fetch(`/api/siswa/${nis}`, {
    method: 'DELETE'
  });

  fetchSiswa();
}

// EDIT (isi form)
async function editSiswa(nis) {
  const response = await fetch(`/api/siswa/${nis}`);
  const s = await response.json();

  if (s) {
    document.getElementById('nis').value = s.nis;
    document.getElementById('nis').disabled = true;
    document.getElementById('nama-siswa').value = s.nama_siswa;
    document.getElementById('tanggal-lahir').value = s.tanggal_lahir;
    document.getElementById('alamat').value = s.alamat;
    document.getElementById('id-kelas').value = s.id_kelas;
    document.getElementById('submit-btn').textContent = 'Update';
  }
}
