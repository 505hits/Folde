// English articles, wave 4 of the November 2026 plan (docs/seo/blog-plan-2026-11.md):
// the last new topics left in the keyword export. Written individually. Product
// details and screenshots were checked on folde-wedding.com on 2026-11-18;
// etiquette points cite the sources read that day. Wording samples are original;
// names are fictional.

import { IMG, author, shot, stamps } from "@/lib/articles-en";
import { live, knotShower, knotTimingDated } from "@/lib/articles-en-wave2";

const portrait = (file) => ({ src: `${IMG}/${file}.webp`, width: 520, height: 1126, portrait: true });
const w4 = {
  blushRibbon: portrait("blush-ribbon-design-opening-mobile"),
  tropical: portrait("tropical-design-opening-mobile"),
  pearl: portrait("pearl-design-opening-mobile"),
  como: portrait("como-design-video-background-mobile"),
  dolceVita: portrait("dolce-vita-design-photo-background-mobile"),
  amber: portrait("amber-design-countryside-opening-mobile"),
  oliveGrove: portrait("olive-grove-design-opening-mobile"),
  theVenue: portrait("the-venue-design-villa-opening-mobile"),
  jardin: portrait("le-jardin-design-opening-mobile"),
  bloom: portrait("bloom-floral-design-opening-mobile"),
  guestGallery: portrait("guest-photo-gallery-qr-code-mobile"),
};

const check = (designs) => `<p>Product details come from a hands-on check of folde-wedding.com on <strong>November 18, 2026</strong>, in Chromium (Playwright 1.65) at a 390×844 phone size. We opened ${designs} from the collections page, tapped the envelope and scrolled the sections; the screenshots in this guide were taken during that check and show each design’s demo names. Prices were read on the packages page the same day. We did not submit an RSVP on a live wedding. FOLDÈ Wedding publishes this guide and sells digital wedding invitations.</p>`;

