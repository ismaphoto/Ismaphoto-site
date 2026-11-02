'use strict';
const form = document.getElementById('login-form');
const input = document.getElementById('password');
const submit = document.getElementById('submit');
const feedback = document.getElementById('feedback');
document.getElementById('reveal').addEventListener('click', () => {
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  document.getElementById('reveal').setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  feedback.textContent = '';
  submit.disabled = true;
  try {
    const response = await fetch('/admin/api/login', {
      method:'POST', credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({password:input.value})
    });
    const data = await response.json();
    if (!response.ok || !data.ok) { feedback.textContent = data.message || 'Connexion impossible.'; return; }
    input.value = '';
    window.location.assign('/admin/documents/');
  } catch (_) { feedback.textContent = 'Connexion indisponible. Vérifiez votre connexion internet.'; }
  finally { submit.disabled = false; }
});
(async () => {
  try {
    const response = await fetch('/admin/api/session', {cache:'no-store',credentials:'same-origin'});
    if (response.ok && (await response.json()).authenticated) window.location.replace('/admin/documents/');
  } catch (_) { /* formulaire toujours utilisable */ }
})();
