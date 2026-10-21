import { blogPath, pagePath } from "@/lib/routes.mjs";

const landing = pagePath("es", "landing");
const plantillas = pagePath("es", "collections");
const precios = pagePath("es", "packages");

// Artículos escritos directamente en español (España), no traducidos.
export const originalPostsEs = [
  {
    slug: "invitaciones-de-boda-originales",
    keyword: "invitaciones de boda originales",
    title: "Invitaciones de boda originales: 15 ideas que vuestros invitados sí van a recordar",
    metaTitle: "Invitaciones de boda originales: 15 ideas para sorprender",
    description: "Ideas de invitaciones de boda originales, de papel y digitales: formatos, textos, detalles y lo que conviene no sacrificar por la originalidad.",
    heroImage: "/images/blog/pexels/32994504.jpg",
    imageAlt: "Invitación de boda original con detalles florales sobre una mesa",
    datePublished: "2026-10-21",
    readingTime: 8,
    quickAnswer: "Una invitación original no es la más rara, sino la que solo podría ser vuestra: una frase con vuestro humor, una foto con historia, un formato que encaje con la boda. Eso sí, la fecha, el lugar y cómo confirmar tienen que entenderse a la primera.",
    sections: [
      { heading: "Antes de buscar ideas: lo que no puede faltar", body: "<p>Nombres, fecha, hora, lugar de la ceremonia y del banquete, y una fecha límite para confirmar asistencia. Si la invitación es tan creativa que alguien tiene que preguntaros por WhatsApp a qué hora empieza, ha fallado. Partid de esa base y jugad con todo lo demás.</p>" },
      { heading: "Ideas con el formato", body: "<ul><li><strong>Invitación que se abre como un sobre</strong> en el móvil, con animación y música. Es el formato de las <a href=\"" + landing + "\">invitaciones de boda digitales</a> de FOLDÈ.</li><li><strong>Billete de avión o de tren</strong> para una boda de destino, con la «puerta de embarque» como lugar del banquete.</li><li><strong>Póster de cine</strong>, con vosotros como protagonistas y los padrinos en los créditos.</li><li><strong>Portada de periódico</strong>: «Última hora: Lucía y Pablo se casan».</li><li><strong>Etiqueta de vino</strong> si os casáis en una bodega.</li><li><strong>Tarjeta para rascar</strong> que descubre la fecha.</li></ul>" },
      { heading: "Ideas con el texto", body: "<p>A menudo lo más original es simplemente escribir como habláis. Algunos ejemplos:</p><ul><li>«Después de diez años, tres pisos y un perro, hemos decidido hacerlo oficial.»</li><li>«Nos casamos. Sí, de verdad. El 12 de junio de 2027.»</li><li>«Os invitamos a la boda. La barra libre corre de nuestra cuenta; el baile, de la vuestra.»</li><li>«Lucía ha dicho que sí. Pablo todavía no se lo cree.»</li></ul><p>Tenéis muchos más en nuestra recopilación de <a href=\"" + blogPath("es", "textos-invitaciones-de-boda") + "\">textos para invitaciones de boda</a>.</p>" },
      { heading: "Ideas con fotos y vídeo", body: "<ul><li>Una foto de cuando os conocisteis junto a una de ahora.</li><li>Un vídeo corto de la pedida (si hay buena calidad y os apetece compartirlo).</li><li>Una ilustración vuestra a partir de una foto.</li><li>La foto del lugar de la boda, con el texto encima: dice más que cualquier descripción.</li></ul>" },
      { heading: "Detalles que marcan la diferencia", body: "<ul><li>Una canción que suene al abrir la invitación.</li><li>Una cuenta atrás hasta el día de la boda.</li><li>Una sección de «preguntas frecuentes» con humor: ¿pueden venir niños?, ¿hay autobús?, ¿qué me pongo?</li><li>Una galería donde los invitados suban sus fotos después de la boda.</li></ul><p>Todo esto es mucho más fácil en una invitación digital, porque no añade coste de imprenta. Podéis verlo en nuestras <a href=\"" + plantillas + "\">plantillas de invitaciones</a>.</p>" },
      { heading: "Lo original también tiene que ser práctico", body: "<p>Tres comprobaciones antes de enviar:</p><ol><li>Que alguien que no sepa nada de la boda entienda cuándo y dónde es en cinco segundos.</li><li>Que se lea bien en un móvil, que es donde la va a abrir casi todo el mundo.</li><li>Que confirmar asistencia sea un clic, no un mensaje que tengáis que apuntar vosotros a mano.</li></ol>" },
    ],
    ctaAfter: 1,
    faqs: [
      ["¿Cómo hacer una invitación de boda original y barata?", "Lo más económico es una invitación digital: un solo pago, sin imprenta ni sellos, y podéis añadir música, fotos o vídeo sin coste extra."],
      ["¿Con cuánta antelación se envían las invitaciones de boda?", "Lo habitual es entre tres y cuatro meses antes. Para bodas de destino, mejor seis meses, o enviar antes un save the date."],
      ["¿Qué poner en una invitación de boda original?", "Lo mismo que en una clásica (nombres, fecha, lugar, confirmación), pero con vuestro tono: una frase personal, una foto con historia o un formato que encaje con la boda."],
    ],
  },
  {
    slug: "textos-invitaciones-de-boda",
    keyword: "textos para invitaciones de boda",
    title: "Textos para invitaciones de boda: más de 20 ejemplos, de clásicos a divertidos",
    metaTitle: "Textos para invitaciones de boda: más de 20 ejemplos",
    description: "Frases y textos para invitaciones de boda clásicos, modernos, divertidos y con niños, más cómo redactar la confirmación, el dress code y el regalo.",
    heroImage: "/images/blog/pexels/36617804.jpg",
    imageAlt: "Invitación de boda impresa con un texto elegante y un sobre",
    datePublished: "2026-10-21",
    readingTime: 8,
    quickAnswer: "Un buen texto de invitación de boda dice quién se casa, cuándo, dónde y antes de qué fecha hay que confirmar. A partir de ahí, elegid el tono: formal si invitan los padres, cercano si escribís vosotros, o con humor si os pega.",
    sections: [
      { heading: "Lo que tiene que decir el texto", body: "<p>Vuestros nombres (y los de los padres, si son ellos quienes invitan), día, hora, lugar de la ceremonia y del banquete, y la fecha límite para confirmar. Si mandáis una <a href=\"" + landing + "\">invitación de boda digital</a>, el botón de confirmación sustituye a la tarjeta de respuesta, pero la fecha límite tiene que seguir escrita.</p>" },
      { heading: "Textos clásicos", body: "<ul><li>«Juan García y María López, Antonio Ruiz y Carmen Díaz tienen el placer de invitaros al enlace de sus hijos Lucía y Pablo, que se celebrará el sábado 12 de junio de 2027 a las 18:00 en la iglesia de San Pedro.»</li><li>«Lucía y Pablo tienen el placer de invitaros a su boda, que se celebrará el 12 de junio de 2027 en la Finca Los Olivos.»</li><li>«Con la alegría de compartir este día, Lucía y Pablo os invitan a su enlace.»</li><li>«Junto a sus familias, Lucía y Pablo os invitan a celebrar su boda.»</li></ul>" },
      { heading: "Textos modernos y cercanos", body: "<ul><li>«¡Nos casamos! Y no sería lo mismo sin vosotros.»</li><li>«Hemos elegido fecha, lugar y, sobre todo, con quién queremos vivirlo.»</li><li>«El 12 de junio de 2027 empieza lo mejor. Venid a celebrarlo.»</li><li>«Lucía y Pablo se casan. Solo faltáis vosotros.»</li><li>«Un sí, una fiesta y vosotros. Ese es el plan.»</li></ul>" },
      { heading: "Textos divertidos", body: "<p>El humor funciona si os representa. Una frase graciosa basta; si toda la invitación es un chiste, la información se pierde.</p><ul><li>«Por fin nos casamos. Nuestras madres ya pueden dejar de preguntar.»</li><li>«Habrá comida, bebida y baile. Lo de la ceremonia es breve, lo prometemos.»</li><li>«Pablo pidió matrimonio. Lucía dijo que sí antes de que terminara la frase.»</li><li>«Hemos compartido piso, sofá y contraseña de Netflix. Lo siguiente era el altar.»</li><li>«Se ruega puntualidad: el novio lleva diez años esperando este día.»</li></ul>" },
      { heading: "Con niños o en familia", body: "<ul><li>«Martina y Hugo tienen el placer de invitaros a la boda de sus papás.»</li><li>«Papá y mamá se casan, y nos han prometido tarta.»</li><li>«Ya somos familia. Ahora, además, nos casamos.»</li></ul>" },
      { heading: "Confirmación, dress code y regalo", body: "<p>Son las frases que más dudas generan. Algunas que funcionan:</p><ul><li>Confirmación: «Os agradeceremos que confirméis vuestra asistencia antes del 15 de abril.»</li><li>Sin niños: «Hemos pensado esta celebración solo para adultos. Gracias por entenderlo.»</li><li>Regalo: «Vuestra presencia es nuestro mejor regalo. Si queréis tener un detalle con nosotros, os dejamos nuestro número de cuenta.»</li><li>Dress code: «Etiqueta: cóctel. Colores claros bienvenidos.»</li></ul>" },
      { heading: "Probad el texto en la invitación", body: "<p>Un texto que queda bien en un documento puede quedar largo en la pantalla de un móvil. Lo mejor es verlo ya maquetado: en FOLDÈ podéis escribir vuestro texto sobre cualquiera de las <a href=\"" + plantillas + "\">plantillas</a> y ver la vista previa antes de pagar. Los precios, con pago único, están en la <a href=\"" + precios + "\">página de precios</a>. Y si buscáis inspiración más allá del texto, echad un vistazo a estas <a href=\"" + blogPath("es", "invitaciones-de-boda-originales") + "\">ideas de invitaciones de boda originales</a>.</p>" },
    ],
    ctaAfter: 3,
    faqs: [
      ["¿Quién aparece primero en la invitación de boda?", "En las invitaciones clásicas, los padres de la novia y después los del novio. Si escribís vosotros, el orden de los nombres es libre."],
      ["¿Cuándo hay que pedir la confirmación?", "Normalmente entre cuatro y seis semanas antes de la boda, según el plazo que os pida el catering."],
      ["¿Cómo pedir dinero como regalo sin que quede mal?", "Con una frase sencilla que ponga por delante la presencia de los invitados, y el número de cuenta al final, sin rodeos."],
    ],
  },
];
