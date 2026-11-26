// Articles français, vague 2 (novembre 2026). Écrits directement en français pour
// des recherches françaises, pas traduits de l'anglais. Les règles du mariage
// civil viennent de la fiche Service Public F930 (vérifiée le 28 octobre 2026) ;
// les prix FOLDÈ et le contenu du formulaire RSVP ont été relevés sur
// folde-wedding.com le 26 novembre 2026. Les prénoms des exemples sont fictifs.

import { pagePath } from "@/lib/routes.mjs";

const landing = pagePath("fr", "landing");
const tarifs = pagePath("fr", "packages");
const modeles = pagePath("fr", "collections");
const IMG = "/images/blog/folde-2026-11";
const portrait = (file) => ({ src: `${IMG}/${file}.webp`, width: 520, height: 1126, portrait: true });

export const authorFr = { name: "Équipe éditoriale FOLDÈ", role: "Design de faire-part et expérience invités", href: "/fr/notre-methode", type: "Organization" };

const servicePublic = { label: "Service Public — Mariage en France (fiche F930, vérifiée le 28 octobre 2026)", href: "https://www.service-public.fr/particuliers/vosdroits/F930", note: "Lieu du mariage, publication des bans pendant 10 jours, salle ouverte au public, livret de famille, interdiction du mariage religieux avant le mariage civil." };
const mariagesNetEnvoi = { label: "Mariages.net — Quand envoyer vos faire-part de mariage", href: "https://www.mariages.net/articles/quand-envoyer-vos-faire-part-de-mariage--c2407", note: "Envoi du faire-part quatre à six mois avant, date limite de réponse environ deux mois avant pour le plan de table." };
const mariagesNetCoupon = { label: "Mariages.net — Le coupon-réponse du faire-part", href: "https://www.mariages.net/articles/le-coupon-reponse-du-faire-part--c3577", note: "Rôle du coupon-réponse et informations à demander aux invités." };
const withjoy = { label: "Withjoy — Qu’est-ce qu’une date limite de réponse ?", href: "https://withjoy.com/glossary/what-is-rsvp-deadline/?l=fr-FR", note: "Date limite la plus courante trois à quatre semaines avant le mariage, rappel une semaine avant la clôture." };
const laPoste = { label: "La Poste — Tarifs courrier au 1er janvier 2027 (communiqué)", href: "https://www.caissedesdepots.fr/sites/ms-cdc-fr/files/2026-07/CP_La_Poste_tarifs_au_010127.pdf", note: "Lettre verte de 20 g : 1,52 € en 2026, 1,67 € à partir du 1er janvier 2027." };
const laPosteTarif = { label: "La Poste — Tarif Lettre verte", href: "https://www.laposte.fr/tarif-lettre-verte", note: "Grille officielle par tranche de poids." };
const bridebookChampetre = { label: "Bridebook — Idées originales pour réussir un mariage champêtre", href: "https://bridebook.com/fr/article/idees-originales-pour-reussir-un-mariage-champetre", note: "Matières naturelles (kraft, papier recyclé), illustrations florales, palette douce." };
const mariagesNetChampetre = { label: "Mariages.net — 30 faire-part champêtres pour surprendre vos invités", href: "https://www.mariages.net/articles/30-faire-part-champetres-pour-surprendre-vos-invites--c6263", note: "Exemples de faire-part champêtres : kraft, bois, fleurs séchées, ficelle." };
const productCheck = (what) => `<p>Les informations sur FOLDÈ (prix, sections du faire-part, questions du formulaire RSVP) ont été relevées sur folde-wedding.com le <strong>26 novembre 2026</strong>${what ? `, en ouvrant ${what}` : ""}. Les exemples de textes sont originaux et les prénoms inventés. Nous mettons l’article à jour quand une règle ou un prix change.</p>`;

