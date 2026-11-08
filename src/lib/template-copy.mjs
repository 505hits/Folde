export const templateCopy = {
 en: {eyebrow:'Wedding celebration',storyTitle:'Our story',storyText:'We look forward to celebrating this special day with you.',introTitle:'Our story begins here',introText:'Join us for a day filled with love and joy.',venueTitle:'Location',scheduleTitle:'Wedding timeline',menuTitle:'The menu',galleryTitle:'Our photos',giftTitle:'A note on gifts',giftText:'Your presence is our greatest gift.',countdownEyebrow:'Counting down to',countdownTitle:'Our Forever',days:'Days',hours:'Hours',minutes:'Min',seconds:'Sec'},
 fr: {eyebrow:'Notre mariage',storyTitle:'Notre histoire',storyText:'Nous avons hâte de célébrer cette journée avec vous.',introTitle:'Notre histoire commence ici',introText:'Rejoignez-nous pour une journée pleine d’amour et de joie.',venueTitle:'Le lieu',scheduleTitle:'Le programme',menuTitle:'Le menu',galleryTitle:'Nos photos',giftTitle:'Un mot sur les cadeaux',giftText:'Votre présence est notre plus beau cadeau.',countdownEyebrow:'Plus que quelques instants avant',countdownTitle:'Notre grand jour',days:'Jours',hours:'Heures',minutes:'Min',seconds:'Sec'},
 es: {eyebrow:'Nuestra boda',storyTitle:'Nuestra historia',storyText:'Estamos deseando celebrar este día tan especial con vosotros.',introTitle:'Nuestra historia comienza aquí',introText:'Acompañadnos en un día lleno de amor y alegría.',venueTitle:'El lugar',scheduleTitle:'El programa',menuTitle:'El menú',galleryTitle:'Nuestras fotos',giftTitle:'Sobre los regalos',giftText:'Vuestra presencia es nuestro mejor regalo.',countdownEyebrow:'Cuenta atrás para',countdownTitle:'Nuestro gran día',days:'Días',hours:'Horas',minutes:'Min',seconds:'Seg'}
};
const extraKeys = ['eyebrow','storyTitle','storyText','introTitle','introText','venueTitle','scheduleTitle','menuTitle','galleryTitle','giftTitle','giftText','countdownEyebrow','countdownTitle','days','hours','minutes','seconds'];
const extra = {
 it:['Il nostro matrimonio','La nostra storia','Non vediamo l’ora di festeggiare con voi.','La nostra storia inizia qui','Unitevi a noi per una giornata piena d’amore.','Il luogo','Il programma','Il menù','Le nostre foto','Un pensiero sui regali','La vostra presenza è il regalo più bello.','Conto alla rovescia per','Il nostro grande giorno','Giorni','Ore','Min','Sec'],
 de:['Unsere Hochzeit','Unsere Geschichte','Wir freuen uns darauf, diesen Tag mit euch zu feiern.','Hier beginnt unsere Geschichte','Feiert mit uns einen Tag voller Liebe.','Der Ort','Der Ablauf','Das Menü','Unsere Fotos','Ein Wort zu Geschenken','Eure Anwesenheit ist unser größtes Geschenk.','Wir zählen die Tage bis','Unser großer Tag','Tage','Stunden','Min','Sek'],
 pt:['O nosso casamento','A nossa história','Estamos ansiosos por celebrar este dia convosco.','A nossa história começa aqui','Juntem-se a nós num dia cheio de amor.','O local','O programa','O menu','As nossas fotos','Sobre os presentes','A vossa presença é o nosso maior presente.','Contagem decrescente para','O nosso grande dia','Dias','Horas','Min','Seg'],
 nl:['Onze bruiloft','Ons verhaal','We kijken ernaar uit om deze dag met jullie te vieren.','Ons verhaal begint hier','Vier met ons een dag vol liefde.','De locatie','Het programma','Het menu','Onze foto’s','Over cadeaus','Jullie aanwezigheid is ons mooiste cadeau.','Aftellen naar','Onze grote dag','Dagen','Uren','Min','Sec'],
 ar:['حفل زفافنا','قصتنا','نتطلع إلى الاحتفال بهذا اليوم معكم.','تبدأ قصتنا هنا','شاركونا يوماً مليئاً بالحب.','المكان','البرنامج','قائمة الطعام','صورنا','عن الهدايا','حضوركم هو أجمل هدية لنا.','العد التنازلي إلى','يومنا الكبير','أيام','ساعات','دقائق','ثوانٍ'],
 ru:['Наша свадьба','Наша история','Мы с нетерпением ждём праздника вместе с вами.','Здесь начинается наша история','Разделите с нами день, наполненный любовью.','Место','Программа','Меню','Наши фотографии','О подарках','Ваше присутствие — лучший подарок.','До нашего праздника','Наш особенный день','Дни','Часы','Мин','Сек']
};
for (const [language, values] of Object.entries(extra)) templateCopy[language] = Object.fromEntries(extraKeys.map((key,i) => [key,values[i]]));
const labelPacks = {
 en:['Date','With','Place','Gifts','View our gift wishes','Starter','Main','Dessert'],
 fr:['Date','Avec','Lieu','Cadeaux','Voir nos souhaits de cadeaux','Entrée','Plat','Dessert'],
 es:['Fecha','Con','Lugar','Regalos','Ver nuestros deseos de regalos','Entrante','Plato','Postre'],
 it:['Data','Con','Luogo','Regali','I nostri desideri','Antipasto','Piatto principale','Dolce'],
 de:['Datum','Mit','Ort','Geschenke','Unsere Geschenkwünsche','Vorspeise','Hauptgericht','Dessert'],
 pt:['Data','Com','Local','Presentes','Os nossos desejos','Entrada','Prato principal','Sobremesa'],
 nl:['Datum','Met','Plaats','Cadeaus','Onze cadeauwensen','Voorgerecht','Hoofdgerecht','Nagerecht'],
 ar:['التاريخ','مع','المكان','الهدايا','رغباتنا للهدايا','المقبلات','الطبق الرئيسي','الحلوى'],
 ru:['Дата','С кем','Место','Подарки','Наши пожелания','Закуска','Основное блюдо','Десерт']
};
for (const [language, values] of Object.entries(labelPacks)) Object.assign(templateCopy[language], Object.fromEntries(['date','with','place','gifts','giftButton','starter','main','dessert'].map((key,i) => [key,values[i]])));
export function localizedSignature(signature, language) {
 if (!signature) return signature;
 const locale = templateCopy[language] ? language : 'en';
 return {...signature,...(locale === 'en' ? {eyebrow:signature.eyebrow === 'Atelier de mariage' ? 'Wedding atelier' : signature.eyebrow} : templateCopy[locale]),...(signature.ornament === 'ISSUE 01' && locale !== 'en' ? {ornament:({fr:'NUMÉRO',es:'EDICIÓN',it:'EDIZIONE',de:'AUSGABE',pt:'EDIÇÃO',nl:'EDITIE',ar:'العدد',ru:'ВЫПУСК'}[locale] || '') + ' 01'} : {})};
}
export function weddingDateLabel(value,language='en') {
 const date=new Date(value);
 return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(language || 'en',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);
}
export function weddingDateParts(value, language = 'en') {
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return {month:'—',day:'—',year:'—'};
 const format = (options) => new Intl.DateTimeFormat(language, {...options,timeZone:'UTC'}).format(date);
 return {month:format({month:'short'}),day:format({day:'numeric'}),year:format({year:'numeric'})};
}
// Translate only recognised stock labels; never rewrite the couple’s custom wording.
export function localizedStockLabel(value, language, kind) {
 const key = String(value || '').toLowerCase().trim();
 const labels = templateCopy[language] || templateCopy.en;
 const courses = {starter:'starter','entrée':'starter',entrante:'starter',main:'main','main course':'main',plat:'main',plato:'main',dessert:'dessert',postre:'dessert'};
 const events = {ceremony:'ceremony','cérémonie':'ceremony',cocktail:'cocktail',dinner:'dinner','dîner':'dinner',party:'party','soirée':'party'};
 if (kind === 'course' && courses[key]) return labels[courses[key]];
 if (kind === 'event' && events[key]) return ({en:['Ceremony','Cocktail','Dinner','Party'],fr:['Cérémonie','Cocktail','Dîner','Soirée'],es:['Ceremonia','Cóctel','Cena','Fiesta'],it:['Cerimonia','Aperitivo','Cena','Festa'],de:['Trauung','Empfang','Abendessen','Feier'],pt:['Cerimónia','Cocktail','Jantar','Festa'],nl:['Ceremonie','Receptie','Diner','Feest'],ar:['المراسم','الاستقبال','العشاء','الحفل'],ru:['Церемония','Коктейль','Ужин','Вечеринка']}[language] || ['Ceremony','Cocktail','Dinner','Party'])[['ceremony','cocktail','dinner','party'].indexOf(events[key])];
 return value;
}
