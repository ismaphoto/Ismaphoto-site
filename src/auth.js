// ISMAphoto_03 — serveur Cloudflare Pages uniquement.
// Ne jamais inscrire un mot de passe dans ce dépôt GitHub.
const COOKIE_NAME = 'isma03_session';
const SESSION_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();

function toB64Url(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function fromB64Url(raw) {
  if (!/^[A-Za-z0-9_-]+$/.test(raw)) throw new Error('Format incorrect');
  const base = raw.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base + '='.repeat((4 - base.length % 4) % 4));
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
async function keyFromSecret(secret) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign','verify']);
}
export function configured(env) {
  return typeof env.ADMIN_PASSWORD === 'string' && env.ADMIN_PASSWORD.length >= 12 &&
    typeof env.SESSION_SECRET === 'string' && env.SESSION_SECRET.length >= 32;
}
export async function passwordMatches(submitted, expected) {
  if (typeof submitted !== 'string' || submitted.length < 1 || submitted.length > 256 || typeof expected !== 'string') return false;
  const [a,b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(submitted)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const left = new Uint8Array(a), right = new Uint8Array(b);
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) mismatch |= (left[i] ^ right[i]);
  return mismatch === 0;
}
export async function createSession(secret) {
  const payload = `v1:${Math.floor(Date.now()/1000) + SESSION_SECONDS}`;
  const key = await keyFromSecret(secret);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return `${toB64Url(encoder.encode(payload))}.${toB64Url(new Uint8Array(mac))}`;
}
export function cookieWithSession(value) {
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}
export function deletedSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
export async function isAuthenticated(request, env) {
  if (!configured(env)) return false;
  const cookieHeader = request.headers.get('Cookie') || '';
  const raw = cookieHeader.split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE_NAME + '='));
  if (!raw) return false;
  const token = raw.slice(COOKIE_NAME.length + 1);
  const parts = token.split('.');
  if (parts.length !== 2 || parts[0].length > 90 || parts[1].length > 90) return false;
  try {
    const payloadBytes = fromB64Url(parts[0]);
    const payload = new TextDecoder().decode(payloadBytes);
    const match = /^v1:(\d{10})$/.exec(payload);
    if (!match) return false;
    const expiry = Number(match[1]);
    const now = Math.floor(Date.now()/1000);
    if (expiry <= now || expiry > now + SESSION_SECONDS) return false;
    const key = await keyFromSecret(env.SESSION_SECRET);
    return crypto.subtle.verify('HMAC', key, fromB64Url(parts[1]), payloadBytes);
  } catch (_) { return false; }
}
export function noStore(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control','private, no-store, max-age=0');
  headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('Referrer-Policy','no-referrer');
  // Important : conserver le corps et le statut émis par Pages.
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
export function json(data, status=200, extra={}) {
  return new Response(JSON.stringify(data), { status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra} });
}
