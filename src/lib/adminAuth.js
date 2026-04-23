import { createHash } from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '123qweQWE!';
const SALT = process.env.ADMIN_TOKEN_SALT ?? 'numeros-admin-salt-v1';
export const COOKIE_NAME = 'numeros_admin';
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

/** Canonical token derived from password — stored in the cookie. */
export function buildToken(password) {
  return createHash('sha256').update(password + SALT).digest('hex');
}

export function expectedToken() {
  return buildToken(ADMIN_PASSWORD);
}

export function verifyToken(token) {
  return typeof token === 'string' && token === expectedToken();
}

export function checkPassword(password) {
  return typeof password === 'string' && password === ADMIN_PASSWORD;
}
