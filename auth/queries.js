export const registerUser = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id'
export const loginUser = 'SELECT * FROM users WHERE email = $1 AND password = $2';
export const setRefreshToken = 'INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)';