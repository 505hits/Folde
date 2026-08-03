import { orders } from "@/context/DatabaseContext"; // Or derive from fetch if possible, but actually we can just pass generic English strings.

export async function generateMetadata({ params }) {
    // Generate generic English metadata for the WhatsApp / Web Share preview card.
    return {
        title: "You're Invited! | Wedding Invitation",
        description: "You are warmly invited to our wedding celebration. Click to view our details and RSVP.",
        openGraph: {
            title: "You're Invited! | Wedding Invitation",
            description: "You are warmly invited to our wedding celebration. Click to view our details and RSVP.",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "You're Invited! | Wedding Invitation",
            description: "You are warmly invited to our wedding celebration. Click to view our details and RSVP.",
        },
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function InviteLayout({ children }) {
    return <>{children}</>;
}
