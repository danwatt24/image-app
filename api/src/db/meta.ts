import * as tables from './tables';
import * as db from './database';

function insert(metadata: tables.DbImage) {
  const params = Object.values(metadata) as string[];
  const query = `INSERT INTO images (uuid, fileName, image, thumb, author, quote) VALUES (?, ?, ?, ?, ?, ?)`;
  return db.Insert(query, params);
}

function get(id:number) {
  const query = `SELECT * FROM images WHERE id = ?`;
  return db.SelectOne<tables.DbImage>(query, [id]);
}

function getByUUID(uuid: string) {
  const query = `SELECT * FROM images WHERE uuid = ?`;
  return db.SelectOne<tables.DbImage>(query, [uuid]);
}

function listAll() {
  const query = `SELECT * FROM images`;
  return db.SelectMany<tables.DbImage>(query);
}

function remove(id:number) {
  const query = `DELETE FROM images WHERE id=?`;
  return db.Delete(query, [id]);
}

function update(id: number, author: string, quote: string) {
  const query = `UPDATE images SET author=?, quote=? WHERE id=?`;
  return db.Update(query, [author, quote, id]);
}

export default {
  insert,
  get,
  getByUUID,
  listAll,
  remove,
  update
};