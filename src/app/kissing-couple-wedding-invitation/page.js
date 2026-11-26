import BordeauxTemplate from '@/components/templates/BordeauxTemplate';

export const metadata = {
  title: 'Gregory & Isabelle - Wedding Invitation',
  description: 'Join us for our wedding day!',
  robots: { index: false, follow: true },
};

export default function KissingCouplePage() {
  // En production, on récupérerait ces données d'une base de données ou d'un CMS basé sur le slug.
  // Pour le moment, on utilise les valeurs par défaut du template.
  return <BordeauxTemplate />;
}
