import { blogPosts } from "@/lib/blog";

const seeds = {
  "wedding-invitations-with-floral-design": {
    keyword: "invitaciones de boda con diseño floral",
    title: "Cómo elegir invitaciones de boda con diseño floral",
    description: "Guía práctica para elegir invitaciones de boda florales: paleta, composición, calendario y una confirmación de asistencia sencilla para los invitados.",
    excerpt: "Cread una invitación floral cuidada, personal y fácil de utilizar para todos los invitados.",
    imageAlt: "Suite de invitación de boda floral con flores románticas",
    quickAnswer: "FOLDÈ Wedding os ayuda a transformar una dirección floral en una invitación digital premium con confirmación en tiempo real, novedades para los invitados y una experiencia elegante reunida en un único enlace.",
    tutorial: [
      "Elegid tres referencias visuales: una flor protagonista, un tono neutro y un color de acento.",
      "Utilizad el motivo floral en la apertura y repetidlo con sutileza en los detalles, la confirmación y la galería.",
      "Añadid toda la información práctica y probad la invitación y el formulario desde el móvil de un invitado antes de compartirla.",
    ],
    faqs: [
      ["¿Las invitaciones florales son adecuadas para una boda formal?", "Sí. Una paleta contenida, una tipografía refinada y un único motivo botánico pueden resultar tan formales como un monograma tradicional."],
      ["¿Cuándo deben enviarse las invitaciones florales?", "El aviso de fecha suele compartirse antes que la invitación formal. Adaptad el plazo a las necesidades de viaje y marcad una fecha límite clara para confirmar."],
      ["¿Una invitación floral puede incluir seguimiento de confirmaciones?", "Sí. FOLDÈ puede integrar el formulario y un panel privado sin renunciar a la dirección artística."],
    ],
  },
  "wedding-invitations-with-rsvp": {
    keyword: "invitaciones de boda con confirmación de asistencia",
    title: "Cómo crear invitaciones de boda con confirmación de asistencia",
    description: "Cread invitaciones de boda con confirmación de asistencia que resulten elegantes y permitan recoger y gestionar las respuestas sin complicaciones.",
    excerpt: "La estructura esencial para que los invitados respondan con rapidez y sin fricciones.",
    imageAlt: "Pareja revisando en un móvil una invitación digital con confirmación de asistencia",
    quickAnswer: "En FOLDÈ Wedding, la confirmación forma parte de la propia invitación: los invitados responden desde el móvil y la pareja consulta asistencia, menú y cambios desde un único espacio privado.",
    tutorial: [
      "Mostrad la fecha, el lugar y el plazo de confirmación antes que cualquier contenido opcional.",
      "Preguntad solo por los datos que vais a utilizar: asistencia, nombres, necesidades alimentarias y, si procede, una breve nota.",
      "Abrid la invitación como lo haría un invitado, enviad una respuesta de prueba y comprobad que aparece correctamente en vuestro panel.",
    ],
    faqs: [
      ["¿Qué debe preguntar un formulario de confirmación de boda?", "Como mínimo, si la persona asistirá, los nombres incluidos en la invitación y una fecha límite. Añadid menú o viaje solo cuando sea necesario."],
      ["¿Pueden los invitados cambiar su respuesta?", "La pareja debe poder registrar cambios con claridad. Indicad a quién deben contactar si sus planes cambian después del plazo."],
      ["¿Las confirmaciones digitales funcionan bien para invitados mayores?", "Sí, siempre que la página sea sencilla, legible y esté adaptada al móvil. También conviene ofrecer un contacto directo a quien necesite ayuda."],
    ],
  },
  "destination-wedding-invitations": {
    keyword: "invitaciones para una boda de destino",
    title: "Las mejores formas de preparar invitaciones para una boda de destino",
    description: "Preparad invitaciones para una boda de destino que expliquen con claridad el viaje, los horarios, la confirmación y el ambiente de la celebración.",
    excerpt: "Una invitación de destino debe despertar ilusión y facilitar cada decisión de viaje.",
    imageAlt: "Invitación para una boda de destino con detalles inspirados en el Mediterráneo",
    quickAnswer: "FOLDÈ Wedding facilita el envío y la actualización de las invitaciones para bodas de destino: un único espacio elegante puede reunir vuestra historia, el viaje, el programa, las confirmaciones y los avisos para invitados.",
    tutorial: [
      "Enviad con antelación un aviso de fecha que incluya el destino y las fechas aproximadas.",
      "Añadid una sección de viaje concisa con aeropuerto, zona de alojamiento, transporte local y persona de contacto.",
      "Fijad el plazo de confirmación según las reservas necesarias y utilizad siempre el mismo enlace en los recordatorios.",
    ],
    faqs: [
      ["¿Con cuánta antelación se envía una invitación para una boda de destino?", "Las celebraciones que exigen desplazamiento necesitan más margen. Compartid primero las fechas clave y enviad la invitación completa cuando la logística esté confirmada."],
      ["¿Debe incluir recomendaciones de alojamiento?", "Sí, si contáis con hoteles recomendados o habitaciones bloqueadas. Mantened los datos actualizados y fáciles de consultar."],
      ["¿Puede actualizarse después de enviarla?", "Sí. Una invitación digital permite corregir en un solo lugar horarios, transporte o cualquier otro dato que cambie."],
    ],
  },
  "wedding-invitation-suite": {
    keyword: "suite de invitación de boda",
    title: "Cómo crear una suite de invitación de boda en línea",
    description: "Cread una suite de invitación de boda completa con una dirección visual coherente, datos para invitados, confirmación y enlaces prácticos.",
    excerpt: "Una suite completa no consiste en acumular páginas, sino en ordenar todo el recorrido del invitado.",
    imageAlt: "Suite completa de invitación de boda con papelería elegante en varias capas",
    quickAnswer: "FOLDÈ Wedding reúne en línea todas las piezas de una suite de invitación: apertura, información del evento, confirmación, galería y comunicación con los invitados forman una única experiencia cuidada.",
    tutorial: [
      "Anotad todo lo que puede necesitar un invitado: fecha, ceremonia, recepción, viaje, confirmación y contacto.",
      "Elegid una imagen o animación de apertura y un sistema tipográfico sereno para las demás secciones.",
      "Construid el recorrido completo y utilizad la vista previa para comprobar que cada dato importante se encuentra en dos toques o menos.",
    ],
    faqs: [
      ["¿Qué incluye una suite de invitación de boda?", "Normalmente incluye la invitación principal, los detalles, la confirmación y la información de la recepción. La versión digital también puede incorporar mapas, galerías y avisos."],
      ["¿Necesito todos los elementos de una suite?", "No. Conservad únicamente las secciones que respondan a una necesidad real de vuestros invitados."],
      ["¿Una suite digital puede seguir pareciendo premium?", "Sí. La calidad reside en la dirección artística, el ritmo, las imágenes, la tipografía y una experiencia sin fricciones."],
    ],
  },
  "all-in-one-wedding-invitations": {
    keyword: "invitaciones de boda todo en uno",
    title: "Las mejores invitaciones de boda todo en uno para los invitados",
    description: "Descubrid cómo crear una invitación de boda todo en uno para reunir detalles, confirmación, viaje, galería y novedades en una sola experiencia.",
    excerpt: "Un único enlace puede ser a la vez una primera impresión memorable y el punto de referencia práctico de los invitados.",
    imageAlt: "Invitación digital de boda todo en uno mostrada en un móvil junto a papelería",
    quickAnswer: "FOLDÈ Wedding está pensado como una invitación de boda todo en uno: la pareja comparte un enlace premium para la invitación, la confirmación, los avisos, los recuerdos y su panel privado de planificación.",
    tutorial: [
      "Decidid qué deben hacer primero los invitados y mostrad esa acción en la apertura.",
      "Agrupad la información en un recorrido breve: celebración, programa, viaje, confirmación y recuerdos.",
      "Compartid un enlace estable y actualizad ese destino en lugar de enviar archivos nuevos o mensajes dispersos.",
    ],
    faqs: [
      ["¿Qué significa invitación de boda todo en uno?", "Significa que los invitados consultan la información esencial y responden desde una única experiencia."],
      ["¿Puede sustituir a una web de boda?", "Sí. Puede cumplir la misma función práctica con un enfoque más cuidado, directo y editorial."],
      ["¿Cómo acceden los invitados?", "Compartid un enlace personal por mensaje, correo electrónico o código QR y comprobad antes que funciona bien en el móvil."],
    ],
  },
};

