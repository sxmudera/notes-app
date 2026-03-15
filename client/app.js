const API_BASE = 'http://localhost:3000/api';

let notes = [];
let currentNoteId = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', fetchNotes);

async function fetchNotes() {
  try {
    const res = await fetch(`${API_BASE}/catatan`);
    const json = await res.json();
    notes = json.data || [];
    renderNotesList();
  } catch (err) {
    alert('Gagal memuat catatan. Pastikan server berjalan.');
  }
}

function renderNotesList() {
  const container = document.getElementById('notesGrid');

  if (notes.length === 0) {
    container.innerHTML = '<p class="empty">Belum ada catatan.</p>';
    return;
  }

  container.innerHTML = notes.map(note => `
    <div class="card">
      <h3>${escapeHtml(note.judul)}</h3>
      <p>${escapeHtml(note.isi)}</p>
      <span class="card-date">${formatDate(note.tanggal_dibuat)}</span>
      <div class="card-actions">
        <button class="btn-edit" onclick="openEditModal(${note.id})">Edit</button>
        <button class="btn-hapus" onclick="deleteNote(${note.id})">Hapus</button>
      </div>
    </div>
  `).join('');
}

function openModal() {
  isEditMode = false;
  currentNoteId = null;
  document.getElementById('modalTitle').textContent = 'Tambah Catatan';
  document.getElementById('inputJudul').value = '';
  document.getElementById('inputIsi').value = '';
  document.getElementById('modalOverlay').style.display = 'flex';
  document.getElementById('inputJudul').focus();
}

function openEditModal(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;

  isEditMode = true;
  currentNoteId = id;
  document.getElementById('modalTitle').textContent = 'Edit Catatan';
  document.getElementById('inputJudul').value = note.judul;
  document.getElementById('inputIsi').value = note.isi;
  document.getElementById('modalOverlay').style.display = 'flex';
  document.getElementById('inputJudul').focus();
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

window.addEventListener('load', () => {
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

async function saveNote() {
  const judul = document.getElementById('inputJudul').value.trim();
  const isi = document.getElementById('inputIsi').value.trim();

  if (!judul || !isi) {
    alert('Judul dan isi tidak boleh kosong!');
    return;
  }

  try {
    let res, json;

    if (isEditMode && currentNoteId) {
      res = await fetch(`${API_BASE}/catatan/${currentNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, isi }),
      });
    } else {
      res = await fetch(`${API_BASE}/catatan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, isi }),
      });
    }

    json = await res.json();

    if (json.success) {
      closeModal();
      await fetchNotes();
    } else {
      alert(json.message);
    }
  } catch (err) {
    alert('Gagal menyimpan catatan. Periksa koneksi ke server.');
  }
}

async function deleteNote(id) {
  if (!confirm('Yakin ingin menghapus catatan ini?')) return;

  try {
    const res = await fetch(`${API_BASE}/catatan/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();

    if (json.success) {
      await fetchNotes();
    } else {
      alert(json.message);
    }
  } catch (err) {
    alert('Gagal menghapus catatan. Periksa koneksi ke server.');
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
