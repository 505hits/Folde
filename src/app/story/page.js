import { pageAlternates } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import styles from "./vision.module.css";
import { localizeHref } from "@/lib/routes.mjs";

export const metadata = {
  title: "Our Studio | FOLDÈ Design — Wedding Invitations Designed by Hand",
  description: "FOLDÈ is a small design studio. Every envelope, watercolor scene and monogram is designed by hand by our team, then brought to life as a digital wedding invitation.",
  alternates: pageAlternates("en", "story"),
};

const PHOTOS = {
  chateau: { src: "/images/story/studio-chateau.webp", alt: ["Designing a watercolor château save-the-date in the FOLDÈ studio", "Création d’un save-the-date aquarelle avec un château dans l’atelier FOLDÈ", "Creación de un save the date en acuarela con un castillo en el estudio FOLDÈ"] },
  envelope: { src: "/images/story/studio-envelope.webp", alt: ["An ivory envelope with an embossed C & N monogram being designed", "Création d’une enveloppe ivoire avec un monogramme C & N en relief", "Diseño de un sobre marfil con un monograma C & N en relieve"] },
  villa: { src: "/images/story/studio-lake-villa.webp", alt: ["A lake villa watercolor framed with roses, designed for a save-the-date", "Une villa au bord d’un lac encadrée de roses, dessinée pour un save-the-date", "Una villa junto a un lago enmarcada con rosas, diseñada para un save the date"] },
};

