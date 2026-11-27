// Artículos en español, segunda tanda (noviembre de 2026). Escritos directamente
// en español para búsquedas en España, no traducidos del inglés. Los trámites del
// matrimonio civil vienen del portal administracion.gob.es (actualizado el 31 de
// marzo de 2026); la cifra de bodas, de la nota de prensa del INE sobre 2024. Los
// precios de FOLDÈ y las preguntas del formulario de confirmación se comprobaron en
// folde-wedding.com el 27 de noviembre de 2026. Los nombres de los ejemplos son ficticios.

import { pagePath } from "@/lib/routes.mjs";

const landing = pagePath("es", "landing");
const precios = pagePath("es", "packages");
const plantillas = pagePath("es", "collections");
const IMG = "/images/blog/folde-2026-11";
const portrait = (file) => ({ src: `${IMG}/${file}.webp`, width: 520, height: 1126, portrait: true });

export const authorEs = { name: "Equipo editorial de FOLDÈ", role: "Diseño de invitaciones y experiencia de los invitados", href: "/es/como-trabajamos", type: "Organization" };

const adminGob = { label: "administracion.gob.es — Matrimonio (actualizado el 31 de marzo de 2026)", href: "https://administracion.gob.es/pag_Home/Tu-espacio-europeo/derechos-obligaciones/ciudadanos/familia/pareja/matrimonio.html", note: "Quién tramita el acta o expediente previo (notario, letrado de la Administración de Justicia, encargado del Registro Civil) y ante quién se celebra la boda (notario, letrado, alcalde o concejal)." };
const ine = { label: "INE — Estadística de matrimonios, año 2024 (nota de prensa)", href: "https://ine.es/dyngs/Prensa/MNP2024.htm", note: "175.364 matrimonios registrados en España en 2024, un 1,7 % más que en 2023." };
const bodasNetEnvio = { label: "Bodas.net — Consejos sobre el envío de las invitaciones de boda", href: "https://www.bodas.net/articulos/consejos-sobre-el-envio-de-las-invitaciones-de-boda--c565", note: "Invitaciones de tres a cuatro meses antes de la boda; save the date de diez a doce meses antes." };
const bodasNetDigital = { label: "Bodas.net — Invitaciones de boda electrónicas", href: "https://www.bodas.net/articulos/invitaciones-de-boda-electronicas--c824", note: "Las invitaciones digitales siguen los mismos plazos que las de papel." };
const withjoy = { label: "Withjoy — ¿Qué es la fecha límite de confirmación?", href: "https://withjoy.com/glossary/what-is-rsvp-deadline/?l=es-ES", note: "Fecha límite más habitual: tres o cuatro semanas antes de la boda, con un recordatorio una semana antes del cierre." };
const productCheck = (what) => `<p>Los datos de FOLDÈ (precios, secciones de la invitación, preguntas del formulario de confirmación) se comprobaron en folde-wedding.com el <strong>27 de noviembre de 2026</strong>${what ? `, abriendo ${what}` : ""}. Los textos de ejemplo son originales y los nombres, inventados. Actualizamos el artículo cuando cambia una norma o un precio.</p>`;

