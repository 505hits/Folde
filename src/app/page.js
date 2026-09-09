"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import styles from "./page.module.css";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";
import TemplateHeroPreview from "@/components/TemplateHeroPreview";
import { translateFr } from "@/lib/fr-ui";

const carouselItems = [
  { name: 'Luxe Gold', desc: 'Opulent and golden.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', envelope: '/videos/golden-palace.mp4', partner1: 'Gabriel', partner2: 'Mathilde', date: 'MAY 27, 2026' },
  { name: 'Pearl', desc: 'Luminous and serene.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', envelope: '/videos/ivory-veil.mp4', partner1: 'Arthur', partner2: 'Chloé', date: 'MAY 27, 2026' },
  { name: 'Velvet Noir', desc: 'Bold and timeless.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', envelope: '/videos/bordeaux.mp4', partner1: 'Alexandre', partner2: 'Éléonore', date: 'MAY 27, 2026' },
  { name: 'Olive Grove', desc: 'Botanical and fresh.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Lucas', partner2: 'Margaux', date: 'MAY 27, 2026' },
  { name: 'Amber', desc: 'Earthy and radiant.', video: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Hugo', partner2: 'Inès', date: 'MAY 27, 2026' },
  { name: 'Mocha', desc: 'Rich and soulful.', video: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Louis', partner2: 'Camille', date: 'MAY 27, 2026' },
  { name: 'Crimson Royal', desc: 'Regal and distinguished.', video: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', envelope: '/videos/horizon-bordeaux.mp4', partner1: 'Antoine', partner2: 'Victoire', date: 'MAY 27, 2026' },
  { name: 'Sapphire', desc: 'Oceanic and refined.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: '/videos/celestial-veil.mp4', partner1: 'Maxime', partner2: 'Charlotte', date: 'MAY 27, 2026' },
  { name: 'Blush Ribbon', desc: 'Romantic ribbon reveal.', video: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', envelope: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', partner1: 'Paul', partner2: 'Juliette', date: 'MAY 27, 2026' },
  { name: 'Grand Heritage', desc: 'A grand ceremonial debut.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', partner1: 'Charles', partner2: 'Valentine', date: 'MAY 27, 2026' },
  { name: 'The Lace Edit', desc: 'Delicate lace and timeless romance.', video: 'https://savethedate-thelaceedit.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', isImage: true, envelope: 'https://savethedate-thelaceedit.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Emma', partner2: 'Liam', date: 'MAY 27, 2026' },
  { name: 'Le Jardin', desc: 'A lush garden romance.', video: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/0d44b575-21a3-498b-856a-eaf9614d23c6/hero-video-compressed.mp4', isImage: false, envelope: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/08254d3d-25f6-40e6-a54a-6bc01219ec3e/envelope-v2.jpg', partner1: 'Sophie', partner2: 'Lucas', date: 'MAY 27, 2026' },
  { name: 'Lace Photo Scratch', desc: 'Interactive elegant scratch reveal.', video: 'https://savethedate-lacephotoscratch.thedigitalyes.com/assets/hero-scratch-cover-reference-CIK32eF4.png', isImage: true, envelope: 'https://savethedate-lacephotoscratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Chloe', partner2: 'Noah', date: 'MAY 27, 2026' },
  { name: 'Oasis Royale', desc: 'A grand desert oasis celebration.', video: 'https://savethedate-oasisroyale.thedigitalyes.com/__l5e/assets-v1/775de535-0300-4a62-ae3b-dceee4b22ab7/hero-video-compressed.mp4', isImage: false, envelope: 'https://savethedate-oasisroyale.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Mia', partner2: 'Leo', date: 'MAY 27, 2026' },
  { name: 'Tropical', desc: 'Vibrant tropical paradise.', video: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4', isImage: false, envelope: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/276cb847-0eab-41c6-9ad6-30c90ab5ec34/envelope-open.mp4', partner1: 'Ava', partner2: 'Oliver', date: 'MAY 27, 2026' },
  { name: 'Photo Scratch', desc: 'Reveal your memory.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', isImage: false, envelope: 'https://savethedate-photo-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Elena', partner2: 'Mark', date: 'AUG 12, 2026' },
  { name: 'Soft Scratch', desc: 'A soft reveal.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', isImage: false, envelope: 'https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Anna', partner2: 'Tom', date: 'SEP 05, 2026' },
  { name: 'Cisnes', desc: 'Elegant swans romance.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', isImage: false, envelope: 'https://savethedate-cisnes.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Clara', partner2: 'Hugo', date: 'OCT 18, 2026' },
  { name: 'Bloom', desc: 'Blossoming love.', video: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4', isImage: false, envelope: 'https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Lily', partner2: 'James', date: 'JUN 21, 2026' },
  { name: 'Floral', desc: 'A bed of flowers.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', isImage: false, envelope: 'https://savethedate-floral.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Rose', partner2: 'Jack', date: 'MAY 15, 2026' },
  { name: 'Romantic Garden', desc: 'Enchanted floral garden romance.', video: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4', isImage: false, envelope: 'https://eftesa.com/assets/themes/romantic-garden/Floral-garden-intro-video.mp4', partner1: 'Julien', partner2: 'Camille', date: 'JUN 18, 2026' },
  { name: 'Blossom Oud', desc: 'Sublime floral and oud aesthetic.', video: 'https://static.tildacdn.net/tild3332-3762-4233-a636-636233333133/Vector.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Youssef', partner2: 'Salma', date: 'JUL 12, 2026' },
  { name: 'Dolce Vita', desc: 'Italian coast & sun-drenched romance.', video: 'https://static.tildacdn.net/tild3733-3133-4232-b033-623736623262/romantic-moments-bea.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Matteo', partner2: 'Chiara', date: 'AUG 20, 2026' },
  { name: 'Velvet Garden', desc: 'Sleek modern luxury with botanical details.', video: 'https://static.tildacdn.net/tild3338-6332-4463-b639-623665353237/300592484d1f31590325.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Enzo', partner2: 'Manon', date: 'SEP 14, 2026' },
  { name: 'Noir Gold', desc: 'Minimalist dark luxury with gold accents.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', isImage: false, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Lucas', partner2: 'Inès', date: 'OCT 02, 2026' },
  { name: 'Como', desc: 'Lake Como villa elegance.', video: 'https://pressedlove.com/demo-media/como/hero-video.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/wax-seal-blue-e30ba1e0.mp4', partner1: 'Lorenzo', partner2: 'Sophia', date: 'JUN 05, 2026' },
  { name: 'Teatro', desc: 'Theatrical curtain reveal and opulent gold.', video: 'https://pressedlove.com/demo-media/template-teatro/curtain-video-BAKLj3Y5.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Dante', partner2: 'Beatrice', date: 'JUL 18, 2026' },
  { name: 'The Venue', desc: 'Destination villa & estate celebration.', video: 'https://pressedlove.com/demo-media/boda-mar-jaume/intro-video-BSNlV4m4.webm', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Jaume', partner2: 'Mar', date: 'AUG 28, 2026' },
  { name: 'Sweet Love', desc: 'Warm peach, cream & tender romance.', video: 'https://pressedlove.com/demo-media/boda-laura-javier/hero-video-new-G6oopIOA.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Javier', partner2: 'Laura', date: 'SEP 10, 2026' },
  { name: 'Botanical Floral', desc: 'Soft floral petals and garden blooming.', video: 'https://pressedlove.com/demo-media/boda-maria-carlos/hero-video-1230-C27srnl9.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Carlos', partner2: 'María', date: 'OCT 15, 2026' },
  { name: 'Big Entrance', desc: 'Cinematic debut and regal golden seal.', video: 'https://pressedlove.com/demo-media/theme-previews/theme-big-entrance.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/wax-seal-yellow-dc798fa1.mp4', partner1: 'Raphaël', partner2: 'Victoria', date: 'NOV 08, 2026' },
];

const FEATURED_TEMPLATE_NAMES = ['Cisnes', 'Bloom', 'Romantic Garden', 'Como', 'Tropical', 'Soft Scratch'];
const orderedCarouselItems = [...carouselItems].sort((a, b) => {
  const aIndex = FEATURED_TEMPLATE_NAMES.indexOf(a.name);
  const bIndex = FEATURED_TEMPLATE_NAMES.indexOf(b.name);
  return (aIndex === -1 ? FEATURED_TEMPLATE_NAMES.length : aIndex) - (bIndex === -1 ? FEATURED_TEMPLATE_NAMES.length : bIndex);
});

const testimonials = [
  { name: "Isabelle & Hugo", text: "FOLDÈ transformed our vision into a breathtaking digital experience. All of our guests were captivated the moment they opened it.", rating: 5 },
  { name: "Priya & Daniel", text: "The level of elegance and craftsmanship is extraordinary. Our invitation felt like a work of art, and the RSVP system made managing responses effortless.", rating: 5 },
  { name: "Camille & Antoine", text: "Working with FOLDÈ was an absolute joy. They captured our aesthetic perfectly to create an unforgettable keepsake.", rating: 5 },
  { name: "Nina & Rafael", text: "The real-time guest dashboard changed everything for us. No more tracking down guests — seamless and perfectly organized.", rating: 5 },
];

const faqs = [
  { q: "How long does it take for my invitation to be ready?", a: "Once your information is completed, your custom invitation is ready within 5 to 7 business days, revisions included." },
  { q: "Can I edit details after sending?", a: "Optionally. Your invitation is dynamic — update your schedule, location, or timings anytime without re-sending the link." },
  { q: "Is there a guest limit?", a: "No limits. All packages include unlimited guests with no extra fees." },
  { q: "Do you support multi-language invitations?", a: "Yes, our packages support multi-language invitations to welcome guests worldwide in their native language." },
  { q: "How does the RSVP system work?", a: "Each invitation includes an interactive RSVP form. Guests confirm attendance and dietary choices in one tap, synced directly to your private dashboard." },
];

const spanishCarouselDescriptions = {
  'Luxe Gold': 'Opulenta y dorada.', Pearl: 'Luminosa y serena.', 'Velvet Noir': 'Audaz y atemporal.', 'Olive Grove': 'Botánica y fresca.',
  Amber: 'Cálida y radiante.', Mocha: 'Intensa y llena de carácter.', 'Crimson Royal': 'Majestuosa y distinguida.', Sapphire: 'Inspirada en el océano y refinada.',
  'Blush Ribbon': 'Una romántica apertura con lazo.', 'Grand Heritage': 'Una entrada solemne y grandiosa.', 'The Lace Edit': 'Encaje delicado y romanticismo atemporal.',
  'Le Jardin': 'Un exuberante jardín romántico.', 'Lace Photo Scratch': 'Una elegante revelación interactiva.', 'Oasis Royale': 'Una gran celebración en un oasis del desierto.',
  Tropical: 'Un paraíso tropical lleno de color.', 'Photo Scratch': 'Descubrid vuestro recuerdo.', 'Soft Scratch': 'Una revelación delicada.',
  Cisnes: 'Un romántico encuentro entre cisnes.', Bloom: 'El amor en plena floración.', Floral: 'Un lecho de flores.', 'Romantic Garden': 'Un jardín floral encantado y romántico.',
  'Blossom Oud': 'Una sofisticada estética floral con madera de oud.', 'Dolce Vita': 'La costa italiana y un romance bañado por el sol.',
  'Velvet Garden': 'Lujo contemporáneo con detalles botánicos.', 'Noir Gold': 'Lujo oscuro y minimalista con detalles dorados.', Como: 'La elegancia de una villa en el lago de Como.',
  Teatro: 'Una apertura teatral con cortinas y oro.', 'The Venue': 'Una celebración en una villa de destino.', 'Sweet Love': 'Tonos melocotón, crema y un romanticismo delicado.',
  'Botanical Floral': 'Pétalos suaves y un jardín en flor.', 'Big Entrance': 'Una entrada cinematográfica con un sello dorado majestuoso.',
};

const spanishTestimonials = [
  { name: 'Isabelle & Hugo', text: 'FOLDÈ convirtió nuestra visión en una experiencia digital impresionante. Todos nuestros invitados quedaron cautivados desde el momento en que la abrieron.', rating: 5 },
  { name: 'Priya & Daniel', text: 'El nivel de elegancia y cuidado artesanal es extraordinario. La invitación parecía una obra de arte y el sistema de confirmación hizo que gestionar las respuestas fuera facilísimo.', rating: 5 },
  { name: 'Camille & Antoine', text: 'Trabajar con FOLDÈ fue una auténtica alegría. Comprendieron nuestra estética a la perfección y crearon un recuerdo inolvidable.', rating: 5 },
  { name: 'Nina & Rafael', text: 'El panel de invitados en tiempo real lo cambió todo. Dejamos de perseguir respuestas y tuvimos cada detalle perfectamente organizado.', rating: 5 },
];

const spanishFaqs = [
  { q: '¿Cuánto tardará en estar lista mi invitación?', a: 'Cuando hayáis completado toda la información, vuestra invitación personalizada estará lista en un plazo de 5 a 7 días laborables, con las revisiones incluidas.' },
  { q: '¿Puedo modificar los datos después de enviarla?', a: 'Sí. La invitación es dinámica: podéis actualizar el horario, el lugar o cualquier detalle sin tener que reenviar el enlace.' },
  { q: '¿Hay un límite de invitados?', a: 'No. Todos los planes incluyen invitados ilimitados sin costes adicionales.' },
  { q: '¿Ofrecéis invitaciones en varios idiomas?', a: 'Sí. Nuestros planes admiten varios idiomas para que cada invitado pueda consultar la información en su lengua.' },
  { q: '¿Cómo funciona la confirmación de asistencia?', a: 'Cada invitación incluye un formulario interactivo. Los invitados confirman su asistencia y sus preferencias de menú en unos segundos, y las respuestas aparecen directamente en vuestro panel privado.' },
];

const frenchCarouselDescriptions = {
  'Luxe Gold': 'Opulente et dorée.', Pearl: 'Lumineuse et sereine.', 'Velvet Noir': 'Audacieuse et intemporelle.', 'Olive Grove': 'Botanique et fraîche.', Amber: 'Chaleureuse et rayonnante.', Mocha: 'Riche et profonde.', 'Crimson Royal': 'Royale et distinguée.', Sapphire: 'Océanique et raffinée.', 'Blush Ribbon': 'Une ouverture romantique ornée d’un ruban.', 'Grand Heritage': 'Une entrée cérémonielle majestueuse.', 'The Lace Edit': 'Dentelle délicate et romantisme intemporel.', 'Le Jardin': 'Un jardin luxuriant et romantique.', 'Lace Photo Scratch': 'Une révélation interactive tout en élégance.', 'Oasis Royale': 'Une célébration grandiose dans une oasis.', Tropical: 'Un paradis tropical vibrant.', 'Photo Scratch': 'Révélez votre plus beau souvenir.', 'Soft Scratch': 'Une révélation tout en douceur.', Cisnes: 'Une romance élégante entre cygnes.', Bloom: 'L’amour en pleine floraison.', Floral: 'Un écrin de fleurs.', 'Romantic Garden': 'Un jardin floral enchanté.', 'Blossom Oud': 'Une esthétique florale sublimée par le bois de oud.', 'Dolce Vita': 'La côte italienne baignée de soleil.', 'Velvet Garden': 'Un luxe contemporain aux détails botaniques.', 'Noir Gold': 'Un minimalisme sombre aux accents dorés.', Como: 'L’élégance d’une villa sur le lac de Côme.', Teatro: 'Un lever de rideau théâtral aux reflets dorés.', 'The Venue': 'Une célébration dans une villa de destination.', 'Sweet Love': 'Pêche, crème et tendresse romantique.', 'Botanical Floral': 'Des pétales délicats et un jardin en fleurs.', 'Big Entrance': 'Une entrée cinématographique au sceau doré.'
};

const frenchTestimonials = [
  { name: 'Isabelle & Hugo', text: 'FOLDÈ a transformé notre vision en une expérience numérique saisissante. Tous nos invités ont été captivés dès l’ouverture.', rating: 5 },
  { name: 'Priya & Daniel', text: 'Le niveau d’élégance et de savoir-faire est exceptionnel. Notre invitation ressemblait à une œuvre d’art et le RSVP a simplifié toutes les réponses.', rating: 5 },
  { name: 'Camille & Antoine', text: 'Collaborer avec FOLDÈ a été un vrai plaisir. L’équipe a parfaitement compris notre esthétique et créé un souvenir inoubliable.', rating: 5 },
  { name: 'Nina & Rafael', text: 'Le tableau de bord en temps réel a tout changé : plus de relances dispersées, chaque détail était parfaitement organisé.', rating: 5 }
];

const frenchFaqs = [
  { q: 'Sous quel délai mon invitation sera-t-elle prête ?', a: 'Une fois toutes vos informations transmises, votre invitation personnalisée est prête sous 5 à 7 jours ouvrés, révisions comprises.' },
  { q: 'Puis-je modifier les informations après l’envoi ?', a: 'Oui. Votre invitation est dynamique : vous pouvez mettre à jour le programme, le lieu ou les horaires sans renvoyer le lien.' },
  { q: 'Le nombre d’invités est-il limité ?', a: 'Non. Toutes les formules comprennent un nombre d’invités illimité, sans frais supplémentaires.' },
  { q: 'Proposez-vous des invitations multilingues ?', a: 'Oui. Nos formules prennent en charge plusieurs langues pour accueillir chaque invité dans la langue qui lui convient.' },
  { q: 'Comment fonctionne le RSVP ?', a: 'Chaque invitation comprend un formulaire interactif. Les invités répondent et indiquent leurs préférences de repas en quelques instants ; les données arrivent directement dans votre tableau de bord privé.' }
];

const homeCopy = {
  en: {
    ratingAria: 'Rated 4.9 out of 5 by more than 500 happy couples', rating: 'Chosen by 500+ happy couples',
    heroTitle: 'Premium Digital Wedding Invitations & Live Guest Tracking', heroText: 'FOLDÈ crafts bespoke digital wedding invitations with integrated RSVPs, photo galleries, and real-time guest management.',
    design: 'Design Your Invitation', explore: 'Explore Collections', from: 'From €49.90', tracking: 'Smart RSVP Tracking', unlimited: 'Unlimited Guests', concierge: 'Personal Concierge',
    collections: 'Collections', universes: 'Explore Our Exclusive Design Universes', universesText: 'Each collection is a distinct aesthetic universe — crafted to tell your unique love story.', viewAll: 'View All Collections',
    process: 'Our Process', processTitle: 'From Vision to Masterpiece, Step by Step', processText: 'A tailored journey where your ideas become an unforgettable experience.',
    packages: 'Packages', packagesTitle: 'Select the Perfect Package for Your Wedding', packagesText: 'Tailored packages designed to elevate your wedding invitation experience.',
  },
  es: {
    ratingAria: 'Valoración de 4,9 sobre 5 por más de 500 parejas satisfechas', rating: 'Elegida por más de 500 parejas felices',
    heroTitle: 'Invitaciones digitales de boda premium y gestión de invitados en tiempo real', heroText: 'FOLDÈ crea invitaciones digitales de boda a medida con confirmación de asistencia, galerías de fotos y gestión de invitados en tiempo real.',
    design: 'Diseñar vuestra invitación', explore: 'Explorar colecciones', from: 'Desde 49,90 €', tracking: 'Confirmaciones inteligentes', unlimited: 'Invitados ilimitados', concierge: 'Atención personalizada',
    collections: 'Colecciones', universes: 'Explorad nuestros universos de diseño exclusivos', universesText: 'Cada colección propone un universo estético propio, creado para contar vuestra historia de amor.', viewAll: 'Ver todas las colecciones',
    process: 'Nuestro proceso', processTitle: 'De la visión a una pieza única, paso a paso', processText: 'Un recorrido a medida en el que vuestras ideas se convierten en una experiencia inolvidable.',
    packages: 'Planes', packagesTitle: 'Elegid el plan perfecto para vuestra boda', packagesText: 'Planes pensados para elevar la experiencia de vuestra invitación de boda.',
  },
  fr: {
    ratingAria: 'Note de 4,9 sur 5 attribuée par plus de 500 couples', rating: 'Choisi par plus de 500 couples heureux',
    heroTitle: 'Faire-part de mariage numériques haut de gamme et suivi des invités en direct', heroText: 'FOLDÈ crée des faire-part de mariage numériques sur mesure avec RSVP intégré, galerie photo et gestion des invités en temps réel.',
    design: 'Créer votre invitation', explore: 'Explorer les collections', from: 'À partir de 49,90 €', tracking: 'Suivi RSVP intelligent', unlimited: 'Invités illimités', concierge: 'Conciergerie personnelle',
    collections: 'Collections', universes: 'Explorez nos univers graphiques exclusifs', universesText: 'Chaque collection propose un univers esthétique singulier, conçu pour raconter votre histoire d’amour.', viewAll: 'Voir toutes les collections',
    process: 'Notre méthode', processTitle: 'De votre vision à une création unique, étape par étape', processText: 'Un parcours sur mesure qui transforme vos idées en une expérience inoubliable.',
    packages: 'Formules', packagesTitle: 'Choisissez la formule idéale pour votre mariage', packagesText: 'Des formules conçues pour sublimer l’expérience de votre faire-part de mariage.'
  },
};

export default function Home({ locale = 'en' }) {
  const isSpanish = locale === 'es';
  const isFrench = locale === 'fr';
  const t = (english, spanish) => isFrench ? translateFr(english) : isSpanish ? spanish : english;
  const copy = homeCopy[locale] || homeCopy.en;
  const link = (path) => locale !== 'en' && path !== '/checkout' ? (path === '/' ? `/${locale}` : `/${locale}${path}`) : path;
  const descriptions = isSpanish ? spanishCarouselDescriptions : isFrench ? frenchCarouselDescriptions : null;
  const localizedCarouselItems = descriptions ? orderedCarouselItems.map((item) => ({ ...item, desc: descriptions[item.name] || item.desc })) : orderedCarouselItems;
  const localizedTestimonials = isSpanish ? spanishTestimonials : isFrench ? frenchTestimonials : testimonials;
  const localizedFaqs = isSpanish ? spanishFaqs : isFrench ? frenchFaqs : faqs;
  const carouselRef = useRef(null);
  const [showCta, setShowCta] = useState(false);
  const [hoveredCarouselItem, setHoveredCarouselItem] = useState(null);
  const [heroEnvelopeDismissed, setHeroEnvelopeDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowCta(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 310;
      carouselRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.main}>

      {/* ===================== HERO ===================== */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <div className={`${styles.heroRating} animate-fade-in-up`} aria-label={copy.ratingAria}>
              <div className={styles.ratingAvatars} aria-hidden="true">
                <img src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
                <img src="https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
                <img src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
                <img src="https://images.pexels.com/photos/3352398/pexels-photo-3352398.jpeg?auto=compress&cs=tinysrgb&w=100" alt="" />
              </div>
              <div className={styles.ratingCopy}><div><span>★★★★★</span><strong>4.9/5</strong></div><small>{copy.rating}</small></div>
            </div>
            <h1 className="heading-xl animate-fade-in-up delay-1">
              {copy.heroTitle}
            </h1>
            <p className="text-lg animate-fade-in-up delay-2">
              {copy.heroText}
            </p>
            <div className={`${styles.heroCtas} animate-fade-in-up delay-3`}>
              <Link href="/checkout" className="btn-primary">{copy.design}</Link>
              <Link href={link('/collections')} className="btn-secondary">{copy.explore}</Link>
            </div>

            <div className={`${styles.heroFeatures} animate-fade-in-up delay-4`}>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{copy.from}</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{copy.tracking}</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{copy.unlimited}</span>
              </div>
              <div className={styles.heroFeature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{copy.concierge}</span>
              </div>
            </div>
          </div>
          <div className={`${styles.heroPhone} animate-fade-in-up delay-2`}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch}></div>
              <div className={styles.phoneScreen}>
                <div className={`${styles.heroTemplateViewport} ${heroEnvelopeDismissed ? styles.heroTemplateReady : ''}`}>
                  <div className={styles.heroTemplateScale}>
                    <BordeauxTemplate
                      editMode={false}
                      autoPlaySimulation={false}
                      heroHeight="988px"
                      onEnvelopeDismissed={() => setHeroEnvelopeDismissed(true)}
                      data={{
                        themeId: "ivory",
                        partner1: "Anna",
                        partner2: "Tom",
                        date: "SEP 05, 2026",
                        ceremonyVenue: isSpanish ? "El lugar de vuestros sueños" : isFrench ? "Le lieu de vos rêves" : "Your Dream Venue",
                        language: locale,
                        receptionVenue: "",
                        videos: {
                          envelope: "https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4",
                          hero: "https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4"
                        },
                        sections: { showIntro: true, showVenue: true, showSchedule: true, showBoardingPass: false, showRSVP: true, showGallery: true }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CAROUSEL ===================== */}
      <section className={styles.universeSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{copy.collections}</span>
            <h2 className="heading-lg">{copy.universes}</h2>
            <p className="text-lg">{copy.universesText}</p>
          </div>
        </div>
        <div className={styles.carouselContainer}>
          <button className={styles.carouselArrow} onClick={() => scrollCarousel(-1)} aria-label={t('Scroll left', 'Desplazar hacia la izquierda')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="carousel-wrapper">
            <div className="carousel-track" ref={carouselRef}>
              {localizedCarouselItems.map((item, i) => (
                <Link href={link('/collections')} key={i} style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}>
                  <div
                    className="carousel-card"
                    onMouseEnter={() => setHoveredCarouselItem(i)}
                    onMouseLeave={() => setHoveredCarouselItem(null)}
                    style={{ paddingBottom: '2rem', transition: 'transform 0.2s' }}
                  >
                    <div className={styles.phoneFrame} style={{ width: '240px', height: '490px', margin: '0 auto' }}>
                      <div className={styles.phoneNotch}></div>
                      <div className={styles.phoneScreen}>
                        <TemplateHeroPreview
                          partner1={item.partner1}
                          partner2={item.partner2}
                          date={item.date}
                          videoSrc={item.video}
                          envelopeSrc={item.envelope}
                          showEnvelope
                          isImage={item.isImage || false}
                           active={hoveredCarouselItem === i}
                           preloadEnvelopeFrame
                           language={locale}
                        />
                      </div>
                    </div>
                    <div className="carousel-card-content" style={{ marginTop: '1rem' }}>
                      <h4>{item.name}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <button className={styles.carouselArrow} onClick={() => scrollCarousel(1)} aria-label={t('Scroll right', 'Desplazar hacia la derecha')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href={link('/collections')} className="btn-secondary">{copy.viewAll}</Link>
        </div>
      </section>

      {/* ===================== METHOD ===================== */}
      <section className={styles.methodSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{copy.process}</span>
            <h2 className="heading-lg">{copy.processTitle}</h2>
            <p className="text-lg">{copy.processText}</p>
          </div>
          <div className={styles.methodGrid}>
            {(isSpanish ? [
              { num: '01', title: 'Sesión inicial', desc: 'Una conversación dedicada a comprender vuestra visión, preferencias estéticas y los detalles de la celebración.' },
              { num: '02', title: 'Personalización del contenido', desc: 'Compartid fotografías, horarios, lugar y preferencias de confirmación; os acompañaremos en cada paso.' },
              { num: '03', title: 'Creación y diseño a medida', desc: 'Nuestro estudio crea vuestra invitación digital y perfecciona cada detalle.' },
              { num: '04', title: 'Publicación y celebración', desc: 'Recibid el enlace personalizado y compartidlo fácilmente con vuestros invitados.' },
            ] : isFrench ? [
              { num: '01', title: 'Entretien découverte', desc: 'Un échange dédié pour comprendre votre vision, vos préférences esthétiques et les détails de votre célébration.' },
              { num: '02', title: 'Personnalisation du contenu', desc: 'Partagez vos photos, votre programme, le lieu et vos préférences RSVP ; nous vous guidons à chaque étape.' },
              { num: '03', title: 'Création et design sur mesure', desc: 'Notre studio façonne votre invitation numérique et affine chaque détail avec soin.' },
              { num: '04', title: 'Mise en ligne et célébration', desc: 'Recevez votre lien personnalisé et partagez-le simplement avec tous vos invités.' },
            ] : [
              { num: '01', title: 'Discovery Session', desc: 'A dedicated exchange to explore your vision, aesthetic preferences, and event details.' },
              { num: '02', title: 'Content Personalization', desc: 'Share your photos, timeline, venue, and RSVP preferences — guided every step of the way.' },
              { num: '03', title: 'Bespoke Creation & Design', desc: 'Our atelier crafts your digital invitation and refines every detail to perfection.' },
              { num: '04', title: 'Launch & Celebration', desc: 'Receive your personalized invitation link and effortlessly share it with your guests.' },
            ]).map((step, i) => (
              <div key={i} className={styles.methodCard}>
                <span className={styles.methodNum}>{step.num}</span>
                <h3 className="heading-sm">{step.title}</h3>
                <p className="text-sm" style={{ marginTop: '0.75rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section className={styles.pricingSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{copy.packages}</span>
            <h2 className="heading-lg">{copy.packagesTitle}</h2>
            <p className="text-lg">{copy.packagesText}</p>
          </div>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div>
                <h3 className="heading-md">Standard</h3>
                 <p className="text-sm" style={{ marginTop: '0.5rem' }}>{t('Everything you need for an elegant, personalized invitation.', 'Todo lo necesario para una invitación elegante y personalizada.')}</p>
                <div className={styles.pricingPrice}>49.90 €</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> {t('Select from exclusive design universes', 'Elegid entre universos de diseño exclusivos')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Personalized with your colors & details', 'Personalización con vuestros colores y datos')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Interactive RSVP form', 'Formulario interactivo de confirmación')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Real-time guest dashboard', 'Panel de invitados en tiempo real')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Unlimited guests included', 'Invitados ilimitados incluidos')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Guest directory & table planner', 'Directorio de invitados y organización de mesas')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('No AI credits included', 'No incluye créditos de IA')}</li>
                </ul>
              </div>
              <Link href={link('/collections')} className="btn-secondary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}>{t('Select Standard', 'Elegir Estándar')}</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.pricingBadge}>{t('Most Popular', 'Más elegido')}</div>
              <div>
                <h3 className="heading-md">Premium</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem', opacity: 0.7 }}>{t('A self-service invitation dashboard with AI credits and priority support.', 'Un panel de autoservicio con créditos de IA y soporte prioritario.')}</p>
                <div className={styles.pricingPrice}>79.90 €</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> {t('Everything in Standard included', 'Todo lo incluido en Estándar')}</li>
                  <li><span className={styles.checkIcon}>✓</span> <strong>{t('5 AI image credits + 5 AI music credits', '5 créditos para imágenes con IA y 5 para música con IA')}</strong></li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Express 24h Dedicated Support', 'Atención prioritaria en 24 horas')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Self-service dashboard + priority support', 'Panel de autoservicio y soporte prioritario')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Custom sections (boarding pass, RSVP)', 'Secciones personalizadas (tarjeta de embarque, confirmación)')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Unlimited revisions', 'Revisiones ilimitadas')}</li>
                </ul>
              </div>
              <Link href={link('/collections')} className="btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem', backgroundColor: '#ffffff', color: '#5C3A1E', borderColor: '#ffffff', fontWeight: 700 }}>{t('Select Premium', 'Elegir Premium')}</Link>
            </div>
            <div className={styles.pricingCard}>
              <div>
                <h3 className="heading-md">{t('Custom', 'Expert')}</h3>
                <p className="text-sm" style={{ marginTop: '0.5rem' }}>{t('100% bespoke "Fait main" questionnaire onboarding, team review & site validation.', 'Cuestionario inicial completamente personalizado, revisión del equipo y validación del sitio.')}</p>
                <div className={styles.pricingPrice}>149.90 €</div>
                <ul className={styles.pricingList}>
                  <li><span className={styles.checkIcon}>✓</span> {t('100% bespoke questionnaire onboarding', 'Cuestionario inicial completamente personalizado')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Hand-crafted ("Fait main") art direction', 'Dirección artística creada a medida')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Custom Envelope, Hero video, Menu & Photos', 'Sobre, vídeo de portada, menú y fotografías personalizados')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Direct review & validation by our team', 'Revisión y validación directa por nuestro equipo')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Studio crafts and publishes your invitation after approval', 'El estudio crea y publica vuestra invitación tras la aprobación')}</li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Personal concierge & priority support', 'Atención personalizada y soporte prioritario')}</li>
                  <li><span className={styles.checkIcon}>✓</span> <strong>{t('5 AI image credits + 5 AI music credits', '5 créditos para imágenes con IA y 5 para música con IA')}</strong></li>
                  <li><span className={styles.checkIcon}>✓</span> {t('Everything included in Premium', 'Todo lo incluido en Premium')}</li>
                </ul>
              </div>
              <Link href={link('/collections')} className="btn-secondary" style={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}>{t('Select Custom', 'Elegir Expert')}</Link>
            </div>
          </div>
          <div className={styles.pricingAddons}>
            <p className="text-sm"><strong>{t('Optional Add-ons:', 'Complementos opcionales:')}</strong> {t('Video Cover — €19 · Custom Music — €19 · Additional Language — €19 · Multi-group Management — €29', 'Portada de vídeo — 19 € · Música personalizada — 19 € · Idioma adicional — 19 € · Gestión de varios grupos — 29 €')}</p>
          </div>
        </div>
      </section>

      {/* ===================== RSVP DASHBOARD ===================== */}
      <section className={styles.dashboardSection}>
        <div className="container">
          <div className={styles.dashboardInner}>
            <div className={styles.dashboardText}>
              <span className="label">{t('Dashboard', 'Panel')}</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>{t('Your Private Wedding Dashboard', 'Vuestro panel privado de boda')}</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>{t('Track every RSVP response, dietary preference, and guest status in real time — elegantly organized and always at hand.', 'Consultad en tiempo real cada confirmación, preferencia alimentaria y estado de los invitados, con toda la información organizada y siempre disponible.')}</p>
              <div className={styles.dashboardStats}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>127</span>
                  <span className={styles.statLabel}>{t('Attending', 'Asisten')}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>14</span>
                  <span className={styles.statLabel}>{t('Declined', 'No asisten')}</span>
                </div>
              </div>
              <ul className={styles.dashboardFeatures}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('Real-time RSVP response tracking', 'Seguimiento de confirmaciones en tiempo real')}
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('Clear organization at a glance', 'Organización clara de un vistazo')}
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('One-click data export', 'Exportación de datos con un clic')}
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('Seamless on mobile & desktop', 'Experiencia fluida en móvil y ordenador')}
                </li>
              </ul>
            </div>
            <div className={styles.dashboardVisual}>
              <div className={styles.dashboardMockup}>
                <div className={styles.mockupBar}>
                  <span></span><span></span><span></span>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Sophie & James</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>{t('Attending', 'Asiste')}</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Clara & Thomas</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>{t('Attending', 'Asiste')}</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#EE9441' }}></div>
                    <span>Marie Dupont</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(238, 148, 65, 0.1)', color: '#EE9441' }}>{t('Pending', 'Pendiente')}</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#e74c3c' }}></div>
                    <span>Paul Martin</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' }}>{t('Declined', 'No asiste')}</span>
                  </div>
                  <div className={styles.mockupRow}>
                    <div className={styles.mockupDot} style={{ backgroundColor: '#3ED660' }}></div>
                    <span>Emma Laurent</span>
                    <span className={styles.mockupBadge} style={{ backgroundColor: 'rgba(62, 214, 96, 0.1)', color: '#3ED660' }}>{t('Attending', 'Asiste')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{t('Client Stories', 'Historias de parejas')}</span>
            <h2 className="heading-lg">{t('Loved by Our Couples', 'La elección de nuestras parejas')}</h2>
            <p className="text-lg">{t('Read stories from couples who trusted us for their special day.', 'Descubrid las historias de parejas que confiaron en nosotros para un día tan especial.')}</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {localizedTestimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <p className={styles.testimonialName}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AUTONOMOUS OPTION ===================== */}
      <section className={styles.autonomousSection}>
        <div className="container">
          <div className={styles.autonomousInner}>
            <div className={styles.autonomousText}>
              <span className="label">{t('Studio Experience', 'Experiencia Studio')}</span>
              <h2 className="heading-lg" style={{ marginTop: '1rem' }}>{t('Prefer to Personalize at Your Own Pace?', '¿Preferís personalizar a vuestro ritmo?')}</h2>
              <p className="text-lg" style={{ marginTop: '1rem' }}>
                {t('The FOLDÈ Studio gives you complete creative control — input your details, select your collection, and craft your invitation seamlessly.', 'FOLDÈ Studio os da el control creativo: añadid vuestros datos, elegid una colección y cread la invitación con total fluidez.')}
              </p>
              <ul className={styles.autonomousFeatures}>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('Guided preparation — details, schedule, RSVP, accommodations', 'Preparación guiada: datos, horario, confirmación y alojamiento')}
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('FOLDÈ Collections — select a visual direction from our gallery', 'Colecciones FOLDÈ: elegid una dirección visual de nuestra galería')}
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('RSVP tracking & dashboard — monitor confirmations in real time', 'Confirmaciones y panel: consultad las respuestas en tiempo real')}
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {t('At your own pace — update your content whenever you wish', 'A vuestro ritmo: actualizad el contenido cuando queráis')}
                </li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/checkout" className="btn-primary">{t('Order Now', 'Crear invitación')}</Link>
                <Link href="/checkout" className="btn-secondary">{t('Start Live Preview', 'Abrir la vista previa')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">FAQ</span>
            <h2 className="heading-lg">{t('Frequently Asked Questions', 'Preguntas frecuentes')}</h2>
            <p className="text-lg">{t('Everything you need to know before getting started.', 'Todo lo que necesitáis saber antes de empezar.')}</p>
          </div>
          <div className={styles.faqList}>
            {localizedFaqs.map((faq, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{faq.q}</summary>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className={styles.finalCta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="heading-lg">{t('Bring Your Invitation to Life', 'Dad vida a vuestra invitación')}</h2>
          <p className="text-lg" style={{ marginTop: '0.5rem' }}>{t('Bespoke digital creations starting at €49.90', 'Creaciones digitales a medida desde 49,90 €')}</p>
          <Link href="/checkout" className="btn-primary" style={{ marginTop: '2rem' }}>{t('Design Your Invitation', 'Diseñar vuestra invitación')}</Link>
        </div>
      </section>

      {/* ===================== CONTACT SECTION ===================== */}
      <section className={styles.contactSection}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div className={styles.contactIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h2 className="heading-lg" style={{ fontSize: '2rem' }}>{t('Have Questions? Get in Touch', '¿Tenéis alguna pregunta? Escribidnos')}</h2>
          <p className="text-lg" style={{ marginTop: '0.75rem', color: '#888', lineHeight: 1.7 }}>
            {t('Whether you are exploring options or ready to begin, our team is here to assist you.', 'Tanto si estáis valorando opciones como si ya queréis empezar, nuestro equipo está aquí para ayudaros.')}
          </p>
          <a href="mailto:folde.wedding@gmail.com" className={styles.contactEmail}>
            folde.wedding@gmail.com
          </a>
          <div className={styles.contactDivider}>
            <div className={styles.contactDividerLine}></div>
            <span>{t('or', 'o')}</span>
            <div className={styles.contactDividerLine}></div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
            {t('Response within a few hours ✨', 'Respondemos en pocas horas ✨')}
          </p>
        </div>
      </section>

      {/* ===================== STICKY SCROLL CTA ===================== */}
      <div style={{
        position: 'fixed', bottom: '2rem', left: '50%', zIndex: 999,
        transform: `translateX(-50%) ${showCta ? 'translateY(0) scale(1)' : 'translateY(150%) scale(0.9)'}`,
        opacity: showCta ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pointerEvents: showCta ? 'auto' : 'none'
      }}>
        <Link href={link('/collections')} style={{
          backgroundColor: '#5C3A1E', color: '#fff',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 1.8rem', borderRadius: '40px',
          boxShadow: '0 8px 30px rgba(92, 58, 30, 0.35), 0 4px 10px rgba(0,0,0,0.1)',
          textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap', width: 'max-content'
        }}>
          {t('Design your invitation →', 'Diseñad vuestra invitación →')}
        </Link>
      </div>
    </div>
  );
}
