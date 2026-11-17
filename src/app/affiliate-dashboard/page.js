import AffiliateDashboard from "@/components/affiliates/AffiliateDashboard";

export const metadata = {
  title: "Affiliate dashboard | FOLDÈ",
  description: "Your affiliate link, clicks, sales and commissions.",
  robots: { index: false, follow: false },
};

export default function AffiliateDashboardPage({ locale = "en" }) {
  return <AffiliateDashboard locale={locale} />;
}