export const originalPostsEsWave2 = [
  // 1. Boda civil
  {
    slug: "invitaciones-boda-civil",
    keyword: "invitaciones de boda civil",
    title: "Invitaciones de boda civil: 15 textos para el ayuntamiento, el juzgado o el notario",
    metaTitle: "Invitaciones de boda civil: 15 textos y qué incluir",
    description: "Boda civil en el ayuntamiento, ante notario o en una finca: qué debe decir la invitación, los trámites que conviene conocer y 15 textos listos para adaptar.",
    heroImage: "/images/blog/pexels/29821867.jpg",
    imageAlt: "Invitación de boda sobre una tela blanca",
    datePublished: "2026-11-27",
    readingTime: 8,
    author: authorEs,
    quickAnswer: "Una invitación de boda civil indica vuestros nombres, quién os casa y dónde (ayuntamiento, notaría o finca), la fecha y la hora, y después la celebración con su propia dirección. Si la firma es íntima y la fiesta llega más tarde, decidlo claramente para que nadie crea que se ha perdido la ceremonia.",
    ctaAfter: 2,
    sections: [
      {
        heading: "Tres situaciones, tres formas de escribirla",
        body: "<p>Antes de elegir el texto, identificad vuestro caso. La redacción sale casi sola.</p>",
        table: {
          caption: "¿Qué invitación necesitáis para una boda civil?",
          head: ["Situación", "Quién está invitado a la ceremonia", "Lo que el texto debe aclarar", "Textos"],
          rows: [
            ["Ceremonia civil y fiesta el mismo día", "Todos o casi todos", "Hora de la ceremonia y dirección de la celebración", "1 a 5"],
            ["Firma íntima, gran fiesta después", "Testigos y familia cercana", "Que la fiesta es otro día, con su fecha", "6 a 10"],
            ["Ceremonia civil en la finca", "Todos", "Quién oficia y el horario del día", "11 a 15"],
          ],
        },
      },
      {
        heading: "Lo que conviene saber antes de fijar la fecha",
        body: "<p>Algunos trámites del matrimonio civil influyen directamente en lo que escribís. Vienen de la información oficial de administracion.gob.es.</p><ul><li><strong>El expediente o acta previa</strong>: antes de casaros hay que tramitarlo ante un notario del domicilio de uno de los dos, ante un letrado de la Administración de Justicia o ante el encargado del Registro Civil. No enviéis invitaciones con fecha cerrada hasta tener la autorización.</li><li><strong>Quién os casa</strong>: según quién haya tramitado el expediente, la boda se celebra ante un notario, un letrado de la Administración de Justicia o un alcalde o concejal. Esto decide el lugar: una notaría, un juzgado o el ayuntamiento.</li><li><strong>Los testigos</strong>: el Código Civil exige dos testigos mayores de edad. Avisadles con tiempo, aunque no hace falta mencionarlos en la invitación.</li><li><strong>La boda civil es mayoría</strong>: en España se registraron 175.364 matrimonios en 2024 según el INE, y desde hace años hay más bodas civiles que religiosas. Nadie va a extrañarse de una invitación civil, así que no hace falta justificarla.</li></ul>",
        figure: { ...portrait("venue-and-directions-mobile"), alt: "Sección de lugar de una invitación digital con mapa y botón para llegar", caption: "Un mapa con indicaciones evita que los invitados busquen la entrada correcta del ayuntamiento o la notaría (FOLDÈ, interfaz en inglés, noviembre de 2026)." },
      },
      {
        heading: "Ceremonia civil y fiesta el mismo día: 5 textos",
        body: "<blockquote>1. Lucía y Javier se casan el sábado 12 de junio de 2027 a las 12:00 en el Ayuntamiento de Ronda. Después, os esperamos para celebrarlo en la Finca Los Olivos.</blockquote><blockquote>2. Nos casamos por lo civil y queremos que estéis allí. 12 de junio de 2027, 12:00, Ayuntamiento de Ronda. La fiesta sigue en la Finca Los Olivos.</blockquote><blockquote>3. Ana Martín y Pedro López, padres de Lucía, y Carmen Ruiz y José García, padres de Javier, tienen el placer de invitaros a la boda civil de sus hijos, que se celebrará el 12 de junio de 2027 en el Ayuntamiento de Ronda.</blockquote><blockquote>4. Diez minutos de ceremonia y una tarde entera de fiesta. Lucía y Javier, 12 de junio de 2027.</blockquote><blockquote>5. La ceremonia es breve y empieza puntual: os rogamos llegar a las 11:45.</blockquote><p>El texto 5 no es un anuncio, sino una nota práctica para añadir a cualquiera de los anteriores: las bodas en el ayuntamiento suelen ir en franjas cortas.</p>",
      },
      {
        heading: "Firma íntima, gran fiesta después: 5 textos",
        body: "<p>Cada vez más parejas firman con sus testigos y celebran semanas o meses después. Decidlo con naturalidad para que nadie piense que se ha perdido algo.</p><blockquote>6. ¡Ya estamos casados! Firmamos en petit comité y ahora queremos celebrarlo con vosotros el sábado 4 de septiembre de 2027 en la Masía Can Roca.</blockquote><blockquote>7. Lucía y Javier se casaron el 14 de mayo de 2027 ante notario. Os invitan a celebrar su matrimonio el 4 de septiembre en la Masía Can Roca.</blockquote><blockquote>8. El sí oficial fue con dos testigos. La fiesta, con todos vosotros.</blockquote><blockquote>9. Casados desde la primavera, os invitamos a una gran fiesta de boda con cena, música y vermut al día siguiente.</blockquote><blockquote>10. Para la firma elegimos la intimidad; para la celebración os queremos a todos. 4 de septiembre de 2027.</blockquote>",
      },
      {
        heading: "Ceremonia civil en la finca: 5 textos",
        body: "<p>Muchas parejas quieren la ceremonia en el mismo lugar que el banquete. Según quién oficie, puede ser la boda civil en sí o una ceremonia simbólica después de firmar en el juzgado o ante notario. En la invitación basta con dar la hora de la ceremonia; no hace falta explicar el trámite.</p><blockquote>11. Lucía y Javier se casan el 12 de junio de 2027 a las 18:00 en los jardines de la Finca Los Olivos. Ceremonia, cóctel, cena y baile en el mismo lugar.</blockquote><blockquote>12. 18:00 ceremonia entre olivos · 19:00 cóctel · 21:00 cena · 23:30 barra libre.</blockquote><blockquote>13. Nuestra ceremonia la oficiará nuestra amiga Marta. Traed pañuelos y ganas de bailar.</blockquote><blockquote>14. Os esperamos en la finca a las 17:30; habrá autobús desde la plaza del pueblo a las 17:00.</blockquote><blockquote>15. Ceremonia al aire libre: zapato cómodo recomendado, el césped no perdona los tacones finos.</blockquote>",
        figure: { ...portrait("digital-invitation-map-and-timeline-mobile"), alt: "Programa del día en una invitación digital, con la hora de cada momento", caption: "El programa muestra ceremonia, cóctel y cena en orden, cada uno con su hora (FOLDÈ, noviembre de 2026)." },
      },
      {
        heading: "Errores que llevan a los invitados al sitio equivocado",
        body: "<ul><li><strong>Poner «el juzgado» sin dirección</strong>: en las ciudades grandes hay varios edificios judiciales y registros civiles.</li><li><strong>Una hora aproximada</strong>: las ceremonias civiles en edificios públicos van en franjas cortas.</li><li><strong>Mezclar direcciones</strong>: ceremonia y celebración rara vez están en el mismo sitio; una dirección por momento.</li><li><strong>Enviar antes de la autorización</strong>: hasta tener el expediente resuelto y la fecha confirmada, mejor no cerrar nada.</li><li><strong>No avisar del autobús</strong>: si la finca está lejos, poned la hora y el punto de salida.</li></ul>",
      },
      {
        heading: "Una invitación de boda civil en versión digital",
        body: "<p>Una boda civil suele tener varios momentos y varias direcciones, y eso satura una tarjeta de papel. En una <a href=\"" + landing + "\">invitación de boda digital</a>, el anuncio queda corto y cada dato tiene su sitio: programa, mapa con indicaciones para la ceremonia y para la celebración, formulario de confirmación. Si os cambian la franja horaria, corregís la invitación y todos ven la nueva hora con el mismo enlace. Diseños sobrios como Pearl o Editorial encajan muy bien con una boda civil; podéis probarlos gratis con vuestros nombres desde la página de <a href=\"" + plantillas + "\">plantillas</a>.</p>",
        figure: { ...portrait("pearl-design-opening-mobile"), alt: "Diseño de invitación digital Pearl con una terraza pintada frente al mar", caption: "Pearl, un diseño FOLDÈ sobrio, ideal para una boda civil (noviembre de 2026)." },
      },
    ],
    faqs: [
      ["¿Quién puede casarnos por lo civil?", "Según quién haya tramitado el expediente, un notario, un letrado de la Administración de Justicia o un alcalde o concejal."],
      ["¿Cuántos testigos hacen falta en una boda civil?", "Dos testigos mayores de edad."],
      ["¿Se puede celebrar la boda civil en una finca?", "Depende de quién oficie. Muchas parejas firman en el juzgado o ante notario y hacen después una ceremonia simbólica en la finca; en la invitación basta con la hora de la ceremonia."],
      ["¿Cuándo enviar las invitaciones de una boda civil?", "Como en cualquier boda, de tres a cuatro meses antes, cuando ya tengáis la fecha confirmada."],
      ["¿Cómo invito si solo firmamos con los testigos?", "Anunciad la boda y la fiesta a la vez: «Ya estamos casados y queremos celebrarlo con vosotros el…»."],
    ],
    methodology: "<p>Los trámites (expediente o acta previa, autoridades que celebran la boda) proceden de administracion.gob.es, actualizado el 31 de marzo de 2026; el número de testigos, del Código Civil; la cifra de matrimonios, de la nota de prensa del INE sobre 2024. Los plazos de envío siguen las recomendaciones de Bodas.net.</p>" + productCheck("el diseño Pearl y las secciones de programa y lugar"),
    sources: [adminGob, ine, bodasNetEnvio],
  },

  // 2. Cómo hacer invitaciones online
  {
    slug: "como-hacer-invitaciones-de-boda-online",
    keyword: "cómo hacer invitaciones de boda online",
    title: "Cómo hacer invitaciones de boda online: 7 pasos, del texto a la confirmación",
    metaTitle: "Cómo hacer invitaciones de boda online en 7 pasos",
    description: "Los datos que hay que reunir, el diseño, el texto, la confirmación de asistencia, la prueba en el móvil y el envío por WhatsApp: cómo hacer vuestra invitación de boda online sin olvidar nada.",
    heroImage: `${IMG}/folde-live-preview-editor.webp`,
    imageAlt: "Editor de invitaciones online con vista previa en directo en un móvil",
    datePublished: "2026-11-27",
    readingTime: 8,
    author: authorEs,
    quickAnswer: "Para hacer una invitación de boda online: reunid primero los datos (fecha, lugares, horarios, fecha límite de confirmación), elegid un diseño, escribid un texto breve, añadid programa, mapa y formulario de confirmación, probadla en vuestro propio móvil y enviad el enlace con unas palabras personales. Con los datos preparados, se hace en una o dos horas.",
    ctaAfter: 2,
    sections: [
      {
        heading: "Paso 1: reunir los datos antes de abrir el editor",
        body: "<p>Casi todo el mundo empieza por el diseño y pierde tiempo. Haced lo contrario: apuntad primero todo lo que vuestros invitados necesitan saber.</p><ul><li>la fecha y, para cada momento (ceremonia, cóctel, banquete, fiesta), la hora y la dirección exacta;</li><li>la fecha límite de confirmación, acordada con el catering;</li><li>lo que queréis preguntar: asistencia, acompañante, alergias, autobús;</li><li>la información útil: código de vestimenta, aparcamiento, alojamientos cercanos;</li><li>cómo queréis tratar los regalos: lista de bodas o número de cuenta.</li></ul>",
      },
      {
        heading: "Paso 2: elegir el diseño",
        body: "<p>Elegid un diseño que se parezca a vuestra boda, no a la moda del momento: una finca en el campo, una boda en la playa o una boda en la ciudad no piden lo mismo. Comprobad que el texto se lee bien en una pantalla pequeña, que los colores encajan con la decoración y que la apertura no hace esperar demasiado. En FOLDÈ, la página de <a href=\"" + plantillas + "\">plantillas</a> tiene 47 diseños que podéis probar gratis con vuestros nombres antes de pagar nada.</p>",
        figure: { ...portrait("folde-creation-flow-names-mobile"), alt: "Primer paso para crear una invitación online, donde se escriben los nombres de la pareja", caption: "La creación empieza por vuestros nombres y la vista previa se actualiza al momento (FOLDÈ, noviembre de 2026)." },
      },
      {
        heading: "Paso 3: escribir un texto breve",
        body: "<p>En una invitación online, el anuncio no tiene que cargar con todo: el programa, las direcciones y la confirmación tienen su propia sección. Tres o cuatro líneas bastan: «Lucía y Javier se casan el sábado 12 de junio de 2027 en la Finca Los Olivos, y nos encantaría que estuvieras». Si buscáis ideas, nuestros <a href=\"/es/blog/textos-invitaciones-de-boda\">textos para invitaciones de boda</a> están ordenados por tono.</p>",
      },
      {
        heading: "Paso 4: añadir programa, lugares y alojamiento",
        body: "<p>Aquí está la gran diferencia con el papel. Poned cada momento del día con su hora, un mapa con botón de indicaciones para cada dirección y una sección de alojamiento si vienen invitados de fuera. El código de vestimenta, el menú o una galería de fotos pueden completarla, pero no rellenéis todas las secciones por rellenar: una invitación demasiado larga se lee peor.</p>",
        figure: { ...portrait("accommodations-and-dining-mobile"), alt: "Sección de alojamiento y restaurantes de una invitación digital", caption: "La sección de alojamiento os ahorra decenas de mensajes de «¿dónde dormimos?» (FOLDÈ, noviembre de 2026)." },
      },
      {
        heading: "Paso 5: configurar la confirmación de asistencia",
        body: "<p>El formulario sustituye a la tarjeta de confirmación y a las llamadas. En FOLDÈ pide nombre y apellidos, correo electrónico, asistencia (sí o no), si el invitado viene solo, acompañado o en familia, y sus alergias o dietas. Las respuestas llegan a vuestro panel en tiempo real. Escribid la fecha límite justo encima: «Confirmad antes del 15 de abril, por favor». Para elegir bien esa fecha, mirad nuestra guía de <a href=\"/es/blog/confirmacion-asistencia-boda\">confirmación de asistencia</a>.</p>",
        figure: { ...portrait("digital-invitation-rsvp-form-mobile"), alt: "Formulario de confirmación de una invitación digital con asistencia, acompañante y alergias", caption: "El formulario de confirmación de FOLDÈ (interfaz en inglés, noviembre de 2026)." },
      },
      {
        heading: "Paso 6: probarla en vuestro móvil",
        body: "<p>Abrid el enlace en vuestro móvil como si fuerais un invitado. Comprobad nombres y fecha, que cada botón de indicaciones lleve al sitio correcto, que la música no empiece demasiado fuerte, y enviaos una confirmación de prueba para ver dónde llega. Pedid a alguien que no conozca la organización que la lea en un minuto: si no sabe decir dónde y a qué hora tiene que ir, el texto es demasiado largo o está mal colocado.</p>",
      },
      {
        heading: "Paso 7: enviar el enlace y seguir las respuestas",
        body: "<p>En España, casi todo el mundo la enviará por WhatsApp, y está bien, pero nunca mandéis el enlace solo. Dos frases personales bastan: «¡Hola, tía Carmen! Nos casamos y nos haría muchísima ilusión que vinieras. Todo está en este enlace; confírmanos antes del 15 de abril». Enviadla de tres a cuatro meses antes de la boda, como recomienda Bodas.net, y tened preparada una versión impresa o una llamada para quien no use el móvil. Después, seguid las respuestas en el panel y recordad la fecha límite una semana antes a quien no haya contestado.</p>",
      },
      {
        heading: "¿Cuánto cuesta?",
        body: "<p>El precio de una invitación online no depende del número de invitados: no hay impresión, ni sobres, ni sellos. En FOLDÈ, a 27 de noviembre de 2026, el plan Estándar cuesta 29,90 $ en un único pago y la personalizáis vosotros; el plan Expert cuesta 149 $ y nuestro estudio la crea por vosotros. Los dos incluyen invitados ilimitados y el seguimiento de las confirmaciones. Todo el detalle está en la página de <a href=\"" + precios + "\">precios</a>.</p>",
      },
    ],
    faqs: [
      ["¿Cuánto se tarda en hacer una invitación de boda online?", "Una o dos horas si tenéis los datos preparados. Casi todo el tiempo se va en el texto y el programa, no en el diseño."],
      ["¿Se puede cambiar la invitación después de enviarla?", "Sí. Editáis la invitación y todos ven el cambio con el mismo enlace. Aun así, avisad directamente si cambia un horario."],
      ["¿Es gratis hacer la invitación online?", "En FOLDÈ, la vista previa con vuestros nombres es gratuita y sin cuenta. La publicación se paga una vez: 29,90 $ (Estándar) o 149 $ (Expert), a 27 de noviembre de 2026."],
      ["¿Cómo pongo el número de cuenta sin que quede brusco?", "Con una frase amable al final o en una sección aparte: «Vuestra presencia es nuestro mejor regalo; si queréis tener un detalle, os dejamos nuestro número de cuenta»."],
      ["¿Cuándo enviar la invitación online?", "De tres a cuatro meses antes de la boda, igual que una invitación de papel. El save the date, si lo hay, de diez a doce meses antes."],
    ],
    methodology: productCheck("el editor desde la página de plantillas y el formulario de confirmación en un móvil") + "<p>Los plazos de envío siguen las recomendaciones de Bodas.net para invitaciones de papel y digitales.</p>",
    sources: [bodasNetEnvio, bodasNetDigital],
  },

  // 3. Rústicas
  {
    slug: "invitaciones-de-boda-rusticas",
    keyword: "invitaciones de boda rústicas",
    title: "Invitaciones de boda rústicas: 5 estilos, 12 textos y cómo mantenerlas elegantes",
    metaTitle: "Invitaciones de boda rústicas: 5 estilos y 12 textos",
    description: "Kraft, flores silvestres, olivo, boho o rústico chic: 5 estilos de invitaciones rústicas, los colores que funcionan, 12 textos y la información práctica de una boda en una finca.",
    heroImage: "/images/blog/pexels/32994504.jpg",
    imageAlt: "Invitación de boda con detalles florales sobre una mesa",
    datePublished: "2026-11-27",
    readingTime: 8,
    author: authorEs,
    quickAnswer: "Una invitación rústica se apoya en materiales y motivos naturales (kraft, flores silvestres, ramas de olivo) y en una paleta suave: verde salvia, beis, terracota, rosa empolvado. Para que sea elegante, quedaos con una sola idea fuerte, una tipografía legible y mucho aire. Y como las fincas suelen estar a desmano, cuidad el mapa y el transporte tanto como la decoración.",
    ctaAfter: 2,
    sections: [
      {
        heading: "5 estilos de invitación rústica",
        body: "<p>«Rústico» abarca ambientes muy distintos. Elegid el que encaje con vuestro lugar.</p>",
        table: {
          caption: "¿Qué estilo rústico para qué boda?",
          head: ["Estilo", "Materiales y motivos", "Paleta", "Ideal para"],
          rows: [
            ["Kraft y cuerda", "Papel kraft, cuerda de yute, etiqueta", "Marrón, crema, verde", "Granero, boda DIY"],
            ["Flores silvestres", "Acuarela de amapolas, margaritas, lavanda", "Blanco, amarillo, lavanda", "Boda en el campo en pleno verano"],
            ["Olivo y eucalipto", "Ramas de olivo, eucalipto, hojas", "Verde salvia, blanco, dorado", "Cortijo, finca andaluza, almazara"],
            ["Boho", "Pampa, flores secas, letra manuscrita", "Terracota, arena, rosa empolvado", "Boda al atardecer, ceremonia al aire libre"],
            ["Rústico chic", "Papel grueso, dorado discreto, ramillete", "Marfil, verde oscuro, oro", "Masía, pazo o bodega"],
          ],
        },
      },
      {
        heading: "Los colores que funcionan (y los que cansan)",
        body: "<p>Las paletas rústicas más bonitas son suaves: verde salvia u oliva, beis, terracota, rosa empolvado, azul cielo. Recuerdan los materiales del lugar sin gritar. Lo que cansa enseguida: demasiados colores a la vez, un verde muy saturado o un fondo muy texturizado (madera, kraft oscuro) bajo un texto fino. En papel y en pantalla, el texto tiene que leerse: fondo claro, letra oscura, y la tipografía manuscrita solo para vuestros nombres.</p>",
        figure: { ...portrait("amber-design-countryside-opening-mobile"), alt: "Diseño de invitación digital Amber con un paisaje de campo pintado", caption: "Amber, un diseño FOLDÈ con tonos cálidos de campo (noviembre de 2026)." },
      },
      {
        heading: "12 textos para invitaciones rústicas",
        body: "<p><strong>Sencillos y cercanos</strong></p><blockquote>1. Lucía y Javier se casan entre olivos. Os esperamos el sábado 12 de junio de 2027 en el Cortijo El Almendral.</blockquote><blockquote>2. Un granero, guirnaldas de luces y mesas largas: nos casamos el 12 de junio de 2027 y os queremos allí.</blockquote><blockquote>3. Bajo los almendros de la Finca Los Olivos, Lucía y Javier se darán el sí quiero el 12 de junio de 2027 a las 18:00.</blockquote><blockquote>4. Botas recomendadas, buen humor obligatorio. Lucía y Javier, 12 de junio de 2027, Masía Can Roca.</blockquote><p><strong>Más poéticos</strong></p><blockquote>5. En tiempo de cerezas y noches largas, Lucía y Javier os invitan a su boda.</blockquote><blockquote>6. Entre viñedos y olivos empezaremos a escribir nuestra historia. Venid a leer la primera página con nosotros.</blockquote><blockquote>7. Donde el campo se junta con el cielo, el 12 de junio de 2027, celebraremos nuestro amor.</blockquote><blockquote>8. Después de muchas estaciones juntos, Lucía y Javier se casan el 12 de junio de 2027.</blockquote><p><strong>Con la información práctica del lugar</strong></p><blockquote>9. La finca está al final de un camino de tierra: seguid los globos blancos desde el pueblo.</blockquote><blockquote>10. La ceremonia es sobre césped: dejad los tacones finos en casa y traed algo de abrigo para la noche.</blockquote><blockquote>11. En la finca apenas hay cobertura: descargad el mapa antes de salir.</blockquote><blockquote>12. Autobús desde la plaza del pueblo a las 17:00 y vuelta a las 3:00. Decidnos si lo vais a usar al confirmar.</blockquote>",
      },
      {
        heading: "Lo que una boda en una finca debe contar además",
        body: "<p>El encanto de una finca, un cortijo o una masía es también lo que la complica para los invitados: caminos estrechos, poca cobertura, ningún hotel cerca, ceremonia al aire libre. La invitación tiene que responder a preguntas que una boda en la ciudad no plantea:</p><ul><li><strong>el acceso</strong>: dirección exacta, una referencia visible desde la carretera y coordenadas si el lugar sale mal en los mapas;</li><li><strong>el transporte</strong>: dónde aparcar y si hay autobús, con horarios de ida y vuelta;</li><li><strong>el alojamiento</strong>: casas rurales y hoteles cercanos, que en verano se llenan pronto;</li><li><strong>la ropa</strong>: césped, fresco por la noche, plan B si llueve;</li><li><strong>la cobertura</strong>: si es mala, pedid que guarden el mapa antes de salir.</li></ul>",
        figure: { ...portrait("dress-code-and-hotels-mobile"), alt: "Secciones de código de vestimenta y alojamiento de una invitación digital", caption: "Código de vestimenta y alojamiento, dos secciones imprescindibles en una boda en el campo (FOLDÈ, noviembre de 2026)." },
      },
      {
        heading: "Mantenerla elegante: 5 reglas",
        body: "<ul><li><strong>Una sola idea fuerte</strong>: kraft o flores en acuarela o encaje, no los tres.</li><li><strong>Aire</strong>: una invitación rústica recargada parece enseguida un mantel individual.</li><li><strong>Dos tipografías como máximo</strong>: una manuscrita para los nombres y otra sencilla para el resto.</li><li><strong>Ilustraciones mejor que fotos de banco de imágenes</strong>: una rama de olivo dibujada envejece mejor.</li><li><strong>El mismo ambiente en todo</strong>: invitación, cartel de bienvenida y minuta se responden.</li></ul>",
      },
      {
        heading: "Una invitación rústica en versión digital",
        body: "<p>Una <a href=\"" + landing + "\">invitación de boda digital</a> rústica conserva el ambiente (ilustraciones, colores, tipografía) y resuelve mejor que una tarjeta lo práctico: botón de indicaciones hasta la finca, sección de alojamiento, código de vestimenta y confirmación online con la pregunta del autobús. Entre los diseños de FOLDÈ, Amber, Olive Grove, Le Jardin, Bloom y Romantic Garden tienen aire de campo o de jardín; podéis probarlos gratis con vuestros nombres desde la página de <a href=\"" + plantillas + "\">plantillas</a>.</p>",
        figure: { ...portrait("olive-grove-design-opening-mobile"), alt: "Diseño de invitación digital Olive Grove con olivos pintados", caption: "Olive Grove, un diseño botánico de FOLDÈ (noviembre de 2026)." },
      },
    ],
    faqs: [
      ["¿Qué papel usar para una invitación rústica?", "El kraft es el más habitual, seguido del papel reciclado o con semillas. Comprobad que el texto se lea: sobre kraft oscuro, escribid en blanco o crema."],
      ["¿Qué colores van con una boda rústica?", "Tonos suaves y naturales: verde salvia, oliva, beis, terracota, rosa empolvado o azul cielo. Con dos o tres basta."],
      ["¿Rústico y elegante es compatible?", "Sí: mantened un material natural y añadid un solo toque refinado, como un dorado discreto o un papel grueso. El resto, sobrio."],
      ["¿Qué hay que añadir en la invitación de una boda en una finca?", "El acceso exacto, el aparcamiento o el autobús, el alojamiento cercano y una indicación sobre la ropa si la ceremonia es sobre césped."],
    ],
    methodology: productCheck("los diseños Amber y Olive Grove y las secciones de código de vestimenta y alojamiento") + "<p>Los plazos de envío siguen las recomendaciones de Bodas.net.</p>",
    sources: [bodasNetEnvio],
  },

  // 4. Confirmación de asistencia
  {
    slug: "confirmacion-asistencia-boda",
    keyword: "confirmación de asistencia boda",
    title: "Confirmación de asistencia a una boda: qué preguntar, fecha límite y 10 textos",
    metaTitle: "Confirmación de asistencia boda: fecha límite y 10 textos",
    description: "Qué preguntar en la confirmación de asistencia, cómo fijar la fecha límite con el catering, 10 textos para pedirla y cómo recordarla por WhatsApp sin incomodar.",
    heroImage: "/images/blog/pexels/34579982.jpg",
    imageAlt: "Papelería de boda elegante con sobre forrado y perlas",
    datePublished: "2026-11-27",
    readingTime: 7,
    author: authorEs,
    quickAnswer: "La confirmación de asistencia pregunta, como mínimo, el nombre del invitado, si viene o no y con cuántas personas. Añadid solo lo que de verdad necesitéis, como alergias o el autobús. Fijad la fecha límite a partir de la que os pida el catering: lo más habitual es tres o cuatro semanas antes de la boda, y algo más si tenéis que hacer el seating con calma.",
    ctaAfter: 2,
    sections: [
      {
        heading: "Qué preguntar en la confirmación",
        body: "<p>Cada pregunta de más reduce las respuestas completas. Partid de lo que necesitan el catering, el seating y el transporte, y nada más.</p>",
        table: {
          caption: "Las preguntas de una confirmación de asistencia",
          head: ["Pregunta", "¿Imprescindible?", "Para qué sirve"],
          rows: [
            ["Nombre y apellidos", "Sí", "Saber quién ha respondido, sobre todo si contestan varios de una familia"],
            ["Asistencia (sí / no)", "Sí", "El número del que depende todo lo demás"],
            ["Acompañante o número de personas", "Sí", "Evita sorpresas el día de la boda"],
            ["Alergias, intolerancias, dietas", "Recomendado", "El catering necesita saberlo con antelación"],
            ["Menú infantil", "Si invitáis a niños", "Los menús infantiles se encargan aparte"],
            ["Autobús", "Si lo ofrecéis", "Dimensionar el autobús y los horarios"],
            ["Un mensaje para los novios", "Opcional", "Bonito, pero nunca obligatorio"],
          ],
        },
      },
      {
        heading: "¿Qué fecha límite poner?",
        body: "<p>No la elijáis al azar: partid del día en que el catering y la finca quieren el número cerrado, y contad hacia atrás.</p><ul><li><strong>Tres o cuatro semanas antes de la boda</strong>: es la fecha límite más habitual y suficiente para una boda sencilla.</li><li><strong>Seis u ocho semanas antes</strong>: más cómodo si hay seating, muchos invitados que viajan o alojamientos que confirmar.</li><li><strong>Dejad una semana de margen</strong> antes de la fecha del catering para los recordatorios.</li></ul><p>Ejemplo: el catering quiere el número el 1 de mayo; fecha límite de confirmación, 15 de abril; recordatorio, 8 de abril.</p>",
      },
      {
        heading: "10 textos para pedir la confirmación",
        body: "<p><strong>Clásicos</strong></p><blockquote>1. Se ruega confirmación antes del 15 de abril de 2027.</blockquote><blockquote>2. Os agradeceríamos que confirmarais vuestra asistencia antes del 15 de abril, para poder organizarlo todo con cariño.</blockquote><blockquote>3. S. R. C. antes del 15 de abril.</blockquote><p><strong>Cercanos</strong></p><blockquote>4. ¿Vienes? Dínoslo antes del 15 de abril, nos ayuda muchísimo con la organización.</blockquote><blockquote>5. ☐ ¡Allí estaré, y pienso bailar! ☐ No podré ir, pero brindaré por vosotros desde lejos.</blockquote><blockquote>6. ¿Alguna alergia o dieta especial? Contádnoslo y el catering se encarga.</blockquote><blockquote>7. Confirmad antes del 15 de abril directamente desde esta invitación: es rápido y nos ahorra perseguiros por WhatsApp.</blockquote><p><strong>Para los casos delicados</strong></p><blockquote>8. Hemos reservado ……… plaza(s) en vuestro honor.</blockquote><blockquote>9. Hemos pensado esta celebración solo para adultos. Gracias por entenderlo.</blockquote><blockquote>10. Como la cena es con sitio asignado, necesitamos vuestra respuesta antes del 15 de abril para cerrar el seating.</blockquote><p>«S. R. C.» significa «se ruega contestación»: es la fórmula tradicional, todavía muy usada en invitaciones clásicas. El texto 8 es la forma más elegante de indicar cuántas personas están invitadas sin escribir «sin acompañante».</p>",
      },
      {
        heading: "Tarjeta, teléfono, QR o formulario online",
        body: "<p>En España, la confirmación por tarjeta con sobre de vuelta es poco habitual: lo tradicional era dar un teléfono de los novios o de los padres. El problema es que acabáis con respuestas repartidas entre llamadas, mensajes y conversaciones de WhatsApp. Un formulario online reúne todas en un mismo sitio, con las alergias y el número de personas. Podéis imprimir un código QR en la invitación de papel o usar directamente una <a href=\"" + landing + "\">invitación digital</a> con el formulario integrado.</p>",
        figure: { ...portrait("digital-invitation-rsvp-form-mobile"), alt: "Formulario de confirmación de una invitación digital con asistencia, acompañante y alergias", caption: "El formulario de confirmación de FOLDÈ: asistencia, acompañante o familia, alergias y dietas (interfaz en inglés, noviembre de 2026)." },
      },
      {
        heading: "Recordar sin incomodar",
        body: "<p>Siempre habrá quien no conteste, casi siempre por despiste. Una semana antes de la fecha límite, mandad un mensaje corto y personal, nunca en un grupo:</p><blockquote>«¡Hola, Marta! Cerramos el seating la semana que viene: ¿nos dices si vienes? Lo tienes todo en el enlace de la invitación».</blockquote><p>Con la confirmación online veis de un vistazo quién falta; en FOLDÈ, las respuestas aparecen en tiempo real en vuestro panel, sin hojas de cálculo a mano.</p>",
      },
    ],
    faqs: [
      ["¿Con cuánta antelación pedir la confirmación de asistencia?", "Lo más habitual es fijar la fecha límite tres o cuatro semanas antes de la boda, y seis u ocho si tenéis seating o muchos invitados que viajan."],
      ["¿Qué significa S. R. C. en una invitación?", "«Se ruega contestación». Es la fórmula clásica para pedir que el invitado confirme si asistirá."],
      ["¿Qué hago si un invitado no confirma?", "Mandadle un mensaje corto y personal una semana antes de la fecha límite. Si no responde, una llamada lo resuelve."],
      ["¿Se puede confirmar la asistencia por WhatsApp?", "Sí, pero las respuestas quedan dispersas. Un formulario online las reúne en un mismo sitio, con alergias y número de personas."],
      ["¿Cómo indicar que el invitado viene sin acompañante?", "Escribid «Hemos reservado una plaza en tu honor»: queda claro sin sonar seco."],
    ],
    methodology: "<p>La fecha límite habitual y el recordatorio una semana antes proceden de Withjoy; los plazos de envío, de Bodas.net.</p>" + productCheck("el formulario de confirmación y el panel de respuestas"),
    sources: [withjoy, bodasNetEnvio],
  },

  // 5. Clásicas (sustituye la traducción de «traditional-wedding-invitations»)
  {
    slug: "invitaciones-de-boda-clasicas",
    keyword: "invitaciones de boda clásicas",
    title: "Invitaciones de boda clásicas: estructura, fórmulas tradicionales y 8 ejemplos",
    metaTitle: "Invitaciones de boda clásicas: estructura y 8 ejemplos",
    description: "Quién invita, en qué orden y con qué fórmulas: las reglas de la invitación de boda clásica en España, 8 ejemplos completos y cómo modernizarla sin perder su elegancia.",
    heroImage: "/images/blog/pexels/29395419.jpg",
    imageAlt: "Sobre de invitación clásica sellado con lacre",
    datePublished: "2026-11-27",
    readingTime: 8,
    author: authorEs,
    quickAnswer: "La invitación clásica la firman los padres: arriba, a la izquierda, los padres de la novia y, a la derecha, los del novio; después, la fórmula de invitación al enlace de sus hijos, los nombres de los novios, la fecha y la hora, el lugar de la ceremonia y el del banquete, y al final «Se ruega confirmación» con un teléfono o un enlace.",
    ctaAfter: 2,
    sections: [
      {
        heading: "La estructura, de arriba abajo",
        body: "<p>La invitación clásica sigue un orden que viene de la costumbre más que de una norma escrita. Respetarlo es lo que le da su aire.</p>",
        table: {
          caption: "La estructura de una invitación clásica",
          head: ["Orden", "Mención", "Ejemplo"],
          rows: [
            ["1", "Padres de la novia (izquierda) y del novio (derecha)", "Ana Martín y Pedro López · Carmen Ruiz y José García"],
            ["2", "La fórmula de invitación", "tienen el placer de invitarle al enlace de sus hijos"],
            ["3", "Los nombres de los novios", "Lucía y Javier"],
            ["4", "Fecha y hora", "el sábado doce de junio de dos mil veintisiete, a las doce horas"],
            ["5", "Lugar de la ceremonia", "en la Iglesia de Santa María la Mayor de Ronda"],
            ["6", "El banquete", "y posteriormente a la cena que se servirá en la Finca Los Olivos"],
            ["7", "La confirmación", "Se ruega confirmación, con un teléfono o un enlace"],
          ],
        },
      },
      {
        heading: "Las fórmulas tradicionales y lo que significan",
        body: "<ul><li><strong>«tienen el placer de invitarle»</strong>: la fórmula clásica en nombre de los padres, de usted.</li><li><strong>«al enlace de sus hijos»</strong>: «enlace» es la palabra tradicional para la boda en las invitaciones formales.</li><li><strong>«que se celebrará» / «que tendrá lugar»</strong>: las dos son correctas; «tendrá lugar» suena algo más actual.</li><li><strong>«y posteriormente a la cena»</strong>: une ceremonia y banquete en una sola frase.</li><li><strong>«Se ruega confirmación» o «S. R. C.»</strong>: la petición de respuesta, al pie de la invitación.</li><li><strong>La fecha en letras</strong>: «el sábado doce de junio de dos mil veintisiete» es la marca de la invitación clásica; los números la hacen más moderna.</li></ul>",
      },
      {
        heading: "8 ejemplos de invitaciones clásicas",
        body: "<blockquote>1. Ana Martín y Pedro López · Carmen Ruiz y José García tienen el placer de invitarle al enlace de sus hijos Lucía y Javier, que se celebrará el sábado doce de junio de dos mil veintisiete, a las doce horas, en la Iglesia de Santa María la Mayor de Ronda, y posteriormente a la cena que se servirá en la Finca Los Olivos.</blockquote><blockquote>2. Los padres de los novios tienen el placer de invitarle al enlace de Lucía y Javier, que tendrá lugar el 12 de junio de 2027 a las 12:00 en el Ayuntamiento de Ronda. Se ruega confirmación.</blockquote><blockquote>3. Lucía Martín y Javier García, junto a sus familias, tienen el placer de invitarte a su boda, el sábado doce de junio de dos mil veintisiete.</blockquote><blockquote>4. Con la bendición de sus padres, Lucía y Javier contraerán matrimonio el sábado doce de junio de dos mil veintisiete en la Iglesia de Santa María la Mayor. Les esperamos después en la Finca Los Olivos.</blockquote><blockquote>5. Ana Martín, Carmen Ruiz y José García tienen el placer de invitarle al enlace de sus hijos Lucía y Javier.</blockquote><blockquote>6. Lucía y Javier tienen el placer de invitarle a su enlace, que se celebrará el doce de junio de dos mil veintisiete en la Iglesia de Santa María la Mayor de Ronda.</blockquote><blockquote>7. S. R. C. antes del 15 de abril · Lucía 600 000 000 · Javier 600 000 000.</blockquote><blockquote>8. Vuestra presencia es nuestro mejor regalo; si deseáis tener un detalle con nosotros: ES00 0000 0000 0000 0000 0000.</blockquote><p>El ejemplo 5 muestra cómo adaptar la fórmula cuando falta uno de los padres; el 3, cómo mantener el tono clásico cuando invitan los propios novios. El 8 resuelve con delicadeza el número de cuenta, una costumbre muy extendida en España.</p>",
        figure: { ...portrait("pearl-design-opening-mobile"), alt: "Diseño de invitación digital Pearl, sobrio y luminoso", caption: "Pearl, un diseño FOLDÈ sobrio que encaja con un texto clásico (noviembre de 2026)." },
      },
      {
        heading: "Usted o tú: cómo tratar a los invitados",
        body: "<p>La invitación clásica en nombre de los padres trata de usted («tienen el placer de invitarle»), porque se dirige también a amigos de la familia y compromisos. Cuando invitan los novios, lo natural es el tú o el vosotros. Lo importante es no mezclar: si el texto principal es de usted, mantenedlo en la confirmación y en el resto de la invitación.</p>",
      },
      {
        heading: "Modernizar una invitación clásica sin perder elegancia",
        body: "<ul><li><strong>Mantened la estructura y aligerad el texto</strong>: se puede seguir en tercera persona y suprimir una línea.</li><li><strong>Invitad «junto a vuestras familias»</strong>: el tono sigue siendo clásico y resuelve las familias reconstituidas.</li><li><strong>Una tipografía elegante mejor que adornos</strong>: una buena mayúscula romana y mucho aire son más clásicos que un marco dorado.</li><li><strong>Pasad lo práctico a lo digital</strong>: el anuncio sigue siendo tradicional, pero programa, mapa y confirmación están online.</li></ul>",
      },
      {
        heading: "Una invitación clásica en versión digital",
        body: "<p>Un texto clásico queda muy bien en una <a href=\"" + landing + "\">invitación de boda digital</a> sobria: la apertura de un sobre lacrado recuerda al papel y luego aparece el anuncio con la fecha en letras. Lo que cambia: cada invitado confirma online y el número de cuenta o la lista de bodas van en su propia sección, sin recargar el texto. Los diseños Grand Heritage, Velvet Noir, Pearl o, en la colección Signature, Nacre y Classic Burgundy encajan con una invitación clásica. Podéis probarlos gratis desde la página de <a href=\"" + plantillas + "\">plantillas</a>.</p>",
        figure: { ...portrait("digital-invitation-wax-seal-envelope-mobile"), alt: "Sobre lacrado al abrir una invitación digital", caption: "La apertura de un sobre lacrado en una invitación digital de FOLDÈ (noviembre de 2026)." },
      },
    ],
    faqs: [
      ["¿Quién aparece primero en una invitación clásica?", "Los padres de la novia, a la izquierda, y los del novio, a la derecha. Después, los nombres de los novios."],
      ["¿Qué significa «enlace» en una invitación?", "Es la palabra tradicional para referirse a la boda en las invitaciones formales: «el enlace de sus hijos»."],
      ["¿Hay que escribir la fecha en letras?", "En una invitación clásica, sí: «el sábado doce de junio de dos mil veintisiete». Los números le dan un tono más moderno."],
      ["¿Es de mal gusto poner el número de cuenta?", "En España es una costumbre muy extendida. Lo elegante es ponerlo al final o en una tarjeta o sección aparte, con una frase amable."],
      ["¿Cómo hacer con padres separados o si falta uno?", "Cada padre puede aparecer con su nombre, o la invitación puede firmarla la pareja «junto a sus familias», lo que evita tener que elegir."],
    ],
    methodology: "<p>Las fórmulas recogidas son las de la costumbre española en papelería de boda; no tienen valor legal y cada familia puede adaptarlas. Los plazos de envío siguen las recomendaciones de Bodas.net.</p>" + productCheck("el diseño Pearl y la apertura con sobre lacrado"),
    sources: [bodasNetEnvio, bodasNetDigital],
  },
];