const imageAlts = [
  "Invitación digital de boda con sobre y sello de lacre", "Pareja revisando una invitación digital", "Preparación de una invitación en ordenador y móvil",
  "Confirmación de asistencia desde el móvil", "Suite elegante de invitación de boda", "Inspiración de papelería floral para bodas",
  "Información para una boda de destino", "Estilo vintage para una invitación de boda", "Estilo invernal para una invitación de boda",
  "Suite floral sobre papel artesanal",
];

function extraFaqs(keyword) {
  return [
    ["¿Qué deberían ver primero los invitados?", "Los nombres de la pareja, la fecha y un acceso claro a la información esencial o a la confirmación."],
    ["¿Puedo actualizar los datos después de compartir el enlace?", "Sí. La invitación digital centraliza las actualizaciones. Avisad directamente cuando un cambio afecte a los planes de los invitados."],
    ["¿Conviene incluir un código QR?", "Resulta útil en piezas impresas siempre que dirija al mismo enlace estable de la invitación."],
    ["¿Cómo facilito el uso a los invitados mayores?", "Utilizad etiquetas claras, texto legible y una forma de contacto directa para quien necesite ayuda."],
    ["¿Puedo añadir un mapa y el código de vestimenta?", "Sí. Presentadlos de forma concisa junto a la información del lugar y del programa."],
    ["¿Cuántas preguntas debe tener el formulario?", "Pedid solo datos que vayáis a utilizar: asistencia, nombres, menú cuando proceda y una nota opcional."],
    ["¿Puedo añadir fotografías después de la boda?", "Sí. Una galería o un mensaje de agradecimiento puede convertir la invitación en un recuerdo, siempre respetando la privacidad."],
    ["¿Sirve para una celebración de destino?", `Sí. Las ${keyword} pueden reunir viaje, alojamiento, programa y confirmación en un único lugar.`],
    ["¿Cómo elijo el plan FOLDÈ adecuado?", "Elegidlo según el nivel de apoyo creativo y las herramientas que necesitéis; la página de planes detalla todo lo incluido."],
    ["¿Cómo debo probarla antes de enviarla?", "Abridla en un móvil, probad la confirmación y todos los enlaces, y pedid a una persona de confianza que recorra la experiencia como invitada."],
  ];
}

