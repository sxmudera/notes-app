const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM catatan ORDER BY tanggal_dibuat DESC');
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM catatan WHERE id = ?', [id]);
  return rows[0];
};

const create = async (judul, isi) => {
  const [result] = await pool.query(
    'INSERT INTO catatan (judul, isi) VALUES (?, ?)',
    [judul, isi]
  );
  return getById(result.insertId);
};

const update = async (id, judul, isi) => {
  const [result] = await pool.query(
    'UPDATE catatan SET judul = ?, isi = ? WHERE id = ?',
    [judul, isi, id]
  );
  if (result.affectedRows === 0) return null;
  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM catatan WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