export default function Vision({ locale = "en" }) {
  const i = locale === "fr" ? 1 : locale === "es" ? 2 : 0;
  const t = (...versions) => versions[i];
  const link = (path) => localizeHref(locale, path);

  const steps = [
    { title: t("The idea", "L’idée", "La idea"), text: t("We start from your story: a place that matters, your colors, the mood of the day. A few references are enough.", "Tout part de votre histoire : un lieu qui compte, vos couleurs, l’ambiance de la journée. Quelques références suffisent.", "Partimos de vuestra historia: un lugar especial, vuestros colores, el ambiente del día. Bastan unas pocas referencias.") },
    { title: t("The design", "Le dessin", "El diseño"), text: t("Our designers compose each element: the watercolor scene, the envelope, the monogram, the typography. Nothing comes out of an automatic generator.", "Nos designers composent chaque élément : la scène à l’aquarelle, l’enveloppe, le monogramme, la typographie. Rien ne sort d’un générateur automatique.", "Nuestro equipo de diseño compone cada elemento: la escena en acuarela, el sobre, el monograma, la tipografía. Nada sale de un generador automático.") },
    { title: t("The invitation comes to life", "L’invitation prend vie", "La invitación cobra vida"), text: t("We animate the design so your guests open the envelope on their phone, then find the schedule, the map and the RSVP.", "Nous animons le dessin : vos invités ouvrent l’enveloppe sur leur téléphone, puis découvrent le programme, le plan et le RSVP.", "Animamos el diseño: vuestros invitados abren el sobre en el móvil y descubren el programa, el mapa y la confirmación.") },
  ];

  const values = [
    { title: t("Made by people", "Fait par des personnes", "Hecho por personas"), text: t("Every design you see on FOLDÈ was drawn and assembled by our team, one piece at a time.", "Chaque modèle que vous voyez sur FOLDÈ a été dessiné et assemblé par notre équipe, pièce par pièce.", "Cada diseño que veis en FOLDÈ lo ha dibujado y montado nuestro equipo, pieza a pieza.") },
    { title: t("Paper details, on screen", "Le détail du papier, à l’écran", "El detalle del papel, en pantalla"), text: t("Embossed monograms, wax seals, textured envelopes: we keep the finesse of fine stationery in a digital invitation.", "Monogrammes en relief, sceaux de cire, enveloppes texturées : nous gardons la finesse de la belle papeterie dans une invitation numérique.", "Monogramas en relieve, sellos de lacre, sobres con textura: mantenemos la delicadeza de la buena papelería en una invitación digital.") },
    { title: t("Changes until it feels like you", "Ajusté jusqu’à ce qu’il vous ressemble", "Ajustado hasta que os represente"), text: t("Names, colors, wording, music: we adjust your invitation with you until it feels right.", "Prénoms, couleurs, textes, musique : nous ajustons votre invitation avec vous jusqu’à ce qu’elle soit juste.", "Nombres, colores, textos, música: ajustamos vuestra invitación con vosotros hasta que quede perfecta.") },
  ];

  const promises = [
    { title: t("Transparent pricing", "Tarifs transparents", "Precios transparentes"), text: t("One price, paid once. You know what you pay for and what you receive from the start.", "Un prix, payé une fois. Vous savez dès le départ ce que vous payez et ce que vous recevez.", "Un precio, pagado una vez. Desde el principio sabéis qué pagáis y qué recibís.") },
    { title: t("Lasting access", "Accès durable", "Acceso duradero"), text: t("Your invitation link stays online after the wedding and becomes a keepsake.", "Le lien de votre invitation reste en ligne après le mariage et devient un souvenir.", "El enlace de vuestra invitación sigue en línea después de la boda y se convierte en un recuerdo.") },
    { title: t("A real team to talk to", "Une vraie équipe à qui parler", "Un equipo real con quien hablar"), text: t("Questions or changes? Write to folde.wedding@gmail.com and a designer answers.", "Une question, une modification ? Écrivez à folde.wedding@gmail.com : notre équipe vous répond.", "¿Dudas o cambios? Escribid a folde.wedding@gmail.com y os responde nuestro equipo.") },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <span className="label animate-fade-in-up">{t("Our studio", "Notre atelier", "Nuestro estudio")}</span>
          <h1 className="heading-xl animate-fade-in-up delay-1">
            {t("Every design is made by hand, by our team", "Chaque modèle est dessiné à la main par notre équipe", "Cada diseño está hecho a mano por nuestro equipo")}
          </h1>
          <p className="text-lg animate-fade-in-up delay-2" style={{ maxWidth: "660px" }}>
            {t(
              "FOLDÈ is a small design studio. We do not generate invitations from a template engine: each envelope, each watercolor scene, each monogram is composed by our designers, then brought to life for your guests.",
              "FOLDÈ est un petit atelier de design. Nous ne générons pas les invitations avec un moteur de modèles : chaque enveloppe, chaque scène à l’aquarelle, chaque monogramme est composé par nos designers, puis prend vie pour vos invités.",
              "FOLDÈ es un pequeño estudio de diseño. No generamos invitaciones con un motor de plantillas: cada sobre, cada escena en acuarela y cada monograma lo compone nuestro equipo de diseño y luego cobra vida para vuestros invitados."
            )}
          </p>
        </div>
      </section>

      <section className={styles.studioSection}>
        <div className="container">
          <div className={styles.studioGrid}>
            <figure className={`${styles.studioPhoto} ${styles.studioMain}`}>
              <Image src={PHOTOS.chateau.src} alt={PHOTOS.chateau.alt[i]} width={1200} height={900} sizes="(max-width: 800px) 100vw, 60vw" priority />
              <figcaption>{t("A château scene, with the couple painted into the watercolor.", "Une scène de château, avec le couple peint dans l’aquarelle.", "Una escena de castillo, con la pareja pintada en la acuarela.")}</figcaption>
            </figure>
            <figure className={styles.studioPhoto}>
              <Image src={PHOTOS.envelope.src} alt={PHOTOS.envelope.alt[i]} width={1200} height={900} sizes="(max-width: 800px) 100vw, 40vw" />
              <figcaption>{t("An ivory envelope and its embossed C & N monogram.", "Une enveloppe ivoire et son monogramme C & N en relief.", "Un sobre marfil y su monograma C & N en relieve.")}</figcaption>
            </figure>
            <figure className={styles.studioPhoto}>
              <Image src={PHOTOS.villa.src} alt={PHOTOS.villa.alt[i]} width={1200} height={900} sizes="(max-width: 800px) 100vw, 40vw" />
              <figcaption>{t("A lake villa framed with roses, for a spring save-the-date.", "Une villa au bord d’un lac encadrée de roses, pour un save-the-date de printemps.", "Una villa junto a un lago enmarcada con rosas, para un save the date de primavera.")}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{t("How a design is born", "Comment naît un modèle", "Cómo nace un diseño")}</span>
            <h2 className="heading-lg">{t("From a sketch to the invitation your guests open", "De l’esquisse à l’invitation que vos invités ouvrent", "Del boceto a la invitación que abren vuestros invitados")}</h2>
          </div>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title} className={styles.valueCard}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="heading-sm">{step.title}</h3>
                <p className="text-sm" style={{ marginTop: "0.75rem" }}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.differenceSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{t("What we care about", "Ce qui compte pour nous", "Lo que nos importa")}</span>
            <h2 className="heading-lg">{t("Handmade design, digital delivery", "Un dessin fait main, une invitation numérique", "Diseño hecho a mano, entrega digital")}</h2>
          </div>
          <div className={styles.commitGrid}>
            {values.map((item) => (
              <div key={item.title} className={styles.commitCard}>
                <h3 className="heading-sm">{item.title}</h3>
                <p className="text-sm" style={{ marginTop: "0.75rem" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.commitmentSection}>
        <div className="container">
          <div className="section-header">
            <span className="label">{t("Our commitment", "Notre engagement", "Nuestro compromiso")}</span>
            <h2 className="heading-lg">{t("The FOLDÈ promise", "La promesse FOLDÈ", "La promesa FOLDÈ")}</h2>
          </div>
          <div className={styles.commitGrid}>
            {promises.map((item) => (
              <div key={item.title} className={styles.commitCard}>
                <h3 className="heading-sm">{item.title}</h3>
                <p className="text-sm" style={{ marginTop: "0.75rem" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="heading-lg">{t("Let’s design your invitation together", "Dessinons votre invitation ensemble", "Diseñemos juntos vuestra invitación")}</h2>
          <p className="text-lg" style={{ marginTop: "0.75rem" }}>{t("Choose a design and we will make it yours.", "Choisissez un modèle, nous en ferons le vôtre.", "Elegid un diseño y lo haremos vuestro.")}</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={link("/checkout")} className="btn-primary" style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)", borderColor: "var(--color-background)" }}>
              {t("Order Now", "Créer mon invitation", "Crear invitación")}
            </Link>
            <Link href={link("/collections")} className="btn-secondary" style={{ borderColor: "rgba(250,249,246,0.3)", color: "var(--color-background)" }}>
              {t("Explore the designs", "Voir les modèles", "Ver los diseños")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
