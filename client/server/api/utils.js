const { Pool } = require('pg')
const jwt = require('jsonwebtoken')
const { createHash, timingSafeEqual } = require('crypto')

let pool = null

function getDB() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/bulletin_board"
    pool = new Pool({
      connectionString: databaseUrl,
    })
  }
  return pool
}

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex')
}

function verifyPassword(password, hashedPassword) {
  const verifyHash = createHash('sha256').update(password).digest('hex')
  return timingSafeEqual(
    Buffer.from(hashedPassword, 'hex'),
    Buffer.from(verifyHash, 'hex')
  )
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret-for-dev'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-for-dev'

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
  } catch (error) {
    return null
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET)
  } catch (error) {
    return null
  }
}

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '認証トークンが必要です' })
  }

  const token = authHeader.substring(7)
  const payload = verifyAccessToken(token)

  if (!payload) {
    return res.status(401).json({ message: '無効または期限切れの認証トークンです' })
  }

  try {
    const db = getDB()
    const userResult = await db.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [payload.userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'ユーザーが見つかりません' })
    }

    req.user = userResult.rows[0]
    next()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  getDB,
  requireAuth,
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
