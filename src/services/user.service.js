const { getPool } = require('../db/pool');
const password   = require('../lib/password');

class HttpError extends Error {
  constructor(status, code, message) {
    super(message); this.status = status; this.code = code; this.expose = true;
  }
}

exports.HttpError = HttpError;

exports.createUser = async ({ full_name, email, password: plain }) => {
  const pool = await getPool();
  const hash = await password.hash(plain);
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [full_name, email, hash]
    );
    return rows[0];
  } catch (e) {
    if (e.code === '23505') throw new HttpError(409, 'EMAIL_TAKEN', 'email already registered');
    throw e;
  }
};

exports.authenticate = async ({ email, password: plain }) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT id, email, password_hash FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  const user = rows[0];
  if (!user) throw new HttpError(401, 'INVALID_CREDENTIALS', 'invalid credentials');
  const ok = await password.verify(plain, user.password_hash);
  if (!ok)   throw new HttpError(401, 'INVALID_CREDENTIALS', 'invalid credentials');
  return { id: user.id, email: user.email };
};

exports.getProfile = async (userId) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT id, full_name, email, created_at FROM users WHERE id = $1`, [userId]);
  if (!rows[0]) throw new HttpError(404, 'NOT_FOUND', 'user not found');
  return rows[0];
};
