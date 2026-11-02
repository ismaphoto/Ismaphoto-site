import { isAuthenticated, noStore } from '../src/auth.js';

const downloads = {
  'tarifs-vue-ensemble.pdf': 'ISMAphoto03 - Grille tarifaire generale.pdf',
  'tarifs-automobile-moto.pdf': 'ISMAphoto03 - Tarifs automobile et moto.pdf',
  'tarifs-portraits.pdf': 'ISMAphoto03 - Tarifs portraits.pdf',
  'tarifs-produits-miniatures.pdf': 'ISMAphoto03 - Tarifs produits et miniatures.pdf',
  'tarifs-professionnels-metiers.pdf': 'ISMAphoto03 - Tarifs professionnels et metiers.pdf',
  'partenariat-universel-15.pdf': 'ISMAphoto03 - Partenariat universel 15 pourcent.pdf',
  'proposition-virginie-20.pdf': 'ISMAphoto03 - Proposition Virginie 20 pourcent.pdf',
  'autorisation-publication.pdf': 'ISMAphoto03 - Autorisation de publication.pdf',
  'autorisation-parentale.pdf': 'ISMAphoto03 - Autorisation parentale.pdf',
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  if (path.startsWith('/src/')) return new Response('Introuvable', {status:404,headers:{'Cache-Control':'no-store'}});
  const privatePdf = path.startsWith('/private-pdf/');
  const privateApp = path === '/admin/documents' || path.startsWith('/admin/documents/');
  const privateApi = path.startsWith('/admin/api/') && !['/admin/api/login'].includes(path);

  if (privatePdf || privateApp || privateApi) {
    const valid = await isAuthenticated(context.request, context.env);
    if (!valid) {
      if (privatePdf || privateApi) {
        return new Response('Accès non autorisé', {status:401, headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex','Content-Type':'text/plain; charset=utf-8'}});
      }
      return Response.redirect(url.origin + '/admin/', 302);
    }
  }

  // Les assets restent des fichiers de Pages; cette fonction protège leur URL avant livraison.
  const response = await context.next();
  if (privatePdf) {
    const fileName = path.split('/').pop();
    if (!Object.prototype.hasOwnProperty.call(downloads, fileName)) {
      return new Response('Document introuvable', { status:404, headers:{'Cache-Control':'no-store'} });
    }
    const headers = new Headers(response.headers);
    headers.set('Content-Type', 'application/pdf');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Cache-Control', 'private, no-store, max-age=0');
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    headers.set('Content-Disposition', `${url.searchParams.get('download')==='1' ? 'attachment' : 'inline'}; filename="${downloads[fileName]}"`);
    return new Response(response.body, {status:response.status,headers});
  }
  return (privateApp || privateApi) ? noStore(response) : response;
}
