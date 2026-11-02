import { deletedSessionCookie, json } from '../../../src/auth.js';
export function onRequestPost() { return json({ok:true},200,{'Set-Cookie':deletedSessionCookie()}); }
