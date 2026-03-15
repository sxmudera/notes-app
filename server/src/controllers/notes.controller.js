const service = require('../services/notes.service');

const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({ success: false, message: 'Judul dan isi wajib diisi' });
    }
    const data = await service.create(judul, isi);
    res.status(201).json({ success: true, message: 'Catatan berhasil ditambahkan', data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({ success: false, message: 'Judul dan isi wajib diisi' });
    }
    const data = await service.update(req.params.id, judul, isi);
    if (!data) return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan' });
    res.json({ success: true, message: 'Catatan berhasil diperbarui', data });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan' });
    res.json({ success: true, message: 'Catatan berhasil dihapus' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