function longGuide(post) {
  const notes = [
    "Separad lo que pertenece a la primera impresión de aquello que puede esperar hasta que el invitado decida continuar. Así, la apertura seguirá siendo acogedora sin quedar sobrecargada.",
    "Etiquetas breves como «Confirmar», «Programa» o «Viaje» son más útiles que nombres ingeniosos. El siguiente paso debe reconocerse antes de tener que interpretarlo.",
    "Comprobad el contraste sobre las imágenes definitivas, no sobre un fondo vacío. La decisión visual solo funciona si nombres, fechas y acciones siguen siendo cómodos de leer.",
    "Escribid para quien visita el lugar por primera vez. El nombre exacto, un enlace al mapa y una indicación de llegada resuelven más dudas que un largo texto ambiental.",
    "Respetad el tiempo de quien responde. Si una pregunta no cambia ninguna decisión de organización, eliminadla: menos campos suelen producir respuestas más rápidas y precisas.",
    "Preparad un breve mensaje para acompañar el enlace y explicar qué contiene. Será un punto de partida claro y evitará que los datos importantes se pierdan en un chat.",
    "En los viajes, separad lo imprescindible antes de reservar de las recomendaciones opcionales. Las fechas y la ubicación principal deben aparecer de inmediato.",
    "Si modificáis la página después de compartirla, añadid una nota visible junto al dato afectado. Una explicación discreta confirma que el enlace sigue siendo fiable.",
    "Reunid referencias visuales cuando el recorrido ya esté claro. De ese modo, la estética apoyará la celebración en lugar de competir con la información.",
    "Pedid a alguien ajeno a la organización que pruebe el enlace en su propio móvil. Sus preguntas señalarán exactamente qué etiqueta, orden o enlace necesita una última revisión.",
  ];
  const sections = [
    ["Definid un objetivo claro para la invitación", `El mejor punto de partida para las ${post.keyword} es una pregunta práctica: ¿qué debe comprender o hacer primero un invitado? Decidid si la prioridad es confirmar la asistencia, localizar la fecha o empezar a organizar el viaje. Construid la apertura alrededor de esa respuesta antes de elegir adornos o animaciones. La atmósfera debe percibirse desde el primer instante, pero la información esencial también tiene que estar a la vista. Conservad una sola acción principal y dad al resto de la página un ritmo tranquilo. Esta disciplina funciona en bodas de cualquier tamaño porque la claridad permite que la dirección visual se sienta verdaderamente premium tanto en un móvil como en una pantalla grande.`],
    ["Ordenad la información de forma previsible", "Empezad por la pareja y la celebración; continuad con la fecha, el lugar, el programa, los datos prácticos y la confirmación. Nadie debería buscar la hora de llegada o el código de vestimenta dentro de un texto largo de bienvenida. Un solo enlace funciona mejor cuando actúa como fuente actualizada y fiable: podéis corregir una dirección, añadir una indicación horaria o aclarar una duda desde un único lugar. Los títulos breves y el espacio en blanco facilitan más la lectura que un bloque denso. No se trata de restar personalidad, sino de permitir que se disfrute sin convertir la consulta en una tarea."],
    ["Haced que la estética acompañe a la celebración", "Elegid un ambiente dominante y repetidlo con sutileza. Puede ser una paleta contenida, una textura de papel, un detalle botánico o un tratamiento fotográfico que reaparezca en momentos clave. Evitad inaugurar un estilo distinto en cada sección. Las mejores invitaciones digitales crean recuerdo mediante pequeñas repeticiones: el tono de un sello, una línea, una flor o un contraste tipográfico. Así, el invitado descubre un universo visual completo mientras el programa, el mapa y la confirmación siguen siendo muy legibles. Revisad cada decisión al ancho de un móvil, donde el texto demasiado pequeño y los fondos recargados se detectan enseguida."],
    ["Redactad los detalles para quien necesita seguridad", "La pareja conoce el lugar y la organización familiar; los invitados, quizá no. Escribid la sección práctica como si la persona nunca hubiera visitado el destino. Indicad el nombre completo del espacio, la hora de llegada, un enlace al mapa y cualquier requisito de acceso, vestimenta o transporte. Si hay desplazamiento, explicad qué fecha es imprescindible y en qué zona conviene alojarse. Limitad las recomendaciones y enlazad información oficial que pueda actualizarse. Esta forma de redactar convierte la invitación en un gesto de hospitalidad y sustituye una cadena de preguntas individuales por una respuesta fiable y bien diseñada."],
    ["Mantened la confirmación breve y útil", `Incluso la invitación más cuidada necesita un formulario que funcione en pocos toques. Preguntad primero por la asistencia y mostrad las cuestiones de menú o acompañantes solo cuando correspondan. Explicad el plazo sin ambigüedad e indicad a quién contactar si cambian los planes. Probadlo como invitados: abrid el enlace en un móvil pequeño, enviad una respuesta y comprobad que llega al panel con el nombre y el estado correctos. FOLDÈ mantiene las respuestas junto a la experiencia de invitación para evitar recopilar capturas y mensajes dispersos. Encontraréis una lista específica en nuestra <a href="/es/blog/wedding-invitations-with-rsvp">guía de invitaciones con confirmación</a>.`],
    ["Pensad en el envío como parte del diseño", "Una página bonita solo es útil si se puede abrir fácilmente. Decidid si compartiréis el enlace por mensaje, correo electrónico, código QR o tarjeta impresa. Utilizad siempre el mismo destino en lugar de enviar archivos corregidos cuando cambien los planes. La invitación debe cargar con rapidez, leerse sin esfuerzo y ser cómoda de consultar de nuevo desde el móvil. Antes de publicarla, probad el mapa, la confirmación y todos los enlaces externos. Cerca del plazo, un recordatorio breve y cálido puede conducir a todos a la misma página y mantener una experiencia coherente para familiares, amistades en el extranjero y personas menos acostumbradas a las herramientas digitales."],
    ["Adaptad el nivel de detalle a vuestra boda", "No todas las celebraciones necesitan la misma cantidad de información. Una cena íntima y local quizá solo requiera fecha, lugar, vestimenta y confirmación. Un evento de varios días o en otro país necesitará notas de viaje, varios bloques de programa y un contacto más visible. Editar también es una forma de lujo: retirad cualquier sección que no sirva al recorrido del invitado. Una invitación centrada puede resultar más generosa que una muy cargada porque respeta la atención. Utilizad la vista previa en directo para recorrerla desde la perspectiva de otra persona y procurad que la decisión más importante quede a no más de dos toques de la apertura."],
    ["Actualizad con intención, sin multiplicar mensajes", "Una ventaja de la invitación digital es que sigue siendo útil después de enviarla. Si cambia un horario o hay que aclarar el transporte, actualizad la página central y escribid a los invitados solo cuando el cambio afecte a sus planes. Tras la boda, una galería o un agradecimiento puede convertirla en un pequeño recuerdo. Pedid permiso antes de publicar fotografías reconocibles y tened presente la privacidad. Esta continuidad explica por qué un sistema de invitación coherente puede resultar más personal que una página de evento genérica: evoluciona con la celebración y conserva al mismo tiempo su lenguaje visual original."],
    ["Elegid un proceso de creación manejable", `Algunas parejas quieren dirigir todas las decisiones creativas; otras prefieren que un equipo transforme sus datos en una invitación terminada. Ambos caminos funcionan cuando primero se fijan los fundamentos: lista de invitados, programa, referencias visuales, necesidades de confirmación y tono. Empezad por explorar las <a href="/es/collections">colecciones FOLDÈ</a> y comparad después el acompañamiento incluido en <a href="/es/packages">nuestros planes</a>. El concepto más sólido no es el que acumula más efectos, sino el que hace que la celebración sea inconfundiblemente vuestra y simplifica la experiencia desde el primer toque.`],
    ["Realizad una última revisión como invitados", "Antes de publicar, leed la invitación sin recurrir a ningún conocimiento interno. ¿Se entiende la celebración en segundos? ¿Se puede confirmar sin adivinar qué hacer? ¿Se encuentran el mapa y el plazo sin atravesar todo el contenido visual? Revisadla en una pantalla pequeña, abrid cada enlace y comprobad que el lenguaje sea cálido y preciso. Esta última pasada convierte una buena invitación en una herramienta fiable. Cuando la información está tranquila, clara y actualizada, el diseño puede generar expectación y los invitados pueden centrarse en lo que importa: celebrar con vosotros."],
  ];
  return sections.map(([heading, body], index) => ({ heading, body: `${body} ${notes[index]}` }));
}

