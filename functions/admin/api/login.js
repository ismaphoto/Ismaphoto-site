import { configured, passwordMatches, createSession, cookieWithSession, json } from '../../../src/auth.js';

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ok:false,message:'Configuration manquante dans Cloudflare. Vérifiez les deux secrets.'},503);
  if (!/^application\/json\b/i.test(request.headers.get('Content-Type')||'')) return json({ok:false,message:'Format de requête incorrect.'},415);
  const length = Number(request.headers.get('Content-Length') || '0');
  if (length > 2048) return json({ok:false,message:'Requête trop volumineuse.'},413);
  let body;
  try { const text = await request.text(); if(text.length>2048) return json({ok:false,message:'Requête trop volumineuse.'},413); body=JSON.parse(text); }
  catch (_) { return json({ok:false,message:'Requête invalide.'},400); }
  if (!(await passwordMatches(body?.password, env.ADMIN_PASSWORD))) {
    return json({ok:false,message:'Mot de passe incorrect.'},401);
  }
  const session = await createSession(env.SESSION_SECRET);
  return json({ok:true},200,{'Set-Cookie':cookieWithSession(session)});
}
