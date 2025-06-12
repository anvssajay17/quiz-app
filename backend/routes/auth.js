// routes/auth.js
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router()

// REGISTER USER
router.post('/register', async (req, res) => {
    const { email, password } = req.body

    try {
        const hashedPassword = bcrypt.hashSync(password, 8)

        // check if email already exists
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email])
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Email already registered' })
        }

        // insert new user
        const [result] = await db.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        )

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })

    } catch (err) {
        console.error(err.message)
        res.sendStatus(503)
    }
})

// LOGIN USER
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )

        const user = rows[0]
        if (!user) return res.status(404).json({ message: "User not found" })

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) return res.status(401).json({ message: "Invalid password" })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })

    } catch (err) {
        console.error(err.message)
        res.sendStatus(503)
    }
})

export default router