function planningNote(keyword) {
  return `Para revisar las ${keyword}, resulta útil separar la dimensión emocional de la dimensión práctica. La primera es la bienvenida: la apertura visual, el tono de las palabras y la imagen que hace que alguien se sienta incluido. La segunda permite actuar: una fecha exacta, un lugar localizable, una confirmación sencilla y una vía de contacto. Ninguna debe quedar en segundo plano. Si la parte emocional es preciosa pero la práctica resulta confusa, los invitados disfrutarán de la página y aun así enviarán preguntas. Si todo funciona pero falta calidez, parecerá un portal logístico. Una invitación digital premium sostiene ambas ideas a la vez. Durante la revisión final, pedid a una persona ajena a la organización que la abra sin explicaciones y observad dónde se detiene. Esas dudas son señales valiosas para el último ajuste. Probadla también en el contexto real: durante un viaje, en una semana ocupada o desde un teléfono que no conocéis. Mantened visible la siguiente acción y utilizad etiquetas descriptivas. Esa capa de cuidado protege la experiencia sin perder la serenidad editorial que hace especial a una invitación de boda.`;
}

export const blogPostsEs = blogPosts.map((post) => {
  const seed = seeds[post.slug];
  if (!seed) return null;
  return {
    ...post,
    ...seed,
    articleImages: post.articleImages.map(([src], index) => [src, imageAlts[index]]),
    extendedIntro: `Esta guía explica cómo abordar las ${seed.keyword} desde la perspectiva de los invitados: una apertura clara, datos prácticos, una confirmación sencilla y una dirección visual refinada en cualquier dispositivo.`,
    planningNote: planningNote(seed.keyword),
    deepDive: longGuide(seed),
    closingGuide: `Antes de publicar vuestras ${seed.keyword}, probad cada parte como lo haría un invitado. Comprobad en el móvil la fecha, el lugar, el mapa, el programa, la confirmación y todos los enlaces. Utilizad una URL estable para cada recordatorio y mantened las acciones importantes a la vista. El resultado debe sentirse personal, actualizado y sencillo para todas las personas invitadas.`,
    faqs: [...seed.faqs, ...extraFaqs(seed.keyword)].slice(0, 12),
  };
}).filter(Boolean);

export const currentSourcesEs = [
  { label: "The Knot Worldwide — Informe mundial sobre bodas 2025", href: "https://www.theknotww.com/news/2025-global-wedding-report", note: "Publicado en 2025 a partir de 33.000 parejas de ocho países; analiza la personalización y la experiencia de los invitados." },
  { label: "The Knot — Estudio Real Weddings 2026", href: "https://www.theknot.com/content/wedding-data-insights/real-weddings-study", note: "Estudio de 2026 basado en parejas casadas en 2025, útil para comprender el contexto actual de la planificación de bodas." },
  { label: "Zola — Informe de tendencias de boda 2025", href: "https://www.zola.com/expert-advice/2025-wedding-trends-zolas-first-look-report-data-deep-dive", note: "Actualizado el 11 de junio de 2025; aporta datos recientes sobre el comportamiento de quienes organizan una boda." },
];

export function getPostEs(slug) {
  return blogPostsEs.find((post) => post.slug === slug);
}