export const originalPostsFrWave2 = [
  // 1. Mariage civil / mairie
  {
    slug: "faire-part-mariage-civil",
    keyword: "faire-part mariage civil",
    title: "Faire-part de mariage civil : 16 textes pour la mairie, et ce qu’il faut savoir avant d’écrire",
    metaTitle: "Faire-part mariage civil : 16 textes pour la mairie",
    description: "Mariage à la mairie seul ou avant une cérémonie laïque ou religieuse : ce que doit dire le faire-part, les règles à connaître et 16 textes prêts à adapter.",
    heroImage: "/images/blog/pexels/29821867.jpg",
    imageAlt: "Faire-part de mariage posé sur un tissu blanc",
    datePublished: "2026-11-26",
    readingTime: 8,
    author: authorFr,
    quickAnswer: "Un faire-part de mariage civil indique vos prénoms, la mairie (nom de la commune et adresse), la date et l’heure de la cérémonie, puis ce qui suit : vin d’honneur, repas ou cérémonie laïque, chacun avec son adresse. En France, la cérémonie civile est publique et précède obligatoirement tout mariage religieux, donc dites clairement à vos invités à quels moments ils sont attendus.",
    ctaAfter: 2,
    sections: [
      {
        heading: "Trois situations, trois façons d’écrire",
        body: "<p>Avant de choisir une formule, identifiez votre cas. Le texte en découle presque tout seul.</p>",
        table: {
          caption: "Quel faire-part pour un mariage civil ?",
          head: ["Situation", "Qui est invité à la mairie", "Ce que le texte doit préciser", "Textes"],
          rows: [
            ["Mairie, puis fête le même jour", "Tous les invités, ou presque", "L’heure de la mairie et l’adresse de la réception", "1 à 6"],
            ["Mairie en petit comité, grande fête plus tard", "Les témoins et la famille proche", "Que la fête a lieu un autre jour, avec sa date", "7 à 11"],
            ["Mairie, puis cérémonie laïque ou religieuse", "Souvent tout le monde, aux deux", "L’ordre et l’heure des deux cérémonies", "12 à 16"],
          ],
        },
      },
      {
        heading: "Ce que la loi impose, et ce que ça change pour le faire-part",
        body: "<p>Quelques règles du mariage civil ont une conséquence directe sur ce que vous écrivez. Elles viennent de la fiche officielle Service Public sur le mariage en France.</p><ul><li><strong>Le lieu</strong> : le mariage est célébré dans une commune avec laquelle l’un de vous deux a un lien durable (votre domicile ou votre résidence, ou celui d’un de vos parents). Écrivez donc « Mairie de Saint-Rémy », pas seulement « la mairie ».</li><li><strong>La salle</strong> : la célébration a lieu à la mairie, dans une salle ouverte au public. Le maire peut aussi choisir un autre bâtiment communal, comme une salle des fêtes : si c’est votre cas, donnez l’adresse exacte de ce bâtiment.</li><li><strong>Les bans</strong> : ils sont affichés dix jours à la porte de la mairie, et le mariage ne peut pas avoir lieu avant le dixième jour qui suit. Ne fixez donc pas la date du faire-part avant d’avoir validé la vôtre avec la mairie.</li><li><strong>L’ordre des cérémonies</strong> : il est interdit de célébrer un mariage religieux avant le mariage civil. Si vous avez les deux le même jour, la mairie vient toujours en premier sur le faire-part.</li><li><strong>Les témoins</strong> : il en faut au moins deux et au plus quatre (article 75 du Code civil). Ils devront présenter l’original de leur pièce d’identité le jour J ; inutile de l’écrire sur le faire-part, mais prévenez-les.</li></ul>",
        figure: { ...portrait("venue-and-directions-mobile"), alt: "Section lieu d’un faire-part numérique avec une carte et un bouton itinéraire", caption: "Une carte avec itinéraire évite aux invités de chercher la bonne entrée de la mairie (faire-part FOLDÈ, interface en anglais, novembre 2026)." },
      },
      {
        heading: "Mairie puis fête le même jour : 6 textes",
        body: "<blockquote>1. Claire Martin et Thomas Lefèvre ont la joie de vous annoncer leur mariage, qui sera célébré le samedi 12 juin 2027 à 15 heures à la mairie de Saint-Rémy-de-Provence, place Jules-Pélissier. La fête continuera au Mas des Oliviers.</blockquote><blockquote>2. On se marie à la mairie de Saint-Rémy le 12 juin 2027 à 15 h. Ensuite, direction le Mas des Oliviers pour le vin d’honneur, le dîner et la piste de danse.</blockquote><blockquote>3. Monsieur et Madame Martin, Monsieur et Madame Lefèvre sont heureux de vous faire part du mariage de leurs enfants Claire et Thomas. La cérémonie civile sera célébrée le samedi 12 juin 2027 à 15 heures, en la mairie de Saint-Rémy-de-Provence.</blockquote><blockquote>4. Un oui à la mairie, un verre au soleil, une longue soirée entre amis. Claire et Thomas, 12 juin 2027, Saint-Rémy-de-Provence.</blockquote><blockquote>5. La cérémonie à la mairie dure une vingtaine de minutes et commence à l’heure : merci d’arriver vers 14 h 45.</blockquote><blockquote>6. Pas de cérémonie religieuse, pas de discours interminable : juste notre oui à la mairie, puis la fête. On compte sur vous.</blockquote><p>Le texte 5 n’est pas une annonce mais une mention pratique à ajouter à n’importe lequel des autres : les mariages en mairie s’enchaînent souvent le samedi, et un retard se voit tout de suite.</p>",
      },
      {
        heading: "Mairie en petit comité, grande fête plus tard : 5 textes",
        body: "<p>De plus en plus de couples se marient à la mairie avec leurs témoins et leurs parents, puis organisent la fête des semaines ou des mois après. Le piège : que les invités croient avoir manqué la cérémonie. Dites-le simplement.</p><blockquote>7. Ça y est, on s’est dit oui à la mairie, en tout petit comité. Maintenant, on veut fêter ça avec vous : rendez-vous le samedi 4 septembre 2027 au Domaine des Tilleuls.</blockquote><blockquote>8. Claire et Thomas se sont mariés le 14 mai 2027 à la mairie de Lyon 6e. Ils seraient très heureux de célébrer leur union avec vous le 4 septembre 2027.</blockquote><blockquote>9. Le oui officiel, c’était à deux (et quatre témoins). La fête, c’est avec vous.</blockquote><blockquote>10. Mariés depuis le printemps, nous vous invitons à une grande fête de mariage le 4 septembre 2027, avec dîner, musique et brunch le lendemain.</blockquote><blockquote>11. Pour la mairie, nous avons choisi l’intimité. Pour la fête, nous vous voulons tous : samedi 4 septembre 2027, Domaine des Tilleuls.</blockquote>",
      },
      {
        heading: "Mairie puis cérémonie laïque ou religieuse : 5 textes",
        body: "<p>Quand les deux cérémonies ont lieu le même jour, donnez les deux heures et les deux adresses, dans l’ordre. Si tout le monde n’est pas convié à la mairie, précisez-le dans le message qui accompagne l’envoi plutôt que sur le faire-part lui-même.</p><blockquote>12. Claire et Thomas se marieront civilement le samedi 12 juin 2027 à 11 heures à la mairie de Beaune. La cérémonie religieuse sera célébrée à 15 heures en l’église Notre-Dame.</blockquote><blockquote>13. 11 h : mairie de Beaune. 15 h : cérémonie laïque dans le parc du Château de Savigny. Ensuite : vin d’honneur, dîner et soirée.</blockquote><blockquote>14. Le matin, la mairie pour le côté officiel ; l’après-midi, une cérémonie laïque écrite par nos amis. Venez aux deux si vous le pouvez.</blockquote><blockquote>15. Après leur mariage civil à la mairie de Beaune, Claire et Thomas recevront la bénédiction nuptiale le samedi 12 juin 2027 à 15 heures.</blockquote><blockquote>16. Deux cérémonies, une seule journée, et surtout une grande fête le soir. Programme complet et plan d’accès sur notre faire-part en ligne.</blockquote>",
        figure: { ...portrait("digital-invitation-map-and-timeline-mobile"), alt: "Programme de la journée sur un faire-part numérique, avec les horaires de chaque moment", caption: "Le programme permet d’afficher la mairie, la cérémonie et la réception dans l’ordre, chacune avec son heure (FOLDÈ, novembre 2026)." },
      },
      {
        heading: "Les erreurs qui font arriver les invités au mauvais endroit",
        body: "<ul><li><strong>Écrire « la mairie » sans la commune</strong> : dans les grandes villes, il y a souvent plusieurs mairies d’arrondissement.</li><li><strong>Oublier l’heure exacte</strong> : les créneaux de mairie sont courts. Une heure approximative (« en début d’après-midi ») ne suffit pas.</li><li><strong>Ne pas dire si la mairie est ouverte à tous</strong> : la cérémonie est publique, mais la salle est parfois petite. Si vous préférez que seuls les proches viennent, dites-le dans le message d’envoi.</li><li><strong>Mélanger les adresses</strong> : la mairie et la réception sont rarement au même endroit. Une adresse par moment, avec un lien vers l’itinéraire si possible.</li><li><strong>Envoyer trop tôt</strong> : tant que la mairie n’a pas validé la date, ne lancez pas l’impression ni l’envoi.</li></ul>",
      },
      {
        heading: "Un faire-part de mariage civil en version numérique",
        body: "<p>Un mariage civil a souvent plusieurs moments et plusieurs adresses, ce qui charge vite un carton papier. Sur un <a href=\"" + landing + "\">faire-part numérique</a>, l’annonce reste courte et chaque information a sa place : programme horaire, carte avec itinéraire pour la mairie et pour la réception, formulaire de réponse. Si la mairie décale votre créneau d’une heure, vous corrigez le faire-part et tous les invités voient la nouvelle heure avec le même lien. Les designs sobres comme Pearl ou Editorial conviennent bien à un mariage en mairie ; vous pouvez tous les essayer gratuitement avec vos prénoms depuis la page <a href=\"" + modeles + "\">modèles</a>.</p>",
        figure: { ...portrait("pearl-design-opening-mobile"), alt: "Design de faire-part numérique Pearl avec une terrasse peinte et vue sur la mer", caption: "Pearl, un design FOLDÈ sobre, adapté à un mariage civil (novembre 2026)." },
      },
    ],
    faqs: [
      ["Faut-il envoyer un faire-part pour un mariage civil ?", "Rien ne l’oblige, mais c’est le moyen le plus simple d’annoncer la date et de dire à chacun à quels moments il est invité, surtout si la fête a lieu un autre jour."],
      ["Tout le monde peut-il venir à la mairie ?", "Oui : la célébration a lieu dans une salle ouverte au public. Si vous préférez une cérémonie intime, invitez la famille proche et annoncez la fête séparément."],
      ["Combien de témoins pour un mariage civil ?", "Au moins deux et au plus quatre. Chacun doit présenter l’original de sa pièce d’identité le jour de la célébration."],
      ["Peut-on mettre la cérémonie religieuse avant la mairie sur le faire-part ?", "Non. En France, le mariage religieux ne peut pas être célébré avant le mariage civil : la mairie apparaît toujours en premier."],
      ["Quand envoyer le faire-part d’un mariage civil ?", "Comme pour tout mariage, trois à quatre mois avant, une fois la date validée par la mairie. Si la fête a lieu plus tard, envoyez-le pour la date de la fête."],
    ],
    methodology: "<p>Les règles juridiques (lieu du mariage, publication des bans, salle ouverte au public, ordre des cérémonies) viennent de la fiche Service Public F930, vérifiée le 28 octobre 2026 ; le nombre de témoins vient de l’article 75 du Code civil.</p>" + productCheck("le design Pearl et les sections programme et lieu"),
    sources: [servicePublic, mariagesNetEnvoi],
  },

  // 2. Créer un faire-part en ligne
  {
    slug: "creer-faire-part-mariage-en-ligne",
    keyword: "créer un faire-part de mariage en ligne",
    title: "Créer un faire-part de mariage en ligne : la méthode en 7 étapes, du texte au RSVP",
    metaTitle: "Créer un faire-part de mariage en ligne : 7 étapes",
    description: "Les informations à réunir, le choix du design, le texte, le RSVP, le test sur téléphone et l’envoi : comment créer un faire-part de mariage en ligne sans rien oublier.",
    heroImage: `${IMG}/folde-live-preview-editor.webp`,
    imageAlt: "Éditeur de faire-part en ligne avec un aperçu en direct sur téléphone",
    datePublished: "2026-11-26",
    readingTime: 8,
    author: authorFr,
    quickAnswer: "Pour créer un faire-part de mariage en ligne : réunissez d’abord les informations (date, lieux, horaires, date limite de réponse), choisissez un design, écrivez un texte court, ajoutez le programme, le plan d’accès et un formulaire de réponse, testez sur votre propre téléphone, puis envoyez le lien par message avec quelques mots personnels. Comptez une à deux heures si vos informations sont prêtes.",
    ctaAfter: 2,
    sections: [
      {
        heading: "Étape 1 : réunir les informations avant d’ouvrir l’éditeur",
        body: "<p>La plupart des couples perdent du temps parce qu’ils commencent par le design. Faites l’inverse : notez d’abord tout ce que vos invités doivent savoir. Vous irez ensuite deux fois plus vite.</p><ul><li>la date et, pour chaque moment (mairie, cérémonie, vin d’honneur, dîner, brunch), l’heure et l’adresse exacte ;</li><li>la date limite de réponse, fixée avec votre traiteur ;</li><li>ce que vous voulez demander aux invités : présence, accompagnant, régime alimentaire ;</li><li>les informations utiles : code vestimentaire, parking, hébergements proches, liste de mariage ;</li><li>deux ou trois photos si votre design en utilise.</li></ul>",
      },
      {
        heading: "Étape 2 : choisir le design",
        body: "<p>Choisissez un design qui ressemble à votre mariage, pas à la tendance du moment : un domaine champêtre, une villa au bord de l’eau ou un mariage en ville n’appellent pas la même ambiance. Vérifiez trois choses : le texte reste lisible sur un petit écran, les couleurs vont avec votre décoration, et l’ouverture (enveloppe, animation) ne fait pas attendre l’invité trop longtemps. Sur FOLDÈ, la page <a href=\"" + modeles + "\">modèles</a> propose 47 designs, que vous pouvez essayer gratuitement avec vos prénoms avant de payer quoi que ce soit.</p>",
        figure: { ...portrait("folde-creation-flow-names-mobile"), alt: "Première étape de création d’un faire-part en ligne, où l’on saisit les prénoms du couple", caption: "La création commence par vos prénoms : l’aperçu se met à jour immédiatement (FOLDÈ, novembre 2026)." },
      },
      {
        heading: "Étape 3 : écrire un texte court",
        body: "<p>En ligne, l’annonce n’a pas besoin de tout porter : le programme, les adresses et la réponse ont chacun leur section. Trois ou quatre lignes suffisent. Par exemple : « Claire et Thomas ont la joie de vous inviter à leur mariage, le samedi 12 juin 2027, au Domaine des Tilleuls. » Si vous cherchez l’inspiration, nos <a href=\"/fr/blog/textes-faire-part-mariage\">28 exemples de textes de faire-part</a> sont classés par ton.</p>",
      },
      {
        heading: "Étape 4 : ajouter le programme, les lieux et l’hébergement",
        body: "<p>C’est ce qui fait la différence avec un faire-part papier. Indiquez chaque moment de la journée avec son heure, ajoutez une carte avec un bouton d’itinéraire pour chaque adresse, et une section hébergement si des invités viennent de loin. Un code vestimentaire, un menu ou une galerie photo peuvent compléter, mais ne remplissez pas toutes les sections par principe : un faire-part trop long se lit moins bien.</p>",
        figure: { ...portrait("accommodations-and-dining-mobile"), alt: "Section hébergement et restaurants d’un faire-part numérique", caption: "La section hébergement évite des dizaines de messages « où est-ce qu’on dort ? » (FOLDÈ, novembre 2026)." },
      },
      {
        heading: "Étape 5 : configurer la réponse des invités",
        body: "<p>Le formulaire de réponse remplace le carton-réponse et ses timbres. Sur FOLDÈ, il demande le prénom et le nom, l’e-mail, la présence (oui ou non), si l’invité vient seul, accompagné ou en famille, et ses allergies ou régimes alimentaires. Les réponses arrivent dans votre tableau de bord, en temps réel. Écrivez la date limite en clair juste au-dessus du formulaire : « Merci de répondre avant le 15 avril ». Pour fixer la bonne date, lisez notre guide du <a href=\"/fr/blog/carton-reponse-mariage\">carton réponse de mariage</a>.</p>",
        figure: { ...portrait("digital-invitation-rsvp-form-mobile"), alt: "Formulaire de réponse d’un faire-part numérique avec présence, accompagnant et régime alimentaire", caption: "Le formulaire RSVP d’un faire-part FOLDÈ (interface en anglais, novembre 2026)." },
      },
      {
        heading: "Étape 6 : tester sur votre téléphone",
        body: "<p>Ouvrez le lien sur votre propre téléphone, comme un invité. Vérifiez que les prénoms et la date sont justes, que chaque bouton d’itinéraire mène au bon endroit, que la musique ne démarre pas trop fort, et envoyez-vous une réponse test pour voir où elle arrive. Demandez à une personne qui ne connaît pas l’organisation de le lire en une minute : si elle ne sait pas dire où et à quelle heure venir, votre texte est trop long ou mal placé.</p>",
      },
      {
        heading: "Étape 7 : envoyer le lien, puis suivre les réponses",
        body: "<p>N’envoyez jamais le lien seul. Deux phrases personnelles suffisent : « Bonjour Marie, on se marie ! Tout est dans ce lien, et on compte sur toi pour répondre avant le 15 avril. » Envoyez par le canal que chaque invité utilise vraiment (SMS, WhatsApp, e-mail), et prévoyez une version imprimée ou un appel pour ceux qui n’ont pas de smartphone. Ensuite, suivez les réponses dans votre tableau de bord et relancez une semaine avant la date limite les personnes qui n’ont pas répondu.</p>",
      },
      {
        heading: "Combien ça coûte ?",
        body: "<p>Le prix d’un faire-part en ligne ne dépend pas du nombre d’invités : pas d’impression, pas d’enveloppes, pas de timbres. Chez FOLDÈ, au 26 novembre 2026, la formule Standard coûte 29,90 $ en paiement unique et vous personnalisez vous-même votre design ; la formule Expert coûte 149 $ et notre atelier réalise le faire-part pour vous. Les deux incluent un nombre d’invités illimité et le suivi des réponses. Le détail est sur la page <a href=\"" + tarifs + "\">tarifs</a>. À titre de comparaison, le seul timbre d’un faire-part papier coûte 1,67 € à partir du 1er janvier 2027 en Lettre verte.</p>",
      },
    ],
    faqs: [
      ["Combien de temps faut-il pour créer un faire-part en ligne ?", "Une à deux heures si vos informations sont prêtes. La plus grande partie du temps passe dans le texte et le programme, pas dans le design."],
      ["Peut-on modifier un faire-part en ligne après l’avoir envoyé ?", "Oui. Vous modifiez le faire-part et tout le monde voit la mise à jour avec le même lien. Prévenez quand même directement les invités si un horaire change."],
      ["Le faire-part en ligne est-il gratuit ?", "Sur FOLDÈ, l’aperçu avec vos prénoms est gratuit, sans compte. La publication se paie une fois : 29,90 $ en Standard ou 149 $ en Expert, au 26 novembre 2026."],
      ["Comment faire pour les invités qui n’ont pas de smartphone ?", "Imprimez quelques exemplaires pour eux, ou proposez à un proche de leur montrer le faire-part et de répondre à leur place."],
      ["Faut-il quand même envoyer un save the date ?", "Seulement si le mariage a lieu loin, en haute saison ou un week-end prolongé. Le même lien peut d’ailleurs servir de save the date puis de faire-part."],
    ],
    methodology: productCheck("l’éditeur depuis la page modèles, puis le formulaire de réponse sur un téléphone") + "<p>Le tarif postal vient du communiqué de La Poste sur les tarifs au 1er janvier 2027.</p>",
    sources: [laPoste, mariagesNetEnvoi],
  },

  // 3. Champêtre
  {
    slug: "faire-part-mariage-champetre",
    keyword: "faire-part mariage champêtre",
    title: "Faire-part de mariage champêtre : 5 styles, 12 textes et comment rester élégant",
    metaTitle: "Faire-part mariage champêtre : 5 styles et 12 textes",
    description: "Kraft, fleurs des champs, eucalyptus, bohème ou chic : 5 styles de faire-part champêtre, les couleurs qui vont avec, 12 textes et les infos pratiques d’un mariage à la campagne.",
    heroImage: "/images/blog/pexels/32994504.jpg",
    imageAlt: "Faire-part de mariage avec des détails floraux posé sur une table",
    datePublished: "2026-11-26",
    readingTime: 8,
    author: authorFr,
    quickAnswer: "Un faire-part champêtre s’appuie sur des matières et des motifs naturels (kraft, fleurs des champs, feuillages) et une palette douce : vert sauge, beige, terracotta, rose poudré. Pour qu’il reste élégant, gardez une seule idée forte, une typographie lisible et beaucoup d’espace. Et comme un mariage à la campagne est souvent difficile d’accès, soignez autant le plan d’accès que le décor.",
    ctaAfter: 2,
    sections: [
      {
        heading: "5 styles de faire-part champêtre",
        body: "<p>« Champêtre » recouvre des ambiances très différentes. Choisissez celle qui correspond à votre lieu.</p>",
        table: {
          caption: "Quel style champêtre pour quel mariage ?",
          head: ["Style", "Matières et motifs", "Palette", "Idéal pour"],
          rows: [
            ["Kraft et ficelle", "Papier kraft, ficelle de jute, étiquette", "Brun, crème, vert", "Grange, ferme, mariage DIY"],
            ["Fleurs des champs", "Aquarelle de coquelicots, marguerites, lavande", "Blanc, jaune, bleu lavande", "Mariage en Provence, en plein été"],
            ["Eucalyptus et feuillages", "Branches, olivier, eucalyptus", "Vert sauge, blanc, doré", "Domaine, mas, oliveraie"],
            ["Bohème", "Pampa, fleurs séchées, typographie manuscrite", "Terracotta, sable, rose poudré", "Mariage en fin d’été, cérémonie laïque"],
            ["Champêtre chic", "Papier épais, dorure discrète, petit bouquet", "Ivoire, vert profond, or", "Château ou domaine viticole"],
          ],
        },
      },
      {
        heading: "Les couleurs qui marchent (et celles qui fatiguent)",
        body: "<p>Les palettes champêtres les plus réussies restent douces : vert sauge ou olive, beige, terracotta, rose poudré, bleu ciel. Elles rappellent les matières du lieu sans crier. Ce qui fatigue vite : trop de couleurs à la fois, un vert trop saturé, ou un fond très texturé (bois, kraft foncé) sous un texte fin. Sur papier comme à l’écran, le texte doit rester lisible : choisissez un fond clair et une écriture foncée, et gardez la typographie manuscrite pour vos prénoms seulement.</p>",
        figure: { ...portrait("amber-design-countryside-opening-mobile"), alt: "Design de faire-part numérique Amber avec une scène de campagne peinte", caption: "Amber, un design FOLDÈ aux tons chauds de campagne (novembre 2026)." },
      },
      {
        heading: "12 textes de faire-part champêtre",
        body: "<p><strong>Simples et chaleureux</strong></p><blockquote>1. Claire et Thomas se marient au milieu des champs. Rendez-vous le samedi 12 juin 2027 à la Ferme du Moulin, à Montbrison.</blockquote><blockquote>2. Une grange, des guirlandes, de grandes tablées : on se marie le 12 juin 2027, et on vous veut avec nous.</blockquote><blockquote>3. Sous les tilleuls du Domaine des Charmes, Claire et Thomas se diront oui le 12 juin 2027 à 16 heures.</blockquote><blockquote>4. Bottes conseillées, bonne humeur obligatoire. Claire et Thomas, 12 juin 2027, Ferme du Moulin.</blockquote><p><strong>Plus poétiques</strong></p><blockquote>5. Au temps des cerises et des longues soirées, Claire et Thomas ont la joie de vous inviter à leur mariage.</blockquote><blockquote>6. Entre les vignes et les oliviers, nous écrirons la première page de notre histoire à deux. Venez la lire avec nous.</blockquote><blockquote>7. Là où les champs rejoignent le ciel, rendez-vous le 12 juin 2027 pour célébrer notre amour.</blockquote><blockquote>8. « Il faut toujours un hiver pour bercer un printemps. » Après plusieurs saisons ensemble, Claire et Thomas se marient le 12 juin 2027.</blockquote><p><strong>Avec les infos pratiques du lieu</strong></p><blockquote>9. Le domaine est au bout d’un chemin de terre : suivez les ballons blancs depuis le village.</blockquote><blockquote>10. La cérémonie a lieu dans l’herbe : laissez les talons aiguilles à la maison, et pensez à une petite laine pour la soirée.</blockquote><blockquote>11. Pas de réseau au domaine : téléchargez le plan d’accès avant de partir.</blockquote><blockquote>12. Navette depuis la gare de Montbrison à 15 h et retour à 2 h du matin. Merci de nous dire si vous la prenez en répondant au faire-part.</blockquote>",
      },
      {
        heading: "Ce qu’un mariage à la campagne doit dire en plus",
        body: "<p>Le charme d’un lieu champêtre, c’est aussi ce qui le rend compliqué pour les invités : un accès par une petite route, peu de réseau, pas d’hôtel à côté, une cérémonie dehors. Le faire-part doit donc répondre à des questions qu’un mariage en ville ne pose pas :</p><ul><li><strong>l’accès</strong> : adresse exacte, repère visible depuis la route, coordonnées GPS si le lieu est mal référencé ;</li><li><strong>le stationnement</strong> : où se garer, et si une navette existe ;</li><li><strong>l’hébergement</strong> : gîtes et chambres d’hôtes proches, à réserver tôt en été ;</li><li><strong>la tenue</strong> : terrain herbeux, fraîcheur du soir, plan B en cas de pluie ;</li><li><strong>le réseau</strong> : s’il est faible, invitez les invités à enregistrer le plan avant de partir.</li></ul>",
        figure: { ...portrait("dress-code-and-hotels-mobile"), alt: "Sections code vestimentaire et hébergement d’un faire-part numérique", caption: "Code vestimentaire et hébergement, deux sections indispensables pour un mariage à la campagne (FOLDÈ, novembre 2026)." },
      },
      {
        heading: "Rester élégant : 5 règles",
        body: "<ul><li><strong>Une seule idée forte</strong> : du kraft ou des fleurs aquarellées ou de la dentelle, pas les trois.</li><li><strong>De l’espace</strong> : un faire-part champêtre trop chargé ressemble vite à un set de table.</li><li><strong>Deux typographies maximum</strong> : une manuscrite pour vos prénoms, une simple et lisible pour le reste.</li><li><strong>Des illustrations plutôt que des photos de stock</strong> : une branche d’olivier dessinée vieillit mieux qu’un bouquet photographié.</li><li><strong>La même ambiance partout</strong> : faire-part, panneau de bienvenue et menu se répondent, même discrètement.</li></ul>",
      },
      {
        heading: "Un faire-part champêtre en version numérique",
        body: "<p>Un <a href=\"" + landing + "\">faire-part numérique</a> champêtre garde l’ambiance (illustrations, couleurs, typographie) et résout les questions pratiques mieux qu’un carton : bouton d’itinéraire vers le domaine, section hébergement, code vestimentaire, réponse en ligne avec la question de la navette. Parmi les designs FOLDÈ, Amber, Olive Grove, Le Jardin, Bloom et Romantic Garden ont des ambiances de campagne ou de jardin. Vous pouvez les essayer gratuitement avec vos prénoms depuis la page <a href=\"" + modeles + "\">modèles</a>.</p>",
        figure: { ...portrait("olive-grove-design-opening-mobile"), alt: "Design de faire-part numérique Olive Grove avec des oliviers peints", caption: "Olive Grove, un design FOLDÈ botanique (novembre 2026)." },
      },
    ],
    faqs: [
      ["Quel papier pour un faire-part champêtre ?", "Le kraft est le plus utilisé, suivi du papier recyclé ou ensemencé. Vérifiez que le texte reste lisible : sur un kraft foncé, écrivez en blanc ou en crème."],
      ["Quelles couleurs pour un mariage champêtre ?", "Des tons doux et naturels : vert sauge, olive, beige, terracotta, rose poudré ou bleu ciel. Deux ou trois couleurs suffisent."],
      ["Champêtre et chic, c’est compatible ?", "Oui : gardez une matière naturelle et ajoutez une seule touche raffinée, comme une dorure discrète ou un papier épais. Le reste doit rester sobre."],
      ["Que faut-il ajouter sur le faire-part d’un mariage à la campagne ?", "L’accès précis, le stationnement ou la navette, l’hébergement proche et une indication sur la tenue si la cérémonie a lieu dans l’herbe."],
    ],
    methodology: "<p>Les tendances de matières et de couleurs s’appuient sur les guides champêtres de Bridebook et de Mariages.net, consultés le 26 novembre 2026.</p>" + productCheck("les designs Amber et Olive Grove et les sections code vestimentaire et hébergement"),
    sources: [bridebookChampetre, mariagesNetChampetre],
  },

  // 4. Carton réponse
  {
    slug: "carton-reponse-mariage",
    keyword: "carton réponse mariage",
    title: "Carton réponse de mariage : quoi demander, quelle date limite et 10 formulations",
    metaTitle: "Carton réponse mariage : date limite et 10 formulations",
    description: "Ce qu’un carton réponse de mariage doit demander, comment fixer la date limite avec votre traiteur, 10 formulations et comment relancer ceux qui n’ont pas répondu.",
    heroImage: "/images/blog/pexels/34579982.jpg",
    imageAlt: "Papeterie de mariage élégante avec enveloppe doublée et perles",
    datePublished: "2026-11-26",
    readingTime: 7,
    author: authorFr,
    quickAnswer: "Le carton réponse demande au minimum le nom de l’invité, s’il vient ou non, et avec combien de personnes. Ajoutez seulement les questions dont vous avez vraiment besoin, comme les régimes alimentaires. Fixez la date limite à partir de celle de votre traiteur : en général trois à six semaines avant le mariage, et environ deux mois si vous voulez du temps pour le plan de table et les relances.",
    ctaAfter: 2,
    sections: [
      {
        heading: "Ce que le carton réponse doit demander",
        body: "<p>Chaque question en plus fait baisser le nombre de réponses complètes. Partez de ce dont votre traiteur et votre plan de table ont besoin, et rien d’autre.</p>",
        table: {
          caption: "Les questions d’un carton réponse",
          head: ["Question", "Indispensable ?", "Pourquoi"],
          rows: [
            ["Nom et prénom", "Oui", "Savoir qui a répondu, surtout quand plusieurs membres d’une famille répondent"],
            ["Présence (oui / non)", "Oui", "Le chiffre dont dépend tout le reste"],
            ["Nombre de personnes ou accompagnant", "Oui", "Évite les surprises le jour J"],
            ["Moments (mairie, vin d’honneur, dîner, brunch)", "Si invitations différentes", "Le traiteur compte souvent chaque moment à part"],
            ["Allergies, régimes alimentaires", "Recommandé", "Le traiteur doit le savoir à l’avance"],
            ["Navette, hébergement", "Si vous en proposez", "Dimensionner le bus ou les chambres réservées"],
            ["Un petit mot pour les mariés", "Facultatif", "Agréable, mais jamais obligatoire"],
          ],
        },
      },
      {
        heading: "Quelle date limite de réponse ?",
        body: "<p>Ne choisissez pas la date limite au hasard : partez de la date à laquelle votre traiteur et votre lieu veulent le nombre définitif d’invités, puis remontez.</p><ul><li><strong>Trois à quatre semaines avant le mariage</strong> : c’est la date limite la plus courante, suffisante pour un mariage simple.</li><li><strong>Six à huit semaines avant</strong> : plus confortable si vous avez un plan de table à faire, beaucoup d’invités qui voyagent ou des hébergements à confirmer. Mariages.net conseille même environ deux mois.</li><li><strong>Gardez une semaine de marge</strong> avant la date demandée par le traiteur, pour les relances.</li></ul><p>Exemple : traiteur qui veut le chiffre final le 1er mai, date limite de réponse le 15 avril, relance le 8 avril.</p>",
      },
      {
        heading: "10 formulations pour le carton réponse",
        body: "<p><strong>Formulations classiques</strong></p><blockquote>1. Merci de nous faire part de votre réponse avant le 15 avril 2027.</blockquote><blockquote>2. Madame, Monsieur ……… assistera / n’assistera pas au mariage de Claire et Thomas. Nombre de personnes : ……</blockquote><blockquote>3. Réponse souhaitée avant le 15 avril, afin que nous puissions organiser au mieux cette journée.</blockquote><p><strong>Formulations modernes</strong></p><blockquote>4. Tu viens ? Dis-le-nous avant le 15 avril, ça nous aide énormément pour l’organisation.</blockquote><blockquote>5. ☐ Je serai là, et je danserai. ☐ Je ne pourrai pas venir, mais je lèverai mon verre à distance.</blockquote><blockquote>6. Une allergie, un régime particulier ? Dites-le-nous, le chef s’en occupe.</blockquote><blockquote>7. Merci de répondre avant le 15 avril, directement depuis ce faire-part : c’est rapide et ça nous évite de vous relancer.</blockquote><p><strong>Pour les cas délicats</strong></p><blockquote>8. Nous avons réservé ……… place(s) en votre honneur.</blockquote><blockquote>9. Nous avons choisi de faire de cette journée une fête entre adultes. Merci de votre compréhension.</blockquote><blockquote>10. Le dîner étant servi à table, nous avons besoin de votre réponse avant le 15 avril pour finaliser le plan de table.</blockquote><p>La formulation 8 est la façon la plus élégante d’indiquer combien de personnes sont invitées sans avoir à écrire « sans accompagnant ».</p>",
      },
      {
        heading: "Papier, QR code ou réponse en ligne ?",
        body: "<p>Le carton réponse papier a un coût souvent oublié : il faut l’imprimer, fournir une enveloppe et, si vous voulez vraiment des réponses, la timbrer. La Lettre verte de 20 g coûte 1,52 € en 2026 et passe à 1,67 € le 1er janvier 2027 : pour 80 foyers, cela fait plus de 130 € de timbres rien que pour les retours, sans compter les invités qui oublient de le poster. La solution la plus courante aujourd’hui est un QR code imprimé sur le faire-part qui renvoie vers une réponse en ligne, ou directement un <a href=\"" + landing + "\">faire-part numérique</a> avec le formulaire intégré.</p>",
        figure: { ...portrait("digital-invitation-rsvp-form-mobile"), alt: "Formulaire de réponse d’un faire-part numérique avec présence, accompagnant et régime alimentaire", caption: "Le formulaire de réponse FOLDÈ : présence, accompagnant ou famille, allergies et régimes (interface en anglais, novembre 2026)." },
      },
      {
        heading: "Relancer sans vexer",
        body: "<p>Il y aura toujours des invités qui ne répondent pas, souvent par simple oubli. Une semaine avant la date limite, envoyez un message court et personnel, jamais groupé :</p><blockquote>« Coucou Julie ! On boucle le plan de table la semaine prochaine : tu nous dis si tu viens ? Tout est dans le lien du faire-part. »</blockquote><p>Avec une réponse en ligne, vous voyez en un coup d’œil qui n’a pas répondu ; sur FOLDÈ, les réponses s’affichent en temps réel dans votre tableau de bord, ce qui évite de tenir un tableur à la main.</p>",
      },
    ],
    faqs: [
      ["Combien de temps avant le mariage fixer la date limite de réponse ?", "En général trois à six semaines avant, et environ deux mois si vous avez un plan de table à préparer ou beaucoup d’invités qui voyagent."],
      ["Faut-il timbrer l’enveloppe du carton réponse ?", "C’est l’usage si vous voulez des réponses par courrier. Comptez 1,67 € par enveloppe en Lettre verte à partir du 1er janvier 2027."],
      ["Que faire si un invité ne répond pas ?", "Envoyez-lui un message court et personnel une semaine avant la date limite. Si rien ne vient, un appel règle la question."],
      ["Peut-on remplacer le carton réponse par un QR code ?", "Oui, c’est de plus en plus courant : le QR code imprimé sur le faire-part renvoie vers un formulaire en ligne, et les réponses arrivent au même endroit."],
      ["Comment indiquer que l’invité vient sans accompagnant ?", "Écrivez « Nous avons réservé une place en votre honneur » : c’est clair, sans être sec."],
    ],
    methodology: "<p>Les délais de réponse s’appuient sur Mariages.net (envoi et date limite) et sur Withjoy (date limite la plus courante, rappel une semaine avant), consultés le 26 novembre 2026 ; les tarifs postaux viennent du communiqué de La Poste sur les tarifs au 1er janvier 2027.</p>" + productCheck("le formulaire de réponse et le tableau de bord des réponses"),
    sources: [mariagesNetEnvoi, mariagesNetCoupon, withjoy, laPoste, laPosteTarif],
  },

  // 5. Classique (remplace la traduction de « traditional-wedding-invitations »)
  {
    slug: "faire-part-mariage-classique",
    keyword: "faire-part mariage classique",
    title: "Faire-part de mariage classique : l’ordre des mentions, les formules consacrées et 8 exemples",
    metaTitle: "Faire-part mariage classique : règles et 8 exemples",
    description: "Qui invite, dans quel ordre, avec quelles formules : les règles du faire-part de mariage classique à la française, 8 exemples complets et comment le moderniser sans le trahir.",
    heroImage: "/images/blog/pexels/29395419.jpg",
    imageAlt: "Enveloppe de faire-part classique scellée à la cire",
    datePublished: "2026-11-26",
    readingTime: 8,
    author: authorFr,
    quickAnswer: "Le faire-part classique est rédigé au nom des parents, à la troisième personne : d’abord les grands-parents s’ils sont mentionnés, puis les parents de la mariée, ceux du marié, l’annonce du mariage de leurs enfants, la date et l’heure écrites en toutes lettres, le lieu de la cérémonie, et en bas les adresses des parents. Le carton d’invitation au dîner et le carton réponse sont glissés à part.",
    ctaAfter: 2,
    sections: [
      {
        heading: "L’ordre des mentions, de haut en bas",
        body: "<p>Le faire-part classique suit un ordre précis, hérité de l’usage plus que d’une règle écrite. Le respecter, c’est ce qui lui donne son allure.</p>",
        table: {
          caption: "La structure d’un faire-part classique",
          head: ["Ordre", "Mention", "Exemple"],
          rows: [
            ["1", "Grands-parents (facultatif)", "Madame Jean Martin, Monsieur et Madame Henri Lefèvre"],
            ["2", "Parents de la mariée, puis du marié", "Monsieur et Madame Laurent Martin, Monsieur et Madame Paul Lefèvre"],
            ["3", "La formule d’annonce", "ont la joie de vous faire part du mariage de leurs enfants"],
            ["4", "Les prénoms des mariés", "Claire et Thomas"],
            ["5", "La date et l’heure, en toutes lettres", "le samedi douze juin deux mille vingt-sept, à quinze heures"],
            ["6", "Le lieu de la cérémonie", "en l’église Saint-Pierre de Beaune"],
            ["7", "Les adresses des parents, en bas", "à gauche la famille de la mariée, à droite celle du marié"],
          ],
        },
      },
      {
        heading: "Les formules consacrées, et ce qu’elles veulent dire",
        body: "<ul><li><strong>« ont la joie de vous faire part »</strong> : l’annonce simple, adressée à tous ceux qui reçoivent le faire-part, même s’ils ne sont pas invités à la fête.</li><li><strong>« ont l’honneur de vous faire part »</strong> : plus solennelle, souvent utilisée par les grands-parents ou dans les familles très attachées aux usages.</li><li><strong>« vous prient d’assister à la cérémonie »</strong> : une invitation à la cérémonie elle-même, pas seulement une annonce.</li><li><strong>« Madame Jean Martin »</strong> : la forme traditionnelle pour une veuve, qui conserve le prénom de son mari ; aujourd’hui, beaucoup de familles préfèrent « Madame Hélène Martin ».</li><li><strong>La date en toutes lettres</strong> : « le samedi douze juin deux mille vingt-sept » est la marque du faire-part classique ; les chiffres font plus moderne.</li></ul>",
      },
      {
        heading: "8 exemples de faire-part classiques",
        body: "<blockquote>1. Monsieur et Madame Laurent Martin, Monsieur et Madame Paul Lefèvre ont la joie de vous faire part du mariage de leurs enfants Claire et Thomas, qui sera célébré le samedi douze juin deux mille vingt-sept, à quinze heures, en l’église Saint-Pierre de Beaune.</blockquote><blockquote>2. Madame Jean Martin, Monsieur et Madame Henri Lefèvre ont la joie de vous faire part du mariage de leurs petits-enfants Claire et Thomas. Monsieur et Madame Laurent Martin, Monsieur et Madame Paul Lefèvre ont l’honneur de vous faire part du mariage de leurs enfants.</blockquote><blockquote>3. Monsieur et Madame Laurent Martin, Monsieur et Madame Paul Lefèvre vous prient d’assister ou de vous unir par la pensée à la messe de mariage qui sera célébrée en l’église Saint-Pierre de Beaune, le samedi douze juin deux mille vingt-sept, à quinze heures.</blockquote><blockquote>4. Monsieur et Madame Laurent Martin, Monsieur et Madame Paul Lefèvre sont heureux de vous annoncer le mariage de Claire et Thomas, célébré le samedi douze juin deux mille vingt-sept à onze heures à la mairie de Beaune, puis à quinze heures en l’église Saint-Pierre.</blockquote><blockquote>5. Madame Hélène Martin, Monsieur et Madame Paul Lefèvre ont la joie de vous faire part du mariage de Claire et Thomas.</blockquote><blockquote>6. Claire Martin et Thomas Lefèvre, avec leurs familles, ont la joie de vous faire part de leur mariage, qui sera célébré le samedi douze juin deux mille vingt-sept au Château de Savigny.</blockquote><blockquote>7. Carton d’invitation : Monsieur et Madame Laurent Martin, Monsieur et Madame Paul Lefèvre recevront après la cérémonie au Château de Savigny. Réponse souhaitée avant le quinze avril.</blockquote><blockquote>8. Carton du dîner : Claire et Thomas seront heureux de vous retrouver pour le dîner, qui sera servi à vingt heures au Château de Savigny.</blockquote><p>Les exemples 5 et 6 montrent les deux évolutions les plus courantes : un parent seul, et un faire-part rédigé par les mariés « avec leurs familles », qui garde le ton classique sans mettre les parents en avant.</p>",
        figure: { ...portrait("pearl-design-opening-mobile"), alt: "Design de faire-part numérique Pearl, sobre et lumineux", caption: "Pearl, un design FOLDÈ sobre qui convient à un texte classique (novembre 2026)." },
      },
      {
        heading: "Faire-part, carton d’invitation, carton réponse : qui reçoit quoi",
        body: "<p>Le faire-part classique annonce le mariage à un large cercle : famille éloignée, amis des parents, collègues. Il ne vaut pas invitation à la fête. Le carton d’invitation, glissé dans l’enveloppe, précise qui est attendu au vin d’honneur ou au dîner, et le carton réponse permet de confirmer. Pour la rédaction de ces cartons, voyez nos guides sur le <a href=\"/fr/blog/texte-invitation-mariage\">texte d’invitation de mariage</a> et le <a href=\"/fr/blog/carton-reponse-mariage\">carton réponse</a>.</p>",
      },
      {
        heading: "Moderniser un faire-part classique sans le trahir",
        body: "<ul><li><strong>Garder la structure, alléger le texte</strong> : on peut rester à la troisième personne tout en supprimant les grands-parents.</li><li><strong>Rédiger au nom des mariés « avec leurs familles »</strong> : le ton reste classique, et c’est plus simple quand les familles sont recomposées.</li><li><strong>Une typographie élégante plutôt que des ornements</strong> : une belle capitale romaine et beaucoup d’espace font plus classique qu’un cadre doré.</li><li><strong>Passer au numérique pour les informations pratiques</strong> : le texte d’annonce reste traditionnel, mais le programme, le plan d’accès et la réponse sont en ligne.</li></ul>",
      },
      {
        heading: "Un faire-part classique en version numérique",
        body: "<p>Un texte classique se marie très bien avec un <a href=\"" + landing + "\">faire-part numérique</a> sobre : l’ouverture d’une enveloppe scellée à la cire reprend le geste du papier, puis l’annonce apparaît en toutes lettres. Ce qui change : plus besoin de cartons séparés, chaque invité voit les moments auxquels il est convié et répond en ligne. Les designs Grand Heritage, Velvet Noir, Pearl ou, dans la collection Signature, Nacre et Classic Burgundy conviennent bien à un faire-part classique. Vous pouvez les essayer gratuitement depuis la page <a href=\"" + modeles + "\">modèles</a>.</p>",
        figure: { ...portrait("digital-invitation-wax-seal-envelope-mobile"), alt: "Enveloppe scellée à la cire à l’ouverture d’un faire-part numérique", caption: "L’ouverture d’une enveloppe scellée, sur un faire-part numérique FOLDÈ (novembre 2026)." },
      },
    ],
    faqs: [
      ["Qui apparaît en premier sur un faire-part classique ?", "Les grands-parents s’ils sont mentionnés, puis les parents de la mariée, puis ceux du marié. Les adresses des familles sont placées en bas, à gauche pour la mariée et à droite pour le marié."],
      ["« La joie » ou « l’honneur » de vous faire part ?", "« La joie » est la formule la plus courante ; « l’honneur » est plus solennelle, souvent réservée aux grands-parents ou aux familles très traditionnelles."],
      ["Faut-il écrire la date en toutes lettres ?", "Sur un faire-part classique, oui : « le samedi douze juin deux mille vingt-sept ». Les chiffres donnent un ton plus moderne."],
      ["Comment faire avec des parents divorcés ou un parent seul ?", "Chaque parent peut apparaître sous son propre nom, ou le faire-part peut être rédigé au nom des mariés « avec leurs familles », ce qui évite tout arbitrage."],
      ["Le faire-part classique vaut-il invitation ?", "Non. Il annonce le mariage ; c’est le carton d’invitation glissé avec lui qui convie au vin d’honneur ou au dîner."],
    ],
    methodology: "<p>Les règles de rédaction présentées ici sont celles de l’usage français, telles qu’elles figurent dans les guides de papeterie de mariage ; elles n’ont pas de valeur légale et chaque famille peut les adapter. Pour les délais d’envoi, nous nous appuyons sur Mariages.net.</p>" + productCheck("les designs Pearl et l’ouverture à enveloppe scellée"),
    sources: [mariagesNetEnvoi, servicePublic],
  },
];
