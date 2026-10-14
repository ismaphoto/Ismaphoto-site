ISMAphoto_03 — PREMIÈRE VERSION DU SITE (gratuit)

CE QUI FONCTIONNE :
- 6 pages HTML : Accueil, Portfolio, Prestations, Tarifs, À propos, Contact.
- Navigation mobile, filtres de portfolio, liens WhatsApp, Instagram et e-mail.
- Site statique sans base de données, abonnement, paiement ou API payante.

IMPORTANT : IMAGES
- Les images actuelles sont des illustrations SVG provisoires, PAS les photos du photographe.
- Pour intégrer vos photos : mettez vos images JPG compressées dans assets/ puis, dans assets/style.css, remplacez url('hero.svg') par url('votre-photo.jpg') pour l'accueil, et les images des trois univers de la même façon.
- Faites attention à utiliser vos propres photos et à conserver leur qualité tout en compressant leurs fichiers.
- Les polices Google sont optionnelles; le site reste utilisable sans elles. Pour aucun service externe, supprimez la ligne @import dans assets/style.css.

PDF TARIFAIRE
- Non inclus à ce stade, conformément à votre demande. L'original sera placé dans documents/ puis un vrai lien de consultation et téléchargement sera ajouté à tarifs.html. Ne pas considérer la mention actuelle « PDF à venir » comme un téléchargement.

MISE EN LIGNE GRATUITE :
1. Ouvrez https://dash.cloudflare.com/ (compte gratuit, offre Free).
2. Choisissez Workers & Pages > Create application > Pages > Drag and drop (les libellés peuvent évoluer).
3. Envoyez le fichier ZIP fourni, ou le contenu de ce dossier.
4. Choisissez un nom de projet, puis publiez. Votre site aura une adresse gratuite *.pages.dev.
5. Aucun achat de domaine n'est nécessaire. Vérifiez que vous sélectionnez bien le plan Free.

ATTENTION :
- Ceci est un prototype prêt à tester techniquement, pas une version commerciale finale : remplacer les illustrations avant de le promouvoir.
- Les fonctionnalités gratuites et les limites sont celles de Cloudflare Pages, susceptibles d'évoluer.
- L'option Direct Upload n'autorise pas le passage à Git Integration au sein du même projet.
