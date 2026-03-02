const { pool } = require("../database")

async function createUser(email, hashedPassword) {
  const res = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [email, hashedPassword]
  )
  return res.rows[0]
}

async function findByEmail(email) {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email])
  return res.rows[0]
}

async function findById(id) {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id])
  return res.rows[0]
}

module.exports = {
  createUser,
  findByEmail,
  findById,
}
