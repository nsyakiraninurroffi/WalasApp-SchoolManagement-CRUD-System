// Cek login
if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = '/login.html';
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  fetchGuru();

  const form = document.getElementById('guru-form');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idGuru = document.getElementById('id-guru').value;
    const namaGuru = document.getElementById('nama-guru').value;
    const kontak = document.getElementById('kontak').value;
    const alamat = document.getElementById('alamat').value;

    const data = {
      nama_guru: namaGuru,
      kontak,
      alamat
    };

    if (submitBtn.textContent === 'Tambah') {
      await createGuru(data);
    } else {
      await updateGuru(idGuru, data);
      submitBtn.textContent = 'Tambah';
      document.getElementById('id-guru').value = '';
    }

    form.reset();
    fetchGuru();
  });

  // Aktifkan filter/search realtime
  const searchInput = document.getElementById('search-guru');
  if (searchInput) {
    searchInput.addEventListener('input', fetchGuru);
  }
});

// === CRUD Functions ===

async function fetchGuru() {
  try {
    const res = await fetch('/api/guru');
    const data = await res.json();
    console.log("Data guru dari server:", data);

    const list = document.getElementById('guru-list');
    list.innerHTML = '';

    // Ambil keyword search
    const searchInput = document.getElementById('search-guru');
    const keyword = searchInput ? searchInput.value.toLowerCase() : "";

    // Filter hasil berdasarkan nama atau ID
    data
      .filter(g =>
        (g.nama_guru && g.nama_guru.toLowerCase().includes(keyword)) ||
        (g.id_guru && g.id_guru.toString().includes(keyword))
      )
      .forEach(g => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${g.id_guru}</td>
          <td>${g.nama_guru}</td>
          <td>${g.kontak || '-'}</td>
          <td>${g.alamat || '-'}</td>
          <td>
            <button onclick="editGuru(${g.id_guru})">Edit</button>
            <button onclick="deleteGuru(${g.id_guru})">Hapus</button>
          </td>
        `;
        list.appendChild(row);
      });
  } catch (err) {
    console.error("Error fetchGuru:", err);
  }
}

async function createGuru(data) {
  await fetch('/api/guru', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function updateGuru(id, data) {
  await fetch(`/api/guru/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function deleteGuru(id) {
  const konfirmasi = confirm(`Yakin ingin menghapus guru dengan ID ${id}?`);
  if (!konfirmasi) return;

  await fetch(`/api/guru/${id}`, { method: 'DELETE' });
  fetchGuru();
}

async function editGuru(id) {
  const res = await fetch(`/api/guru/${id}`);
  const g = await res.json();

  if (g) {
    document.getElementById('id-guru').value = g.id_guru;
    document.getElementById('nama-guru').value = g.nama_guru;
    document.getElementById('kontak').value = g.kontak;
    document.getElementById('alamat').value = g.alamat;
    document.getElementById('submit-btn').textContent = 'Update';
  }
}
