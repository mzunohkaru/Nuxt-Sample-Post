const express = require('express')
const {
  getDB,
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  requireAuth,
} = require('./utils')

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'ユーザー名、メールアドレス、パスワードは必須です' })
    }
    // Add more validation as needed...

    const db = getDB()
    const existingUser = await db.query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email])
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'そのユーザー名またはメールアドレスは既に使用されています' })
    }

    const hashedPassword = hashPassword(password)
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    )
    const newUser = result.rows[0]

    // For registration, you might want to log the user in directly
    const accessToken = generateAccessToken(newUser)
    const refreshToken = generateRefreshToken(newUser)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    })

    res.status(201).json({
        success: true,
        user: newUser,
        accessToken,
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'ユーザー登録中にエラーが発生しました' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'ユーザー名とパスワードが必要です' })
    }

    const db = getDB()
    const userResult = await db.query('SELECT id, username, email, password_hash FROM users WHERE username = $1 OR email = $1', [username])
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'ユーザー名またはパスワードが間違っています' })
    }

    const user = userResult.rows[0]
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ message: 'ユーザー名またはパスワードが間違っています' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({
      success: true,
      data: {
        user: { id: user.id, username: user.username, email: user.email },
        accessToken,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'サーバーエラーが発生しました' })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })
  res.json({ success: true, message: 'ログアウトしました' })
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, data: { user: req.user } })
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(401).json({ message: 'リフレッシュトークンが見つかりません' })
    }

    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
        return res.status(401).json({ message: '無効なリフレッシュトークンです' })
    }

    try {
        const db = getDB()
        const userResult = await db.query('SELECT id, username, email FROM users WHERE id = $1', [payload.userId])
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'ユーザーが見つかりません' })
        }
        const user = userResult.rows[0]
        const newAccessToken = generateAccessToken(user)
        res.json({ success: true, accessToken: newAccessToken })
    } catch(error) {
        res.status(500).json({ message: 'サーバーエラーが発生しました' })
    }
})

module.exports = router
