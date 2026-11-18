import { getPostFr } from "@/lib/blog-fr";
import { landingContent } from "@/lib/landing-content";
import { localizedMetadata, renderLocalized } from "@/lib/localized-route";

const pageMetadata = {
  home: { title: "FOLDÈ – Faire-part et site de mariage en ligne, avec RSVP", description: "Créez un faire-part de mariage élégant qui s’envoie par lien : RSVP en ligne, programme, plan d’accès, galerie photo et gestion des invités en temps réel." },
  landing: { title: landingContent.fr.metaTitle, description: landingContent.fr.description },
  collections: { title: "Modèles de faire-part de mariage numérique | FOLDÈ", description: "Parcourez nos modèles de faire-part de mariage numérique : ouverture d’enveloppe animée, typographies élégantes, entièrement personnalisables." },
  packages: { title: "Tarifs des faire-part de mariage numériques | FOLDÈ", description: "Formules Standard et Expert : paiement unique, invités illimités, RSVP intégré. Comparez ce que comprend chaque formule." },
  approach: { title: "Notre méthode : de l’idée au faire-part en ligne | FOLDÈ", description: "Les quatre étapes de création de votre faire-part de mariage numérique, du premier échange jusqu’à l’envoi à vos invités." },
  story: { title: "Notre atelier | FOLDÈ Wedding", description: "FOLDÈ est un petit atelier de design : chaque enveloppe, scène à l’aquarelle et monogramme est dessiné à la main par notre équipe, puis prend vie en faire-part numérique." },
  blog: { title: "Blog mariage : textes, faire-part et save the date | FOLDÈ", description: "Textes de faire-part, formules d’invitation, save the date, budget : nos guides pour préparer et envoyer vos faire-part de mariage." },
  checkout: { title: "Créer votre faire-part | FOLDÈ", description: "Choisissez votre formule et personnalisez votre faire-part de mariage numérique." },
  dashboard: { title: "Votre tableau de bord | FOLDÈ", description: "Gérez votre faire-part, vos invités et vos RSVP." },
  success: { title: "Paiement confirmé | FOLDÈ", description: "Confirmation de votre commande FOLDÈ." },
  affiliates: { title: "Programme d’affiliation : 30 % de commission | FOLDÈ", description: "Recommandez les faire-part de mariage numériques FOLDÈ et gagnez 30 % sur chaque vente : lien personnel, cookie de 60 jours, email à chaque vente, paiement mensuel par PayPal ou Wise." },
  "affiliate-dashboard": { title: "Espace affilié | FOLDÈ", description: "Votre lien d’affiliation, vos clics, vos ventes et vos commissions." },
};

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  return localizedMetadata("fr", segments, getPostFr, pageMetadata);
}

export default async function FrenchPage({ params }) {
  const { segments = [] } = await params;
  return renderLocalized("fr", segments, getPostFr);
}
