const express = require('express')
const { getDB, requireAuth } = require('./utils')

const router = express.Router()

// GET /api/posts
router.get('/', requireAuth, async (req, res) => {
  try {
    const db = getDB()
    const result = await db.query(
      'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ success: false, message: '投稿の取得に失敗しました' })
  }
})

// POST /api/posts
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'タイトルと内容は必須です' })
    }

    const db = getDB()
    const result = await db.query(
      'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, req.user.id]
    )

    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ success: false, message: '投稿の作成に失敗しました' })
  }
})

module.exports = router