const knotTea = { label: "The Knot — 22 Bridgerton-themed bridal shower ideas for the fanciest tea party ever (updated Apr. 15, 2024)", href: "https://www.theknot.com/content/tea-party-bridal-shower-theme", note: "Pastel palette (blush, light blue, lilac, sage, pale yellow); tea rooms, hotel banquet rooms, historic estates or a garden; finger sandwiches, scones and petits fours; formal or semi-formal attire." };
const knotCivil = { label: "The Knot — What invitation wording should we use for a civil ceremony?", href: "https://www.theknot.com/content/invitation-wording-for-civil-ceremony", note: "When the civil ceremony happened months earlier, say so (“We’re married!”) and invite guests to the later celebration." };
const knotReception = { label: "The Knot — The only guide to reception-only wedding invitations (updated Jun. 19, 2024)", href: "https://www.theknot.com/content/reception-only-invites-invitation-wording", note: "Make clear the ceremony already happened (“a celebration of their marriage”) and give guests a way to RSVP." };
const knotRustic = { label: "The Knot — 32 rustic wedding invitations for your country-chic affair (updated Jun. 22, 2021)", href: "https://www.theknot.com/content/rustic-wedding-invitations", note: "Rustic stationery weaves in organic elements like wood textures and nature-inspired hues; examples include woodgrain, greenery, chalkboard and watercolor countryside designs." };
const knotCard = { label: "The Knot — What to write in a bridal shower card (updated Mar. 12, 2025)", href: "https://www.theknot.com/content/what-to-write-in-a-bridal-shower-card", note: "Be sincere, supportive and celebratory; sign with the names of those invited to the shower; address a couples shower card to both partners." };
const hallmarkCard = { label: "Hallmark Ideas — Bridal shower wishes: what to write in a bridal shower card (Keely Chace, Jul. 1, 2019)", href: "https://ideas.hallmark.com/articles/wedding-ideas/bridal-shower-wishes-what-to-write-in-a-bridal-shower-card/", note: "Shower cards are often read aloud, so keep humor gentle; etiquette traditionally reserves “congratulations” for the wedding." };
const wcag = { label: "W3C — Understanding WCAG 2.2, Success Criterion 1.4.3 Contrast (Minimum)", href: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html", note: "Text needs a contrast ratio of at least 4.5:1 with its background, or 3:1 for large text." };

export const originalPostsEnWave4 = [
  {
    slug: "tea-party-bridal-shower-invitations",
    keyword: "tea party bridal shower invitations",
    title: "Tea Party Invitations for a Bridal Shower: 18 Wording Examples and What to Include",
    metaTitle: "Tea Party Bridal Shower Invitations: 18 Wording Examples",
    description: "What to put on a tea party bridal shower invitation, when to send it, which theme details to add, and 18 original wording examples.",
    excerpt: "Afternoon tea, garden tea or high tea: what to put on the invitation, plus 18 wording examples.",
    intro: "A tea party is one of the easiest bridal shower themes to set on the invitation: an afternoon time, a pastel palette and a hint of the menu tell guests what kind of party it is before they read the details. This guide covers what a tea party shower invitation must say, when to send it, which theme details are worth adding, and 18 wording examples, from classic afternoon tea to a playful “love is steeping” line.",
    heroImage: "/images/blog/pexels/11503508.jpg",
    imageAlt: "Old paper envelope with a floral design, suited to a tea party invitation",
    datePublished: "2026-11-18",
    readingTime: 7,
    author,
    quickAnswer: "A tea party bridal shower invitation names the bride and the host, says it is a tea, gives an afternoon date and time, the full address, a dress code if there is one, and how and by when to RSVP. Send it four to six weeks ahead, about two months for travelers, and invite only people who are also invited to the wedding.",
    tool: { variant: "wording", event: "shower", title: "Write your tea party invitation", subtitle: "Add the bride and the host, pick a tone, then add “afternoon tea” to the first line." },
    ctaAfter: 2,
    sections: [
      {
        heading: "What a tea party shower invitation must say",
        body: `<p>The tea theme changes the tone, not the essentials. Guests still need to know who it is for, who is hosting, when, where and how to reply.</p>`,
        table: {
          caption: "Tea party bridal shower invitation checklist",
          head: ["Line", "Example", "Why it matters"],
          rows: [
            ["Event and theme", "“Afternoon tea in honor of…”", "Sets the time of day and the dress"],
            ["Guest of honor", "Emma Carter", "Use the name guests know"],
            ["Host", "Hosted by Claire Martin", "Tells guests who to reply to"],
            ["Date and time", "Sunday, May 10 · 2 to 5 pm", "Teas are usually afternoon events; give an end time if the venue is booked"],
            ["Place", "The Rose Tea Room, 14 Elm Street", "Full address; add parking if it is a home or garden"],
            ["Dress code", "Garden party attire · hats welcome", "Optional, but guests ask"],
            ["RSVP", "Reply to Claire by April 24", "At least two weeks before the shower"],
            ["Registry", "One line or a link", "The one invitation where it is expected"],
          ],
        },
      },
      {
        heading: "When to send it, and who to invite",
        body: `<p>The Knot’s shower etiquette applies to a tea like any other shower: send invitations <strong>four to six weeks before</strong>, about <strong>two months</strong> ahead when guests travel, and ask for replies at least two weeks before the date. The host sends the invitations, and everyone invited should also be invited to the wedding.</p>
<p>Tea parties work best at a size where everyone can sit: a tea room or a living room seats fewer people than a brunch buffet. Check the number of seats before you finalize the list, and say on the invitation if the party is adults only.</p>`,
        figure: { ...w4.blushRibbon, alt: "Blush Ribbon digital invitation design with a satin bow and pastel garden scene on a phone", caption: "Blush Ribbon, a FOLDÈ wedding design, opened on a phone (Nov. 18, 2026). The pastel palette is the same one tea parties borrow." },
      },
      {
        heading: "18 tea party bridal shower wording examples",
        body: `<p><strong>Classic afternoon tea</strong></p>
<blockquote>1. Please join us for afternoon tea
in honor of Emma Carter, bride-to-be
Sunday, May 10 · 2 pm</blockquote>
<blockquote>2. You are cordially invited to a bridal tea
honoring Emma Carter
hosted by her sister, Claire Martin</blockquote>
<blockquote>3. Tea, scones and good company
A bridal shower for Emma</blockquote>
<blockquote>4. Join us for a cup of tea and a slice of cake
as we celebrate Emma before the wedding</blockquote>
<blockquote>5. A bridal shower tea
in honor of Emma Carter
The Rose Tea Room · Sunday, May 10</blockquote>
<p><strong>Garden tea</strong></p>
<blockquote>6. Tea in the garden for the bride-to-be
Bring your sun hat and your appetite</blockquote>
<blockquote>7. Among the roses: a garden tea party for Emma</blockquote>
<blockquote>8. Petals, pastries and a pot of tea
Celebrate Emma’s bridal shower in the garden</blockquote>
<blockquote>9. A garden tea party in honor of Emma
If it rains, we’ll move to the conservatory</blockquote>
<p><strong>Playful</strong></p>
<blockquote>10. Love is steeping!
Join us for Emma’s bridal tea</blockquote>
<blockquote>11. She found her perfect blend.
Tea party bridal shower for Emma</blockquote>
<blockquote>12. A spot of tea for the bride-to-be</blockquote>
<blockquote>13. Tea, cake and a soon-to-be Mrs.</blockquote>
<blockquote>14. Pinkies up! A bridal tea for Emma</blockquote>
<p><strong>High tea and formal</strong></p>
<blockquote>15. The pleasure of your company is requested
at a high tea in honor of Miss Emma Carter
Sunday, the tenth of May, at three o’clock</blockquote>
<blockquote>16. Mrs. Anne Carter requests the pleasure of your company
at a bridal tea honoring her daughter, Emma</blockquote>
<p><strong>Detail lines</strong></p>
<blockquote>17. Garden party attire · hats and fascinators encouraged</blockquote>
<blockquote>18. Kindly reply to Claire by April 24 · Emma is registered at Crate &amp; Barrel</blockquote>
<p>Need more tones? Our <a href="/blog/bridal-shower-invitation-wording">bridal shower wording guide</a> has 24 more examples, and the <a href="/blog/couples-shower-invitations">couples shower guide</a> covers co-ed parties.</p>`,
      },
      {
        heading: "Theme details worth putting on the invitation",
        body: `<p>The Knot’s tea party guide describes the look: a pastel palette (blush, light blue, lilac, sage green, pale yellow), fine china and plenty of flowers, finger sandwiches, scones and petits fours, and formal or semi-formal attire. Only some of that belongs on the invitation.</p>`,
        table: {
          caption: "From theme to invitation",
          head: ["Theme element", "Put it on the invitation?", "How"],
          rows: [
            ["Palette", "Yes, through the design", "Pastel colors on the card itself, no need to write them"],
            ["Dress code", "Yes, if it is themed", "“Garden party attire” or “hats welcome”"],
            ["Menu", "A hint only", "“Tea, sandwiches and sweets” tells guests it is not a full meal"],
            ["Activities", "Only if guests must prepare", "“Bring a favorite recipe” or “bring a teacup to swap”"],
            ["Venue type", "Yes", "Tea room, garden or home, with the full address"],
          ],
        },
        figure: { ...w4.tropical, alt: "Tropical digital invitation design with green striped background and palm illustrations", caption: "Tropical, a FOLDÈ wedding design: striped greens that suit a summer garden tea." },
      },
      {
        heading: "Paper, email or a digital invitation?",
        body: `<p>The Knot notes that shower invitations are usually mailed, that some couples choose digital ones, and that the choice belongs to the couple and the host, depending on timeline and budget. A tea for 20 close friends and relatives can go either way: paper suits grandmothers and keepsake boxes, a link suits friends who live on their phones.</p>
<p>FOLDÈ, which publishes this guide, makes digital <strong>wedding</strong> invitations, not shower invitations. If the shower is the first event of a longer celebration, the same garden or pastel mood can carry over to the wedding invitation that follows. See <a href="/blog/bridal-shower-invitations-online">how to send shower invitations online</a>.</p>`,
        figure: { ...w4.jardin, alt: "Le Jardin digital wedding invitation with a lush garden scene on a phone", caption: "Le Jardin: a garden design for the wedding, if the tea party sets the tone." },
      },
    ],
    faqs: [
      ["What time should a tea party bridal shower be?", "Afternoon, often between 1 and 5 pm. Give an end time if the tea room or venue is booked for a set slot."],
      ["What is the difference between afternoon tea and high tea on an invitation?", "Many hosts use “high tea” for a dressier version. Whichever term you use, the menu hint and dress code tell guests what to expect."],
      ["What should guests wear to a tea party shower?", "Say it on the invitation: “garden party attire” or “semi-formal” is enough. The Knot suggests formal or semi-formal attire for an elegant tea."],
      ["Can men be invited to a tea party shower?", "Yes. If partners or friends of any gender are invited, say “couples tea” or “co-ed shower” so nobody is surprised."],
      ["Is it okay to mention the registry?", "Yes, one line or a link. Showers are the event where registry details are expected."],
      ["When should the RSVP be due?", "At least two weeks before the shower, so the host can confirm seating and food with the tea room."],
    ],
    methodology: `<p>Timing, guest list and RSVP guidance follow The Knot’s bridal shower invitation etiquette (updated August 15, 2025); theme details follow The Knot’s tea party shower guide (updated April 15, 2024). Wording examples are original to FOLDÈ; names are fictional.</p>${check("Blush Ribbon, Tropical and Le Jardin")}`,
    sources: [knotShower, knotTea],
  },
  {
    slug: "bridal-shower-invitations-online",
    keyword: "bridal shower invitations online",
    title: "Bridal Shower Invitations Online: 4 Ways to Send Them and How to Track Replies",
    metaTitle: "Bridal Shower Invitations Online: 4 Ways to Send Them",
    description: "Can you send bridal shower invitations online? Four ways compared, what to include, 6 messages to send with the link, RSVPs and privacy.",
    excerpt: "Text, email, e-card or a link with RSVP: which to choose, what to write with it and how to collect replies.",
    intro: "Sending bridal shower invitations online saves postage and time, and it is now common: The Knot says the choice between mail and digital belongs to the couple and the host. What changes is how you send it, how guests reply and how you reach the relatives who don’t read email. This guide compares four ways to send a shower invitation online, lists what it must include, gives six short messages to send with the link, and covers RSVPs, reminders and privacy.",
    heroImage: "/images/blog/pexels/34579982.jpg",
    imageAlt: "Elegant wedding stationery flat lay",
    datePublished: "2026-11-18",
    readingTime: 7,
    author,
    quickAnswer: "Yes, you can send bridal shower invitations online: The Knot says mail or digital is the couple’s and host’s choice. Use a link, email or e-card that shows the guest of honor, host, date, time, address, registry and a reply-by date at least two weeks before. Send it four to six weeks ahead, and call or mail the guests who aren’t online.",
    tool: { variant: "wording", event: "shower", title: "Write the text of your online invitation", subtitle: "Pick a tone, add the guest of honor and the host, then paste it into your email, card or message." },
    ctaAfter: 2,
    sections: [
      {
        heading: "Is it okay to send a shower invitation online?",
        body: `<p>Yes. The Knot’s shower etiquette guide says invitations are traditionally mailed, that some couples opt for digital ones, and that the decision belongs to the couple and the host, depending on the timeline and budget. It adds that RSVPs are usually collected by phone or email whichever way the invitation is sent.</p>
<p>Two checks before you decide: the guest of honor is happy with it (some brides want a paper keepsake), and every guest has an address you can reach. For the few who don’t, a printed copy or a phone call does the job.</p>`,
      },
      {
        heading: "4 ways to send it, compared",
        body: `<p>The four formats differ mainly in one thing: whether replies come back to one place or scatter across messages.</p>`,
        table: {
          caption: "Online bridal shower invitation formats",
          head: ["Format", "Replies", "Can be updated", "Best for", "Watch out"],
          rows: [
            ["Image or PDF in a group text", "In the chat, mixed with other messages", "No: you resend a file", "Small, casual showers", "Group chats expose everyone’s number"],
            ["Email with the design", "By reply email", "No", "Guests who use email", "Can land in spam; use a clear subject"],
            ["E-card platform", "Yes/no on the platform", "Usually", "Most showers", "Check what guests see without an account"],
            ["Link to a page with an RSVP form", "In one list", "Yes", "Showers with travel, meals or many guests", "Keep the link private"],
          ],
        },
        figure: { ...shot.envelope, alt: "Digital invitation opening on a wax-seal envelope on a phone", caption: "A link-based invitation opens like an envelope on the guest’s phone (FOLDÈ wedding design, Nov. 2026)." },
      },
      {
        heading: "What the online invitation must include",
        body: `<ol>
<li>The type of party and the guest of honor (“bridal shower for Emma Carter”).</li>
<li>The host’s name and how to reach them.</li>
<li>Date, start time and end time.</li>
<li>The full address, with a map link and parking or entry notes.</li>
<li>A reply-by date, at least two weeks before the shower (The Knot).</li>
<li>Registry: one line or a link.</li>
<li>Optional: theme, dress code, “adults only”, or “bring a recipe”.</li>
</ol>
<p>Wording ideas for each tone are in our <a href="/blog/bridal-shower-invitation-wording">24 bridal shower wording examples</a> and, for a themed party, the <a href="/blog/tea-party-bridal-shower-invitations">tea party invitation guide</a>.</p>`,
        figure: { ...w4.blushRibbon, alt: "Pastel digital invitation with a satin bow opened on a phone", caption: "Blush Ribbon, a FOLDÈ wedding design (Nov. 18, 2026): a soft palette that reads well on a small screen." },
      },
      {
        heading: "6 messages to send with the link",
        body: `<p>A link without a sentence looks like spam. Send it with one or two lines in the host’s voice.</p>
<blockquote>1. Hi Aunt Rose! I’m hosting Emma’s bridal shower on May 10 and we’d love you there. Everything is here: [link]. Could you reply by April 24?</blockquote>
<blockquote>2. You’re invited! Emma’s shower is on Sunday, May 10. Details and RSVP: [link]</blockquote>
<blockquote>3. Subject: Emma’s bridal shower · Sunday, May 10 · please reply by April 24</blockquote>
<blockquote>4. Save your Sunday afternoon: tea, cake and Emma. Invitation here: [link]</blockquote>
<blockquote>5. Hi everyone, the invitation for Emma’s shower is in this email. Please reply to me directly rather than to all.</blockquote>
<blockquote>6. Gentle reminder: we’re ordering the cake on Friday. If you haven’t replied yet, the link is here: [link]</blockquote>`,
      },
      {
        heading: "Collecting RSVPs and sending reminders",
        body: `<p>Decide where replies go before you send anything: one form, one email address or one phone number. Then:</p>
<ul>
<li>Set the reply-by date at least two weeks before the shower, so the host can confirm food and seating.</li>
<li>Send one reminder a few days before the deadline, to the people who haven’t answered only.</li>
<li>Ask only what you need: attending or not, number of people, dietary needs.</li>
<li>Call the guests who haven’t replied after the deadline; one call is faster than three messages.</li>
</ul>`,
        figure: { ...shot.rsvp, alt: "RSVP form inside a digital invitation on a phone", caption: "An RSVP form collects every answer in one list instead of a chat thread." },
      },
      {
        heading: "Privacy and the guests who aren’t online",
        body: `<ul>
<li>Use BCC for group emails, or send messages one by one, so guests don’t see each other’s addresses.</li>
<li>Don’t post the invitation or the home address on social media.</li>
<li>Print a few copies for grandparents and older relatives, or call them and note their answer yourself.</li>
<li>If the shower is a surprise, send the invitation to guests only, and say so in the first line.</li>
</ul>
<p>FOLDÈ, which publishes this guide, makes digital <strong>wedding</strong> invitations with RSVP, not shower invitations. When the wedding invitation comes, the same principles apply: one link, one list of answers, and a printed copy for the guests who need one. See <a href="/blog/digital-wedding-invitations">digital wedding invitations</a>.</p>`,
        figure: { ...w4.guestGallery, alt: "Guest photo gallery with a QR code in a digital wedding invitation", caption: "On FOLDÈ wedding invitations, guests can also add photos through a QR code after the day." },
      },
    ],
    faqs: [
      ["Is it rude to send a bridal shower invitation by text?", "No, for a casual shower. Send it individually, not in a large group chat, and follow up with older guests by phone or mail."],
      ["Who sends the online invitation?", "The host, as for a paper invitation. The bride can share the guest list and addresses."],
      ["When should online shower invitations go out?", "Four to six weeks before the shower, or about two months ahead for guests who travel (The Knot)."],
      ["How do guests RSVP to an online invitation?", "Through the form on the invitation, or by replying to the host by email, text or phone, as the invitation says."],
      ["Can you send online invitations to some guests and paper to others?", "Yes. Use the same wording and reply-by date on both so nobody gets different information."],
      ["Should the registry go on an online invitation?", "Yes, one line or a link is expected for a shower."],
    ],
    methodology: `<p>Etiquette points follow The Knot’s bridal shower invitation etiquette (updated August 15, 2025). The format comparison reflects how each format works in general, not a test of any specific platform. Sample messages are original; names are fictional.</p>${check("Blush Ribbon and the guest photo gallery section of a FOLDÈ wedding invitation")}`,
    sources: [knotShower],
  },
  {
    slug: "how-to-make-a-wedding-invitation-online",
    keyword: "how to make a wedding invitation online",
    title: "How to Make a Wedding Invitation Online: 7 Steps, From Design to RSVP",
    metaTitle: "How to Make a Wedding Invitation Online in 7 Steps",
    description: "Make a wedding invitation online in 7 steps: details to gather, format, design, wording, RSVP questions, a phone test and sending, with real prices.",
    excerpt: "Seven steps, from the details you need before starting to the test you should run before sending.",
    intro: "Making a wedding invitation online takes an evening if the details are ready and a week if they aren’t. Most of the time goes into decisions, not design: the date and venue, who is invited, what you need guests to answer. This guide walks through seven steps, from the details to gather to the final test on a phone, with screenshots of a real creation flow and the prices we read on November 18, 2026.",
    heroImage: shot.editor.src,
    imageAlt: "Online invitation editor with a live phone preview",
    datePublished: "2026-11-18",
    readingTime: 8,
    author,
    quickAnswer: "To make a wedding invitation online, gather the names, date, time, venue address and reply-by date first. Choose a format: an image to share, or a link with a built-in RSVP. Pick a design, add your names and wording, fill in the schedule, map and RSVP questions, then open it on your own phone and send a test reply before sending it six to eight weeks ahead.",
    tool: { variant: "invitation", title: "Start with your names", subtitle: "Type your names and pick a design to see them on a real invitation. Previewing is free." },
    ctaAfter: 3,
    sections: [
      {
        heading: "Step 1: gather the details before you open any tool",
        body: `<p>An invitation is quick to design and slow to correct. Have these ready first:</p>`,
        table: {
          caption: "What you need before you start",
          head: ["Detail", "Example", "If you don’t have it yet"],
          rows: [
            ["Names", "Emma Carter & Lucas Martin", "Decide how you want them written (first names only, full names)"],
            ["Hosts", "Together with their families", "Only needed if parents are hosting"],
            ["Date and start time", "Saturday, September 12, 2027 · 4 pm", "Wait: the date is the one detail you can’t leave vague"],
            ["Venue and address", "Villa Rosa, 12 Via Roma, Como", "Get the exact address and parking notes from the venue"],
            ["Schedule", "Ceremony 4 pm · dinner 7 pm", "A start time is enough for now"],
            ["Reply-by date", "July 31, 2027", "Usually four to six weeks before the wedding"],
            ["Guest list with contacts", "Phone or email per household", "Collect it while you design"],
            ["RSVP questions", "Attending, number of guests, dietary needs", "Ask only what changes a decision"],
          ],
        },
      },
      {
        heading: "Step 2: choose the format",
        body: `<p>“Online invitation” covers two different things. An <strong>image or PDF</strong> you design and share by message is cheap and fast, but it can’t collect replies or be corrected after sending. A <strong>link to an invitation page</strong> can hold the schedule, a map and an RSVP form, and you can update it. If you need replies, meal choices or travel details, choose the second. Our <a href="/blog/digital-wedding-invitations">digital wedding invitations guide</a> compares four formats in detail.</p>`,
        figure: { ...shot.collection, alt: "Collection of digital wedding invitation designs shown on phones", caption: "Step 3 starts here: the FOLDÈ collection shows each design as guests will see it on a phone." },
      },
      {
        heading: "Steps 3 and 4: pick a design and add your names",
        body: `<p>Choose a design by looking at it on a phone, since that is where most guests will open it. Check that the names stay readable over the background (see <a href="/blog/wedding-invitation-background">wedding invitation backgrounds</a>).</p>
<p>On FOLDÈ, choosing a design opens a creation flow that asks for your names and the date; a tentative date is accepted while you decide. Previewing is free and doesn’t need an account.</p>`,
        figure: { ...shot.namesMobile, alt: "Mobile creation flow asking for the couple’s names", caption: "The creation flow on a phone: names first, then the date." },
      },
      {
        heading: "Step 5: write the wording",
        body: `<p>Wording follows a fixed order: hosts, the request to attend, your names, the date and time, the venue, then reception and reply details. Pick the tone first (formal, modern, casual), then adapt a sample. Our <a href="/blog/wedding-invitation-wording-examples">20 wording samples</a> cover the common situations, including parents hosting and courthouse weddings.</p>`,
      },
      {
        heading: "Step 6: fill in the practical sections and RSVP",
        body: `<p>Add only the sections guests will use: venue with directions, schedule, dress code, accommodation if people travel, and the RSVP form. Keep RSVP questions short: name, attending, number of guests, dietary needs. Everything else can wait for a later message.</p>
<p>On FOLDÈ, the desktop editor shows a live phone preview next to the options, so each change appears as guests will see it. After payment, a private dashboard holds the photos, wording, schedule, music, RSVP questions and guest tables.</p>`,
        figure: { ...shot.rsvp, alt: "RSVP form inside a digital wedding invitation on a phone", caption: "The RSVP section of a FOLDÈ invitation: attendance, guests and dietary needs." },
      },
      {
        heading: "Step 7: test it on a phone, then send",
        body: `<ol>
<li>Open the link from a message app on your own phone, as a guest would.</li>
<li>Tap through the opening, check the map and every time.</li>
<li>Send yourself a test reply and check it appears where you expect.</li>
<li>Ask one person who wasn’t involved to find the reply-by date in under ten seconds.</li>
</ol>
<p>Send the invitation six to eight weeks before the wedding, earlier for a destination wedding (The Knot). Send it individually with a short line in your own words, not in a large group chat.</p>`,
        figure: { ...shot.envelope, alt: "Wax-seal envelope opening screen of a digital invitation", caption: "What guests see first: the envelope opens when they tap it." },
      },
      {
        heading: "What it costs",
        body: `<p>Online tools range from free image editors to paid invitation platforms. On FOLDÈ, previewing is free and you pay once to publish. On November 18, 2026 the packages page listed the Standard plan at <strong>$49.90</strong>, shown at $29.90 with a 40% launch offer, and the Expert plan, where the studio builds and reviews the invitation for you, at <strong>$149</strong>; both include unlimited guests and RSVP management. For comparison, mailing a paper invitation in the U.S. costs at least the $0.82 first-class stamp per envelope, plus a stamp for each reply card.</p>`,
      },
    ],
    faqs: [
      ["How long does it take to make a wedding invitation online?", "An hour or two once the details are decided. Most delays come from missing information: the exact address, the schedule or the reply-by date."],
      ["Can I make a wedding invitation online for free?", "You can design an image for free in many tools. An invitation with a built-in RSVP and updates is usually a paid service; on FOLDÈ, previewing is free and you pay once to publish."],
      ["Can I change the invitation after sending it?", "With a link-based invitation, yes: guests see the update on the same link. With an image or PDF, you have to send a new file."],
      ["What if some guests aren’t online?", "Print a few copies or call them. Keep the same wording and reply-by date on every version."],
      ["When should I send an online wedding invitation?", "Six to eight weeks before the wedding, after save-the-dates; earlier for destination weddings (The Knot)."],
      ["Do I still need save-the-dates?", "For a destination wedding or a date far ahead, yes; they go out six to eight months before. For a local wedding with a short engagement, the invitation can be enough."],
    ],
    methodology: `<p>Steps and screenshots come from the FOLDÈ creation flow, editor and packages page; timing follows The Knot’s guide to sending wedding invitations (updated July 14, 2026); the stamp price is from FreightWaves (USPS rate since July 12, 2026).</p>${check("the collection, the creation flow and the Rosas design")}`,
    sources: [knotTimingDated, stamps],
  },
  {
    slug: "civil-wedding-invitations",
    keyword: "civil wedding invitation",
    title: "Civil Wedding Invitations: 14 Wording Examples for Courthouse Ceremonies and Later Celebrations",
    metaTitle: "Civil Wedding Invitations: 14 Courthouse Wording Examples",
    description: "How to word a civil or courthouse wedding invitation: three situations, what to include and 14 wording examples, including “We’re married!” celebrations.",
    excerpt: "Courthouse ceremony, celebration later or both: what to write so guests know what they’re invited to.",
    intro: "A civil wedding invitation has one job a church or venue invitation doesn’t: making clear what guests are invited to. Some couples invite a few people to the courthouse, some marry with two witnesses and celebrate months later, and some have a civil ceremony and a symbolic one. Each needs different words. This guide explains the three situations, what to include, and 14 wording examples you can adapt.",
    heroImage: "/images/blog/pexels/20485643.jpg",
    imageAlt: "Wedding rings beside a wedding invitation",
    datePublished: "2026-11-18",
    readingTime: 7,
    author,
    quickAnswer: "A civil wedding invitation names the couple, says the ceremony is at city hall or the courthouse, and gives the date, time, full address and any room or floor. If the civil ceremony is private and the party comes later, say so: The Knot suggests opening with “We’re married!” and inviting guests to celebrate. Add where to meet afterward and how to RSVP.",
    tool: { variant: "wording", event: "wedding", title: "Draft your civil wedding wording", subtitle: "Pick a tone and add your names, then replace the venue line with the courthouse or city hall." },
    ctaAfter: 2,
    sections: [
      {
        heading: "Three situations, three kinds of wording",
        body: `<p>Start by deciding which of these describes your plans; the wording follows from it.</p>`,
        table: {
          caption: "Which civil wedding wording do you need?",
          head: ["Situation", "Who is invited", "Key phrase", "Example"],
          rows: [
            ["Small civil ceremony with guests", "A few close guests to the courthouse", "“at City Hall”, “civil ceremony”", "Examples 1 to 5"],
            ["Private civil ceremony, party later", "Everyone, to the celebration", "“We’re married!”, “a celebration of our marriage”", "Examples 6 to 10"],
            ["Civil ceremony, then a symbolic or religious one", "Guests to the second ceremony (and sometimes both)", "“Having married at City Hall…”", "Examples 11 and 12"],
          ],
        },
      },
      {
        heading: "What to include",
        body: `<ul>
<li><strong>The exact place</strong>: building name, street address, and the room or floor if you know it.</li>
<li><strong>Arrival time</strong>: civil ceremonies are often short and scheduled in slots, so ask guests to arrive a few minutes early.</li>
<li><strong>Guest limits</strong>: some city halls limit the number of guests in the room; check with the clerk’s office before you invite.</li>
<li><strong>Entry and photos</strong>: mention ID or security checks and any photo rules if the building has them.</li>
<li><strong>What happens next</strong>: lunch, drinks or dinner after, with its own address.</li>
<li><strong>RSVP</strong>: a reply-by date and one contact.</li>
</ul>`,
        figure: { ...live.venue, alt: "Venue section with a map and a Get directions button in a digital invitation", caption: "A map with directions saves guests from searching for the right entrance (FOLDÈ, Nov. 2026)." },
      },
      {
        heading: "14 civil wedding invitation wording examples",
        body: `<p><strong>Courthouse ceremony with guests</strong></p>
<blockquote>1. Emma Carter and Lucas Martin
invite you to witness their civil ceremony
Friday, June 4, 2027, at 11 am
Riverside City Hall, Room 201 · 100 Main Street
Lunch to follow at The Corner Bistro</blockquote>
<blockquote>2. We’re keeping it small and we’d love you there.
Emma & Lucas · City Hall · June 4 at 11 am</blockquote>
<blockquote>3. Together with their families,
Emma Carter and Lucas Martin
request the pleasure of your company
at their civil marriage ceremony</blockquote>
<blockquote>4. Ten minutes at the courthouse, a long lunch after.
Join Emma & Lucas on Friday, June 4</blockquote>
<blockquote>5. Please arrive by 10:45 am; the ceremony starts on time.
Bring a photo ID for building security.</blockquote>
<p><strong>Private civil ceremony, celebration later</strong></p>
<blockquote>6. We’re married!
Emma and Lucas married at City Hall on March 3, 2027.
Join us to celebrate on Saturday, June 12, from 6 pm</blockquote>
<blockquote>7. We said “I do” with two witnesses.
Now we’d like to say “thank you” with all of you.</blockquote>
<blockquote>8. Please join us for a celebration of the marriage of
Emma Carter and Lucas Martin
Saturday, June 12, 2027 · dinner and dancing</blockquote>
<blockquote>9. Mr. and Mrs. Robert Carter
invite you to a reception in honor of
Emma and Lucas, married on March 3, 2027</blockquote>
<blockquote>10. It’s official. Now let’s party.
Emma & Lucas · June 12 · The Boathouse</blockquote>
<p><strong>Civil ceremony, then a symbolic or religious one</strong></p>
<blockquote>11. Having married at City Hall in May,
Emma and Lucas invite you to celebrate their wedding ceremony
Saturday, September 11, 2027, at 4 pm</blockquote>
<blockquote>12. Our civil ceremony will be private.
We would be honored by your presence at our wedding blessing
Saturday, September 11, at Saint Mary’s Church</blockquote>
<p><strong>Announcement only (no event)</strong></p>
<blockquote>13. Emma Carter and Lucas Martin
are delighted to announce their marriage
on March 3, 2027, at Riverside City Hall</blockquote>
<blockquote>14. Just married! We said yes at the courthouse on March 3,
and we can’t wait to celebrate with you soon.</blockquote>
<p>Example 6 follows the approach The Knot suggests for a civil ceremony held months before the main celebration. For a party without any ceremony, see our <a href="/blog/wedding-reception-invitation-wording">reception invitation wording</a>.</p>`,
      },
      {
        heading: "Timing",
        body: `<p>There is no fixed rule for a small courthouse ceremony with a handful of guests: a few weeks’ notice and a phone call often suffice. For a celebration with a larger guest list, follow the usual wedding timeline: invitations six to eight weeks before, earlier if guests travel (The Knot). If the civil ceremony is private, send the celebration invitation after it, so the “We’re married!” wording is true when guests read it.</p>`,
        figure: { ...w4.pearl, alt: "Pearl digital invitation design with a painted terrace and sea view on a phone", caption: "Pearl, a minimal FOLDÈ design (Nov. 18, 2026): calm enough for a short, simple civil wedding." },
      },
      {
        heading: "A civil wedding invitation, delivered digitally",
        body: `<p>Civil weddings often move fast: a slot opens at city hall, the date is set two months ahead. A digital invitation can go out the same day and be corrected if the clerk changes the room. On FOLDÈ, which publishes this guide, the venue section takes any address, including a courthouse, and the schedule can show the ceremony and the lunch or party after it as separate lines. Editorial-style designs keep the tone sober.</p>`,
        figure: { ...live.editorial, alt: "Editorial digital invitation design with modern typography on a phone", caption: "Editorial, a FOLDÈ design with modern typography on ivory." },
      },
    ],
    faqs: [
      ["What is a civil wedding invitation?", "An invitation to a wedding performed by a civil officiant, usually at city hall or a courthouse, or to the celebration that follows it."],
      ["How do you invite people to a courthouse wedding?", "Give the building, address, room, date and time, ask guests to arrive early, and say what happens after the ceremony."],
      ["How do you word an invitation if you’re already married?", "Say so: “We’re married!” or “a celebration of the marriage of…”, then invite guests to the party. The Knot suggests this approach."],
      ["Can you have a reception months after a civil ceremony?", "Yes. Use reception wording and include the date of the civil ceremony if you want guests to know it already happened."],
      ["How many guests can attend a civil ceremony?", "It depends on the city hall or courthouse. Many rooms are small; ask the clerk’s office before sending invitations."],
      ["Is a gift expected for a courthouse wedding?", "Customs vary. Guests often bring one to the celebration rather than the ceremony; a registry line on the invitation is optional."],
    ],
    methodology: `<p>The “We’re married!” approach follows The Knot’s answer on civil ceremony wording; reception phrasing follows The Knot’s reception-only invitation guide (updated June 19, 2024); timing follows The Knot’s guide to sending wedding invitations (updated July 14, 2026). Practical points about city halls (slots, guest limits, security) are general; rules vary by city, so check with your clerk’s office. Wording examples are original; names and venues are fictional.</p>${check("Pearl, Editorial and the venue section of a FOLDÈ invitation")}`,
    sources: [knotCivil, knotReception, knotTimingDated],
  },
  {
    slug: "wedding-invitation-background",
    keyword: "wedding invitation background",
    title: "Wedding Invitation Background: 6 Types, Real Examples and the Contrast Rule",
    metaTitle: "Wedding Invitation Background: 6 Types + Real Examples",
    description: "Six wedding invitation backgrounds compared (paper, floral, painted, pattern, photo, video) on real designs, plus the contrast rule that keeps names readable.",
    excerpt: "Plain, floral, painted, pattern, photo or video: which background suits your wedding and keeps the names readable.",
    intro: "The background decides more of an invitation’s mood than the font does, and it is also the first reason names become unreadable on a phone. This guide compares six types of wedding invitation background, shows each on a real design opened on a phone, explains the contrast rule that keeps text legible, and lists the image settings and mistakes to watch.",
    heroImage: shot.collection.src,
    imageAlt: "Digital wedding invitation designs with different backgrounds on phone screens",
    datePublished: "2026-11-18",
    readingTime: 7,
    author,
    quickAnswer: "Choose a wedding invitation background that matches your venue or season and leaves a calm area for the names: plain paper, florals, a painted scene, a pattern, a photo or a video. Text must contrast with what is behind it; the W3C’s accessibility guideline asks for at least 4.5:1, or 3:1 for large text. Add a soft overlay or move the text when a busy area falls behind it.",
    tool: { variant: "invitation", title: "Try your names on different backgrounds", subtitle: "Pick a design and type your names: see how they read on a photo, a painting or a video." },
    ctaAfter: 2,
    sections: [
      {
        heading: "6 types of wedding invitation background",
        body: `<p>Each type sets a different mood and carries a different risk for readability.</p>`,
        table: {
          caption: "Wedding invitation backgrounds compared",
          head: ["Background", "Mood", "Best for", "Readability risk", "Fix"],
          rows: [
            ["Plain or paper texture", "Classic, minimal", "Formal and modern weddings", "Low", "Keep the texture subtle"],
            ["Floral or botanical", "Romantic, natural", "Garden and spring weddings", "Flowers behind the text", "Frame the text with flowers instead"],
            ["Painted scene", "Storytelling", "Destination and venue-led weddings", "Detail behind the names", "Place names over sky or water"],
            ["Pattern", "Playful, graphic", "Summer and casual weddings", "Stripes cut through letters", "Put text on a solid shape"],
            ["Photo", "Personal", "Couples with a strong portrait", "Faces and text compete", "Use a photo with empty space"],
            ["Video", "Cinematic", "Digital invitations", "Motion behind text", "Darken slightly; keep text where the video is calm"],
          ],
        },
      },
      {
        heading: "Real examples, opened on a phone",
        body: `<p>We opened FOLDÈ designs on a 390×844 phone screen on November 18, 2026. Four of them show how different backgrounds handle the same job: holding two names and a date.</p>
<ul>
<li><strong>Como</strong> plays a video of a lake and mountains; the names sit over the sky and water, the calmest part of the frame.</li>
<li><strong>Dolce Vita</strong> uses a photo of a couple; the names sit below their faces, over the softer area of hair and fabric.</li>
<li><strong>Amber</strong> opens on a painted countryside lane; the path leads the eye up to the names.</li>
<li><strong>Tropical</strong> uses striped greens with palm illustrations, with the names inside a plain oval so the stripes never cross the letters.</li>
</ul>`,
        figure: { ...w4.como, alt: "Como digital invitation with a lake and mountain video background on a phone", caption: "Como: a video background, with the names over the calmest part of the frame (FOLDÈ, Nov. 18, 2026)." },
      },
      {
        heading: "Photo and painted backgrounds",
        body: `<p>A photo background is the most personal option and the hardest to get right. Choose a picture with an empty area (sky, wall, water) where the names can go, and avoid placing text across faces. Painted scenes are more forgiving: they are composed with space for text, and they can show the venue or the region without a photographer.</p>
<p>More on choosing and placing a photo in our <a href="/blog/photo-wedding-invitations">photo wedding invitations guide</a>.</p>`,
        figure: { ...w4.dolceVita, alt: "Dolce Vita digital invitation with a photo of a couple as background", caption: "Dolce Vita: a photo background with the names placed below the couple’s faces, not across them." },
      },
      {
        heading: "The contrast rule",
        body: `<p>The W3C’s accessibility guideline (WCAG 2.2, criterion 1.4.3) asks for a contrast ratio of at least <strong>4.5:1</strong> between text and its background, or <strong>3:1</strong> for large text. Names in a large script usually count as large text; the date, address and RSVP lines usually don’t.</p>
<ol>
<li>Check contrast where the text actually sits, not on the average color of the background.</li>
<li>Add a soft dark or light overlay behind the text area if the image is busy.</li>
<li>Keep small text (address, reply-by date) on a plain section, not over the image.</li>
<li>Test on a phone at full brightness and at low brightness.</li>
</ol>`,
        figure: { ...w4.amber, alt: "Amber digital invitation with a painted countryside lane background", caption: "Amber: a painted scene with light names over a soft sky." },
      },
      {
        heading: "Image settings for a digital invitation",
        body: `<ul>
<li><strong>Use the original file</strong>, not a screenshot or an image saved from social media.</li>
<li><strong>Prefer portrait images</strong> for the opening screen: most guests hold the phone upright.</li>
<li><strong>Leave a margin</strong> around faces and the main subject: screens crop differently.</li>
<li><strong>Keep videos short and calm</strong>: a slow loop reads better behind text than quick cuts.</li>
</ul>`,
        figure: { ...w4.tropical, alt: "Tropical digital invitation with a green striped pattern background", caption: "Tropical: a pattern background, with the names on a plain oval." },
      },
      {
        heading: "Mistakes that make backgrounds fail",
        body: `<ul>
<li>White script over a light, detailed area.</li>
<li>Names across faces or across the brightest part of a photo.</li>
<li>A background that changes mood halfway through (a beach photo for a ballroom wedding).</li>
<li>Several busy backgrounds in one invitation: keep the image for the opening and calm sections after it.</li>
<li>Choosing on a laptop: check the background on the phone your guests will use.</li>
</ul>
<p>Choosing by style? See <a href="/blog/elegant-wedding-invitations">elegant</a>, <a href="/blog/wedding-invitations-with-floral-design">floral</a> and <a href="/blog/rustic-wedding-invitations">rustic</a> wedding invitations.</p>`,
      },
    ],
    faqs: [
      ["What is the best background for a wedding invitation?", "The one that matches your venue or season and leaves a calm space for the names. Plain or paper backgrounds are the safest; photos and videos are the most personal."],
      ["Can I use my own photo as an invitation background?", "Yes. Choose a sharp original with an empty area for the text, and keep faces clear of the names."],
      ["What color text works on a dark background?", "White or a light cream, in a weight that isn’t too thin. Check the contrast where the text sits."],
      ["How do I make text readable over a busy background?", "Add a soft overlay behind the text, move the text to a calmer area, or put it on a plain shape."],
      ["Are video backgrounds a good idea?", "On a digital invitation, yes, if the video is slow and the text sits where the frame is calm. They can’t be printed, so plan a still image for any paper copy."],
      ["What size should a background image be?", "Use the largest original you have, in portrait for a phone opening. Avoid screenshots and compressed downloads."],
    ],
    methodology: `<p>The contrast thresholds come from the W3C’s WCAG 2.2 guidance on minimum contrast. The background comparison reflects common design practice; examples were checked on real designs.</p>${check("Como, Dolce Vita, Amber, Tropical and Pearl")}`,
    sources: [wcag],
  },
  {
    slug: "rustic-wedding-invitations",
    keyword: "rustic wedding invitations",
    title: "Rustic Wedding Invitations: 5 Styles, 11 Wording Examples and How to Keep Them Elegant",
    metaTitle: "Rustic Wedding Invitations: 5 Styles + 11 Wording Examples",
    description: "Five rustic wedding invitation styles, 11 wording examples for weddings and showers, and how to keep a rustic invitation refined and readable.",
    excerpt: "Five rustic styles, the wording that suits a barn or vineyard, and how to avoid the kitsch version.",
    intro: "Rustic invitations borrow from the countryside: wood, greenery, kraft paper, a barn or a vineyard in the background. Done well, they tell guests the setting and the dress code before they read a word; done badly, they look like a craft-store kit. This guide covers five rustic styles, how to keep them elegant, 11 wording examples for the wedding and the shower, and what rustic looks like on a digital invitation.",
    heroImage: "/images/blog/pexels/29395419.jpg",
    imageAlt: "Wedding invitation with rustic details on a table",
    datePublished: "2026-11-18",
    readingTime: 7,
    author,
    quickAnswer: "Rustic wedding invitations use natural materials and colors (woodgrain, kraft, greenery, lace and twine, or a painted barn or vineyard) to signal a countryside setting. Keep them elegant with one texture, a palette of two or three earthy tones and readable type. Use warm, simple wording, and add the practical details rural venues need: directions, parking and shoes for grass.",
    tool: { variant: "invitation", title: "Preview a countryside design", subtitle: "Type your names and try Amber, Olive Grove or Le Jardin." },
    ctaAfter: 2,
    sections: [
      {
        heading: "5 rustic invitation styles",
        body: `<p>The Knot describes rustic stationery as weaving in organic elements like wood textures and nature-inspired hues. In practice, five styles come up most often.</p>`,
        table: {
          caption: "Rustic wedding invitation styles",
          head: ["Style", "Cues", "Suits", "Keep it refined by"],
          rows: [
            ["Woodgrain and kraft", "Wood texture, kraft paper, brown ink", "Barn and farm weddings", "Using wood as a background, not every element"],
            ["Greenery and eucalyptus", "Leaves framing the text, sage and cream", "Vineyards, gardens, outdoor ceremonies", "Leaving the center clear"],
            ["Painted countryside", "Watercolor fields, lanes, barns or villas", "Venue-led and destination weddings", "Placing names over sky"],
            ["Lace and twine", "Lace texture, twine bows, tags", "Vintage-leaning country weddings", "Picking one of the two, not both"],
            ["Chalkboard", "Dark board, hand-drawn lettering", "Casual and backyard weddings", "Keeping lettering legible on a phone"],
          ],
        },
      },
      {
        heading: "How to keep a rustic invitation elegant",
        body: `<ul>
<li><strong>One texture.</strong> Wood <em>or</em> kraft <em>or</em> lace. Three together read as a costume.</li>
<li><strong>Two or three earthy tones</strong>: sage, cream and rust; or kraft brown and white.</li>
<li><strong>A readable serif for details</strong>, with script only for the names.</li>
<li><strong>No clip-art mason jars or horseshoes</strong>: let the setting carry the theme.</li>
<li><strong>Practical details</strong>: rural venues need directions, parking and a footwear note for grass or gravel.</li>
</ul>`,
        figure: { ...w4.amber, alt: "Amber digital invitation with a painted countryside lane and trees on a phone", caption: "Amber, a FOLDÈ design (Nov. 18, 2026): a painted country lane instead of wood textures." },
      },
      {
        heading: "11 rustic wording examples",
        body: `<p><strong>Wedding invitations</strong></p>
<blockquote>1. Together with their families
Emma Carter and Lucas Martin
invite you to celebrate their marriage
Saturday, September 18, 2027, at 4 pm
Willow Creek Farm · Sonoma, California</blockquote>
<blockquote>2. Join us in the vineyard
as Emma & Lucas say “I do”
Dinner and dancing in the barn to follow</blockquote>
<blockquote>3. Under the old oak tree
Emma and Lucas will be married
and you are warmly invited</blockquote>
<blockquote>4. Boots, lace and a whole lot of love.
Emma & Lucas · September 18 · Willow Creek Farm</blockquote>
<blockquote>5. Come as you are, stay for supper.
The wedding of Emma and Lucas</blockquote>
<p><strong>Detail lines</strong></p>
<blockquote>6. Ceremony on the lawn: flat shoes recommended</blockquote>
<blockquote>7. Free parking by the barn · follow the signs from the main road</blockquote>
<blockquote>8. Evenings in the valley get cool; bring a layer</blockquote>
<p><strong>Rustic shower invitations</strong></p>
<blockquote>9. A rustic bridal shower for Emma
Sunday brunch at the farmhouse</blockquote>
<blockquote>10. From farm to forever:
a couples shower for Emma & Lucas</blockquote>
<blockquote>11. Mason jars, wildflowers and the bride-to-be.
Shower in the garden, Saturday at noon</blockquote>
<p>More wording by tone in our <a href="/blog/wedding-invitation-wording-examples">20 wedding invitation samples</a>; shower etiquette is in the <a href="/blog/bridal-shower-invitation-wording">bridal shower</a> and <a href="/blog/couples-shower-invitations">couples shower</a> guides.</p>`,
      },
      {
        heading: "Rustic on a digital invitation",
        body: `<p>Wood and lace are textures you touch; on a phone, rustic works better through a <strong>setting</strong>: a painted lane, an olive grove, a stone villa, a garden. FOLDÈ, which publishes this guide, has no design labelled “rustic”. The closest are its warm and natural designs: <strong>Amber</strong> (a painted country lane), <strong>Olive Grove</strong> (a lakeside gate and garden), <strong>The Venue</strong> (a Mediterranean villa and courtyard) and <strong>Le Jardin</strong> (a lush garden).</p>
<p>A digital invitation also solves the rural venue problem: a map with directions and a schedule with shuttle times sit in the same link as the RSVP.</p>`,
        figure: { ...w4.oliveGrove, alt: "Olive Grove digital invitation with a garden gate opening onto a lake on a phone", caption: "Olive Grove: a garden gate and a lake, in soft natural tones." },
      },
      {
        heading: "Where rustic meets the other styles",
        body: `<p>Rustic overlaps with three neighbors. With <a href="/blog/vintage-wedding-invitations">vintage</a>, it shares lace and aged paper; with <a href="/blog/wedding-invitations-with-floral-design">floral</a>, wildflowers and greenery; with <a href="/blog/destination-wedding-invitations">destination</a> invitations, the villa or vineyard setting. Choose the one that describes your venue best and borrow one cue from another, not more.</p>`,
        figure: { ...w4.theVenue, alt: "The Venue digital invitation with a painted Mediterranean villa and courtyard", caption: "The Venue: a painted villa and courtyard, between rustic and destination." },
      },
    ],
    faqs: [
      ["What makes a wedding invitation rustic?", "Natural materials and colors (wood, kraft, greenery, lace or twine) or an illustration of a countryside setting such as a barn, vineyard or farm."],
      ["Can rustic invitations be formal?", "Yes. Use formal wording, a refined serif and a single natural texture; the setting can be rustic while the tone is formal."],
      ["What colors suit a rustic wedding invitation?", "Earthy tones: sage, cream, rust, kraft brown, dusty blue. Two or three are enough."],
      ["What should a rustic wedding invitation include?", "The usual details, plus what rural venues need: directions, parking, footwear for grass and a weather note."],
      ["Are digital invitations suitable for a rustic wedding?", "Yes. Choose a design with a natural setting rather than imitating wood or lace, and use the map and schedule for directions."],
      ["When should rustic wedding invitations be sent?", "Like any wedding invitation: six to eight weeks before, earlier if guests travel (The Knot)."],
    ],
    methodology: `<p>The definition of rustic stationery follows The Knot’s roundup of rustic wedding invitations (updated June 22, 2021); timing follows The Knot’s guide to sending wedding invitations (updated July 14, 2026). Styles, refinements and wording are FOLDÈ’s editorial advice; names and venues are fictional.</p>${check("Amber, Olive Grove, The Venue and Le Jardin")}`,
    sources: [knotRustic, knotTimingDated],
  },
  // Bridal shower card cluster: the plan excluded greeting-card keywords until the
  // user lifted that exclusion on 2026-11-18. One guide covers the cluster, since
  // "what to write", funny and family messages share one search intent.
  {
    slug: "bridal-shower-card-messages",
    keyword: "bridal shower card",
    title: "Bridal Shower Card Messages: What to Write, With 60 Wishes for Every Relationship",
    metaTitle: "Bridal Shower Card: What to Write + 60 Message Ideas",
    description: "What to write in a bridal shower card: a four-part formula, 60 original messages by tone and relationship, and how to sign and deliver the card.",
    excerpt: "A four-part formula, 60 messages by relationship and tone, and how to sign and deliver the card.",
    intro: "A bridal shower card is usually written in the car on the way to the party, which is why so many say only “Congrats! Love, Sarah.” A few personal lines make it the part of the gift the bride keeps. This guide gives a simple four-part formula, 60 original messages sorted by tone and relationship, from a one-liner to a note from the mother of the bride, and the etiquette for signing, gifts and showers you can’t attend.",
    heroImage: "/images/blog/pexels/36617804.jpg",
    imageAlt: "Card with blue accents on a table, ready for a handwritten message",
    datePublished: "2026-11-18",
    readingTime: 9,
    author,
    quickAnswer: "In a bridal shower card, greet the bride by name, wish her well for the shower and the marriage, add one personal line about your relationship or the gift, and sign with the names of everyone invited. Keep jokes gentle, since cards are often read aloud. Short is fine: two or three sincere sentences beat a long quote.",
    tool: { variant: "wording", event: "shower", title: "Planning the shower too?", subtitle: "Draft the invitation: add the bride and the host, pick a tone and copy the text." },
    ctaAfter: 3,
    sections: [
      {
        heading: "A four-part formula for any shower card",
        body: `<p>The Knot sums up the goal: something sincere, supportive and celebratory that reflects your relationship with the bride. In practice, four parts are enough.</p>`,
        table: {
          caption: "Bridal shower card message formula",
          head: ["Part", "What to write", "Example"],
          rows: [
            ["1. Greeting", "Her name, or both names for a couples shower", "Dear Emma,"],
            ["2. Wish", "For the shower day and the marriage ahead", "I’m so happy to celebrate you today."],
            ["3. Personal line", "A memory, a compliment or a word about the gift", "You were the first person I called after every bad date; I love that you found your person."],
            ["4. Sign-off", "A warm closing and the names of everyone invited", "With love, Sarah & Tom"],
          ],
        },
      },
      {
        heading: "Short bridal shower wishes (1–8)",
        body: `<ol>
<li>Wishing you a day full of love and a lifetime of it after.</li>
<li>So happy to shower you with love today!</li>
<li>Here’s to the bride-to-be and everything ahead.</li>
<li>Happy shower day, Emma. You deserve every bit of this.</li>
<li>Cheers to love, laughter and a very full kitchen.</li>
<li>One step closer to “I do”!</li>
<li>Sending you all my love as you get ready for the big day.</li>
<li>What a joy to celebrate you.</li>
</ol>`,
      },
      {
        heading: "Funny bridal shower card messages (9–16)",
        body: `<p>Hallmark’s writers give a useful warning: shower cards are often read aloud or passed around, so keep jokes to what you’d say in front of the bride’s grandmother.</p>
<ol start="9">
<li>Congratulations on finding someone who will share their fries. That’s love.</li>
<li>I promise this gift is more useful than my dating advice ever was.</li>
<li>Officially retiring from wing-woman duty. It was an honor.</li>
<li>May your towels always match and your arguments always be about the thermostat.</li>
<li>You registered for a stand mixer. I’m expecting cookies.</li>
<li>Marriage tip: two remotes. Trust me.</li>
<li>Thanks for finally giving us a reason to wear the fancy hats.</li>
<li>Here’s to a love as strong as your Wi-Fi password.</li>
</ol>`,
        figure: { src: "/images/blog/pexels/29821867.jpg", width: 1600, height: 2000, alt: "Wedding stationery laid on white fabric", caption: "Shower cards are often opened in front of guests: write with that audience in mind." },
      },
      {
        heading: "Heartfelt messages (17–22)",
        body: `<ol start="17">
<li>Watching you fall in love has been one of the happiest things I’ve seen.</li>
<li>You make everyone around you feel at home. Lucas is lucky to build one with you.</li>
<li>I hope your marriage is as kind and generous as you are.</li>
<li>Today we celebrate you; soon we’ll celebrate the two of you. I can’t wait.</li>
<li>May your home always be full of friends, food and laughter.</li>
<li>Love looks good on you. It always has.</li>
</ol>`,
      },
      {
        heading: "Messages from family (23–35)",
        body: `<p><strong>From a mother or father</strong></p>
<ol start="23">
<li>I’ve loved you every day of your life. Watching you start this new chapter fills my heart.</li>
<li>You were my little girl, and now you’re a wonderful woman about to marry someone wonderful. I couldn’t be prouder.</li>
<li>Our door is always open, to both of you now.</li>
</ol>
<p><strong>From a sister or brother</strong></p>
<ol start="26">
<li>From sharing a bedroom to sharing this day: I’m so happy for you, sis.</li>
<li>You took all my clothes growing up. You can keep this gift.</li>
<li>I’m gaining a brother and you’re gaining a husband. Not a bad trade.</li>
</ol>
<p><strong>From a future mother- or sister-in-law</strong></p>
<ol start="29">
<li>We are so happy you’re joining our family. Welcome, officially soon.</li>
<li>Lucas has never smiled like this. Thank you for that.</li>
<li>I’ve always wanted a sister. I’m glad it’s you.</li>
</ol>
<p><strong>From a grandparent</strong></p>
<ol start="32">
<li>I held you on the day you were born. Now I get to see you become a bride. My heart is full.</li>
<li>The secret to a long marriage? Keep laughing together. Grandpa and I still do.</li>
</ol>
<p><strong>From an aunt or uncle</strong></p>
<ol start="34">
<li>You’ve always been our favorite niece. Don’t tell your cousins.</li>
<li>Watching you grow up has been a joy. Watching you marry will be the best part.</li>
</ol>`,
      },
      {
        heading: "Messages for a friend or coworker (36–44)",
        body: `<p><strong>For a friend</strong></p>
<ol start="36">
<li>From late-night talks to your shower day: I’ve loved every chapter with you.</li>
<li>You’ve been there for all my big moments. I’m so glad to be here for yours.</li>
<li>Best friends make the best brides. Love you!</li>
<li>Thank you for letting me be part of this. I wouldn’t miss it for anything.</li>
<li>I knew he was the one when you stopped checking your phone at brunch.</li>
</ol>
<p><strong>For a coworker</strong></p>
<ol start="41">
<li>Wishing you a wonderful shower and a very happy marriage, from all of us at the office.</li>
<li>Congratulations on your best project yet!</li>
<li>Enjoy every moment of this season. The spreadsheets can wait.</li>
<li>We’ll miss you during the honeymoon, but not as much as you’ll enjoy it.</li>
</ol>`,
        figure: { src: "/images/blog/pexels/11503508.jpg", width: 1600, height: 2000, alt: "Old paper envelope with a floral design", caption: "On the envelope, write only the guest of honor’s name if you bring the card in person." },
      },
      {
        heading: "Religious blessings (45–48)",
        body: `<ol start="45">
<li>May God bless your marriage and fill your home with His peace.</li>
<li>Praying that your love grows deeper with every year.</li>
<li>“Love is patient, love is kind” (1 Corinthians 13:4). Wishing you both, always.</li>
<li>May the Lord guide you both as you prepare to become one.</li>
</ol>`,
      },
      {
        heading: "Couples shower card messages (49–52)",
        body: `<p>The Knot’s advice for a couples shower: address both partners and avoid lines that only fit one of them.</p>
<ol start="49">
<li>To Emma and Lucas: here’s to the two of you and the home you’re building.</li>
<li>Two hearts, one registry, endless happiness.</li>
<li>So happy to celebrate you both before the big day.</li>
<li>May your kitchen be full and your arguments few.</li>
</ol>
<p>More on the event itself in our <a href="/blog/couples-shower-invitations">couples shower invitations guide</a>.</p>`,
      },
      {
        heading: "With a gift, or when you can’t attend (53–60)",
        body: `<p><strong>About the gift</strong></p>
<ol start="53">
<li>Straight from your registry, because you know best what your home needs.</li>
<li>A little something for your honeymoon fund. Enjoy every minute.</li>
<li>This was my grandmother’s favorite recipe. I hope it becomes one of yours.</li>
<li>I made this for your new home. It’s not perfect, but it’s made with love.</li>
<li>From all of us at the office: may this set see many happy dinners.</li>
</ol>
<p><strong>If you can’t attend</strong></p>
<ol start="58">
<li>I’m so sorry to miss your shower. I’ll be thinking of you all day.</li>
<li>Wish I could be there to celebrate you. Save me a piece of cake!</li>
<li>Sending love from far away, and counting the days to the wedding.</li>
</ol>`,
      },
      {
        heading: "Card etiquette: signing, gifts and delivery",
        body: `<p>Hallmark’s writers note that traditional etiquette saves “congratulations” for the wedding and offers “best wishes” at the shower, though they add that sincerity matters more than the rule.</p>`,
        table: {
          caption: "Bridal shower card etiquette",
          head: ["Question", "Answer"],
          rows: [
            ["Who signs?", "Everyone invited to the shower; leave off people who weren’t (The Knot)."],
            ["What goes on the envelope?", "The guest of honor’s name; add the mailing address only if you mail it (The Knot)."],
            ["Group gift?", "One card, with every giver’s name."],
            ["Where does the card go?", "Attached to the gift, so the bride knows who gave what for her thank-you notes."],
            ["Can’t attend?", "Mail the card with the gift, or send it before the shower."],
            ["Sign-offs", "With love · Best wishes · All my love · Cheers · Warmly"],
          ],
        },
      },
      {
        heading: "Store-bought, handmade or digital card?",
        body: `<p>Any of them works. A store-bought card with a handwritten note is the classic; a handmade card suits close friends; a digital card is fine if you can’t attend. What matters is the handwritten or personal part, not the card itself.</p>
<p>FOLDÈ, which publishes this guide, doesn’t make greeting cards: it makes digital <strong>wedding</strong> invitations. If you’re hosting rather than attending, see our <a href="/blog/bridal-shower-invitation-wording">bridal shower invitation wording</a>, <a href="/blog/tea-party-bridal-shower-invitations">tea party invitations</a> and <a href="/blog/bridal-shower-invitations-online">how to send shower invitations online</a>.</p>`,
        figure: { ...w4.blushRibbon, alt: "Pastel digital wedding invitation with a satin bow on a phone", caption: "After the shower comes the wedding invitation: Blush Ribbon, a FOLDÈ wedding design (Nov. 18, 2026)." },
      },
    ],
    faqs: [
      ["What do you write in a bridal shower card?", "A greeting with her name, a wish for the day and the marriage, one personal line, and a sign-off with the names of everyone invited."],
      ["Should you say congratulations in a bridal shower card?", "Traditionally “best wishes” is used at the shower and “congratulations” saved for the wedding, but either is fine if it’s sincere (Hallmark)."],
      ["How long should a bridal shower card message be?", "Two to four sentences is plenty. A short personal line is better than a long quote."],
      ["Do you need a card with a bridal shower gift?", "Yes. It tells the bride who gave the gift, which she needs for her thank-you notes."],
      ["Can a card be funny?", "Yes, if you know the bride well. Keep it gentle: shower cards are often read aloud in front of family."],
      ["What do you write if you can’t attend the shower?", "Say you’re sorry to miss it, send your love and wishes, and mention the wedding if you’ll be there."],
      ["Do you need a separate card for the wedding?", "Yes, if you bring a wedding gift too. The shower card is for the shower; save the wedding wishes for the wedding card."],
    ],
    methodology: `<p>Advice on tone, signing, envelopes and couples shower cards follows The Knot’s guide to bridal shower card messages (updated March 12, 2025); the read-aloud caution and the “best wishes” convention follow Hallmark’s guide by Keely Chace (July 1, 2019). All 60 messages are original to FOLDÈ, written for this guide; names are fictional. The scripture reference is 1 Corinthians 13:4. FOLDÈ Wedding publishes this guide and sells digital wedding invitations, not greeting cards.</p>`,
    sources: [knotCard, hallmarkCard],
  },
];
