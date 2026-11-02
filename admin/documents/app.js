'use strict';
const categories = [
  {name:'Tarifs', icon:'wallet', docs:[
    {title:'Grille tarifaire générale',description:'Vue d’ensemble de toutes les prestations',pages:7,file:'tarifs-vue-ensemble.pdf'},
    {title:'Tarifs automobile & moto',description:'Shooting classique et annonces de vente',pages:4,file:'tarifs-automobile-moto.pdf'},
    {title:'Tarifs portraits',description:'Séances individuelles, duos et groupes',pages:4,file:'tarifs-portraits.pdf'},
    {title:'Tarifs produits & miniatures',description:'Photographies de produits en studio',pages:4,file:'tarifs-produits-miniatures.pdf'},
    {title:'Tarifs professionnels & métiers',description:'Photographie pour entreprises et artisans',pages:4,file:'tarifs-professionnels-metiers.pdf'}
  ]},
  {name:'Partenariats & collaborations',icon:'handshake',docs:[
    {title:'Proposition universelle — 15 %',description:'Partenariat photographique universel',pages:2,file:'partenariat-universel-15.pdf',section:'Partenariat universel'},
    {title:'Proposition Virginie — 20 %',description:'Proposition de collaboration personnalisée',pages:1,file:'proposition-virginie-20.pdf',section:'Collaborations personnalisées'}
  ]},
  {name:'Autorisations de publication',icon:'image',docs:[
    {title:'Autorisation de publication',description:'Formulaire vierge de droit à l’image',pages:1,file:'autorisation-publication.pdf'}
  ]},
  {name:'Autorisations parentales',icon:'users',docs:[
    {title:'Autorisation parentale',description:'Formulaire vierge pour shooting de mineur',pages:1,file:'autorisation-parentale.pdf'}
  ]}
];
const folderElement = document.getElementById('folders');
const docsElement = document.getElementById('documents');
const titleElement = document.getElementById('folder-title');
const searchInput = document.getElementById('search');
let active = 0;
const svgIcon = (id, size=24) => {
  const shapes = {
    wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M16 12h5M3 9h18"/>',
    handshake:'<path d="m2 9 5-5 4 2 3-1 3 2 5 5-5 6-4-2-4 2-7-6Z"/><path d="m9 14 4 3m-2-6 6 5"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m21 15-6-6L5 21"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5"/>',
    file:'<path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h5M8 13h8m-8 4h8"/>',
    eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    download:'<path d="M12 3v13m-5-5 5 5 5-5M5 17v4h14v-4"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[id]||''}</svg>`;
};
function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function renderFolders(){folderElement.replaceChildren();categories.forEach((cat,index)=>{
  const button=node('button','folder');button.type='button';button.role='tab';button.setAttribute('aria-selected',String(index===active));
  const ico=node('span','folder-icon');ico.innerHTML=svgIcon(cat.icon,26);
  button.append(ico,node('span','folder-title',cat.name),node('span','folder-count',`${cat.docs.length} PDF`));
  button.addEventListener('click',()=>{active=index;searchInput.value='';renderFolders();renderDocuments();});folderElement.append(button);
});}
function renderDocuments(){const category=categories[active];titleElement.textContent=category.name;docsElement.replaceChildren();
  const q=searchInput.value.trim().toLocaleLowerCase('fr');const docs=category.docs.filter(d=>d.title.toLocaleLowerCase('fr').includes(q)||d.description.toLocaleLowerCase('fr').includes(q));
  if(!docs.length){docsElement.append(node('div','no-results','Aucun document correspondant à votre recherche.'));return;}
  for(const d of docs){
    if(d.section)docsElement.append(node('div','section-heading',d.section));
    const item=node('article','file'),main=node('div','file-main'),icon=node('span','file-icon');icon.innerHTML=svgIcon('file',23);
    const copy=node('div','file-copy');copy.append(node('div','file-title',d.title),node('div','file-desc',`PDF · ${d.pages} ${d.pages===1?'page':'pages'} · ${d.description}`));main.append(icon,copy);
    const actions=node('div','file-actions');
    const base='/private-pdf/'+encodeURIComponent(d.file);
    const view=node('a','action');view.href=base;view.target='_blank';view.rel='noopener noreferrer';view.innerHTML=svgIcon('eye',16);view.append(document.createTextNode('Visualiser'));
    const download=node('a','action download');download.href=base+'?download=1';download.innerHTML=svgIcon('download',16);download.append(document.createTextNode('Télécharger'));
    actions.append(view,download);item.append(main,actions);docsElement.append(item);
  }
}
searchInput.addEventListener('input',renderDocuments);
document.getElementById('logout').addEventListener('click',async()=>{try{await fetch('/admin/api/logout',{method:'POST',credentials:'same-origin'});}catch(_){}window.location.replace('/admin/');});
renderFolders();renderDocuments();
