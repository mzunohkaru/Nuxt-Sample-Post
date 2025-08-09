const express = require('express')
const { getDB, requireAuth } = require('./utils')

const router = express.Router()

// PUT /api/account
router.put('/', requireAuth, async (req, res) => {
  try {
    const { username, email } = req.body
    if (!username || !email) {
      return res.status(400).json({ success: false, message: 'ユーザー名とメールアドレスは必須です' })
    }

    const db = getDB()
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, username, email',
      [username, email, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'ユーザーが見つかりませんでした' })
    }

    res.json({ success: true, user: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') { // Unique violation
        return res.status(409).json({ success: false, message: 'このユーザー名またはメールアドレスは既に使用されています' })
    }
    console.error('Error updating user:', error)
    res.status(500).json({ success: false, message: 'ユーザー情報の更新中にエラーが発生しました' })
  }
})

module.exports = router
