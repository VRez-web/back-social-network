import { pool } from '../db.js'
import jwt from 'jsonwebtoken'
import { registerUser, loginUser, setRefreshToken } from '../auth/queries.js'
import { SIGNATURE } from "../SIGNATURE.js";
import { generateCode } from '../utils/code.js'
import { sendMessage } from "../mailgun/index.js";

const sendCode = async (req, res) => {
  // return console.log(generateCode())
  return sendMessage();
}

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ error: 'Invalid email or password' });

    const result = await pool.query(registerUser, [email, password])

    const accessToken = jwt.sign({ userId: result.rows[0].id }, SIGNATURE, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ userId: result.rows[0].id }, SIGNATURE, { expiresIn: '14d' });

    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await pool.query(setRefreshToken, [result.rows[0].id, refreshToken, expiresAt]);

    res.status(201).send({ accessToken, refreshToken });
  } catch (e) {
    if (e.code === '23505') {
      return res.status(409).send({ error: 'User already exists' });
    }
    console.log('ERROR: ', e)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ error: 'Invalid email or password' });

    const result = await pool.query(loginUser, [email, password])

    if (!result.rows.length) {
      return res.status(400).send({ error: 'User not found' });
    }

    const accessToken = jwt.sign({ userId: result.rows[0].id }, SIGNATURE, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ userId: result.rows[0].id }, SIGNATURE, { expiresIn: '14d' });

    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await pool.query(setRefreshToken, [result.rows[0].id, refreshToken, expiresAt]);

    res.status(200).send({ accessToken, refreshToken });
  } catch (e) {
    console.log('ERROR: ', e)
  }
}

const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ error: 'Invalid email' });

    // logic for send mail with code
  } catch (e) {
    console.log('ERROR: ', e)
  }
}