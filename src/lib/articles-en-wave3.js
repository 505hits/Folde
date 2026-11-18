// English articles, wave 3 of the November 2026 plan: individual rewrites of the
// nine remaining templated guides, plus a couples shower guide. Product details
// were checked on folde-wedding.com on 2026-11-17; etiquette points cite the
// sources read that day. Wording samples are original; names are fictional.

import { IMG, author, shot, knot, stamps } from "@/lib/articles-en";
import { live, designCheck, knotShower, knotSaveDates, knotTimingDated } from "@/lib/articles-en-wave2";

const more = {
  bloom: { src: `${IMG}/bloom-floral-design-opening-mobile.webp`, width: 520, height: 1126, portrait: true },
  jardin: { src: `${IMG}/le-jardin-design-opening-mobile.webp`, width: 520, height: 1126, portrait: true },
  album: { src: `${IMG}/photo-album-section-mobile.webp`, width: 520, height: 1126, portrait: true },
  guestGallery: { src: `${IMG}/guest-photo-gallery-qr-code-mobile.webp`, width: 520, height: 1126, portrait: true },
  rsvpDark: { src: `${IMG}/rsvp-form-rosas-design-mobile.webp`, width: 520, height: 1126, portrait: true },
  story: { src: `${IMG}/story-and-countdown-rosas-mobile.webp`, width: 520, height: 1126, portrait: true },
};

const productCheck = `<p>Product details come from a hands-on check of folde-wedding.com on <strong>November 17, 2026</strong>, in Chromium (Playwright 1.65) at a 390×844 phone size: we opened designs from the collections page (including Rosas, Bloom, Le Jardin, Atelier Indigo, Editorial and Excellence), tapped the envelope and scrolled every section. Screenshots were taken during that check; the photos inside them are the designs’ demo content. We did not submit an RSVP on a live wedding. Prices were read on the packages page the same day. FOLDÈ Wedding publishes this guide and sells digital wedding invitations.</p>`;

export const originalPostsEnWave3 = [
  {
    slug: "wedding-invitations-with-rsvp",
    keyword: "wedding invitations with rsvp",
    title: "Wedding Invitations With RSVP: 3 Setups Compared, What to Ask and When to Remind",
    metaTitle: "Wedding Invitations With RSVP: 3 Setups Compared",
    description: "How to create a wedding invitation with a built-in RSVP: three setups compared, what to ask, deadlines, reminders and where the answers go, shown on a real digital invitation.",
    excerpt: "What to ask, when to set the deadline and how to track replies, with a walkthrough of a real RSVP form.",
    intro: "An RSVP is the only part of a wedding invitation that asks guests to do something, so it decides how much chasing you’ll do later. This guide explains how to create a wedding invitation with RSVP built in: which questions to ask, how to set the deadline, how reminders work, and where the answers end up. We walk through a real RSVP form on a phone and compare paper cards, separate websites and integrated digital RSVPs.",
    heroImage: shot.editor.src,
    imageAlt: "Invitation editor with a live phone preview and design options",
    datePublished: "2026-11-17",
    readingTime: 7,
    author,
    quickAnswer: "To create a wedding invitation with RSVP, put the reply form inside the invitation instead of on a separate card or website. Ask only what you need: name, attendance, party size and dietary needs. Set the reply-by date four to six weeks before the wedding, send a reminder a week before the deadline, and make sure every answer lands in one place you can export.",
    tool: { variant: "rsvp", title: "Try the RSVP your guests would see", subtitle: "Same questions as a FOLDÈ invitation. This demo sends nothing." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Three ways to add an RSVP",
        body: `<p>Every option works; they differ in how much effort they ask of guests and of you.</p>`,
        table: {
          caption: "RSVP options compared",
          head: ["Option", "Guest effort", "Your effort", "Best for"],
          rows: [
            ["Paper RSVP card with stamped envelope", "Fill in, post", "Track cards by hand", "Formal weddings, older guests"],
            ["Wedding website RSVP", "Open a second link, log in or search their name", "Keep the site and invitation in sync", "Large multi-event weddings"],
            ["RSVP inside a digital invitation", "Reply where they read the invitation", "Answers arrive in one dashboard", "Most weddings in 2026"],
          ],
        },
      },
      {
        heading: "What to ask (and what not to)",
        body: `<p>On the FOLDÈ invitations we opened on November 17, 2026, the RSVP form asks for first and last name, email, whether the guest will attend, whether they’re coming alone, with a guest or with family, and allergies or dietary needs. That’s a good benchmark: five questions, under a minute.</p>
<ul>
<li><strong>Ask</strong>: name, attendance, number of people, dietary needs, and a meal choice only if the caterer needs it in advance.</li>
<li><strong>Skip</strong>: song requests, long messages and anything you can collect later. Every extra field lowers the response rate.</li>
<li><strong>Be explicit about plus-ones</strong>: if a guest isn’t invited with a companion, don’t offer the option.</li>
</ul>`,
        figure: { ...more.rsvpDark, alt: "RSVP form asking for first name, last name, email, attendance, companions and dietary needs", caption: "The RSVP section of the Rosas design: five questions and one button." },
      },
      {
        heading: "Deadlines and reminders",
        body: `<p>The Knot advises mailing invitations closer to eight weeks ahead when guests reply by paper card, and notes that digital RSVPs let you send closer to six weeks, since replies don’t travel by post. Set the reply-by date about four to six weeks before the wedding, a week or two before your caterer’s final numbers.</p>`,
        table: {
          caption: "RSVP timeline",
          head: ["When", "Action"],
          rows: [
            ["8 weeks before", "Send invitations with paper RSVP cards"],
            ["6–8 weeks before", "Send digital invitations with built-in RSVP"],
            ["5 weeks before", "Reminder to anyone who hasn’t replied"],
            ["4 weeks before", "RSVP deadline"],
            ["3 weeks before", "Call or message the last few guests"],
          ],
        },
      },
      {
        heading: "Where the answers go",
        body: `<p>With paper, you keep a spreadsheet. With a website and a separate invitation, you reconcile two lists. With an RSVP built into the invitation, each reply arrives in the couple’s private dashboard with the guest’s name and email, which is how FOLDÈ works. Whatever tool you use, check before sending that you can export the list for your caterer and seating plan.</p>
<p>For RSVP card wording, see our <a href="/blog/wedding-rsvp-cards">wedding RSVP cards guide</a>; to share with guests who ask how to reply, there is <a href="/blog/how-to-rsvp-to-a-wedding">how to RSVP to a wedding</a>.</p>`,
        figure: { ...shot.envelope, alt: "Sealed digital invitation envelope on a phone", caption: "Guests open the envelope, read the details and reply in the same place." },
      },
      {
        heading: "Before you send: a two-minute test",
        body: `<ul>
<li>Open the invitation on a phone, as a guest would, from a message app.</li>
<li>Submit a test reply and check it appears where you expect.</li>
<li>Read the reply-by date aloud: is it unambiguous (“Please reply by Saturday, August 15”)?</li>
<li>Check that the RSVP is easy to find after the envelope and the main details.</li>
</ul>`,
        figure: { ...shot.timeline, alt: "Wedding timeline and map on a digital invitation", caption: "Schedule and map come before the RSVP, so guests know what they’re replying to." },
      },
    ],
    faqs: [
      ["Can you put the RSVP on the wedding invitation itself?", "Yes. On paper, use a separate reply card; on a digital invitation, the form is usually a section of the invitation."],
      ["How long should guests have to RSVP?", "About two to four weeks after receiving the invitation, with the deadline four to six weeks before the wedding."],
      ["Is a digital RSVP acceptable for a formal wedding?", "Yes. Many formal weddings now use online RSVPs; keep the wording formal and print a few cards for guests who prefer paper."],
      ["What if a guest doesn’t RSVP?", "Send a reminder a week before the deadline, then contact them directly. Don’t assume either answer."],
      ["Should the RSVP ask for meal choices?", "Only if your caterer needs them in advance. Otherwise, ask for dietary needs and allergies."],
      ["Can guests change their RSVP?", "They should contact you; depending on the tool, you can update the answer on your side."],
    ],
    methodology: `${productCheck}<p>Timing guidance follows The Knot’s invitation timeline (updated July 14, 2026), read on November 17, 2026.</p>`,
    sources: [knotTimingDated],
  },
  {
    slug: "all-in-one-wedding-invitations",
    keyword: "all in one wedding invitations",
    title: "All-in-One Wedding Invitations: One Link Instead of Five Cards",
    metaTitle: "All-in-One Wedding Invitations: 7 Sections to Include",
    description: "What an all-in-one wedding invitation contains, the five cards and the website it replaces, the 7 sections to include and 4 things to leave out, with real screenshots.",
    excerpt: "Invitation, RSVP, map, schedule and hotels in one place: what to include and what to leave out.",
    intro: "A traditional invitation suite splits information across several cards: the invitation, an RSVP card, a details card, maybe a map and a hotel insert. An all-in-one wedding invitation puts all of that, plus the RSVP, behind a single link or a single folded card. This guide explains what an all-in-one invitation should contain, how it compares with a separate wedding website, and which sections you can safely leave out.",
    heroImage: "/images/blog/pexels/20485643.jpg",
    imageAlt: "Wedding invitation with rings on a sage envelope",
    datePublished: "2026-11-17",
    readingTime: 6,
    author,
    quickAnswer: "An all-in-one wedding invitation combines the invitation, details and RSVP in one piece: a single digital link, or a printed card that folds or tears off. It should include the names, date, time, venue with directions, schedule, dress code, accommodation if guests travel, and the RSVP. It replaces several inserts and, for most weddings, a separate wedding website.",
    tool: { variant: "invitation", title: "See an all-in-one invitation with your names", subtitle: "Each design opens on an envelope and holds the schedule, map, hotels and RSVP." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Printed or digital all-in-one?",
        body: `<p>“All-in-one” describes two different products. On paper, it’s a single card where the RSVP tears off or the details fold inside, which saves on inserts and postage. Digitally, it’s one link that holds everything, which also lets you update details after sending.</p>`,
        table: {
          caption: "What an all-in-one invitation replaces",
          head: ["Traditional piece", "All-in-one equivalent"],
          rows: [
            ["Invitation card", "Opening screen with names, date and venue"],
            ["Reception card", "Schedule section"],
            ["Details or directions card", "Venue section with a directions button"],
            ["Accommodation insert", "Hotels section"],
            ["RSVP card and envelope", "RSVP form"],
            ["Wedding website", "The same link, if the wedding is a single day"],
          ],
        },
      },
      {
        heading: "Sections to include",
        body: `<p>These are the sections we saw on FOLDÈ invitations on November 17, 2026. Couples can hide any section they don’t need.</p>
<ul>
<li><strong>Opening</strong>: envelope, then names, date and “save the date”.</li>
<li><strong>Story or welcome</strong>: a few lines from the couple.</li>
<li><strong>Countdown or date reveal</strong>.</li>
<li><strong>Venue</strong> with photo, address and directions.</li>
<li><strong>Schedule</strong> (“The Celebration”).</li>
<li><strong>Dress code</strong>, accommodation and menu.</li>
<li><strong>Gift note</strong>, RSVP and a guest photo gallery.</li>
</ul>`,
        figure: { ...live.venue, alt: "Venue section with photo, address and Get directions button", caption: "The venue section replaces a separate directions card." },
      },
      {
        heading: "What to leave out",
        body: `<ul>
<li>Events not everyone is invited to, such as the rehearsal dinner.</li>
<li>Long registry lists: one line or a link is enough.</li>
<li>Information that will change often; update the invitation and send one short message instead.</li>
<li>Sections you have nothing to put in. An empty menu section looks unfinished.</li>
</ul>`,
        figure: { ...live.hotels, alt: "Accommodations list with hotel prices and a menu section", caption: "Accommodation and menu sections, useful only if you fill them." },
      },
      {
        heading: "All-in-one invitation or wedding website?",
        body: `<p>A wedding website is useful for multi-day events, long travel guides or registries with many stores. For a typical wedding, an invitation that holds the details and RSVP covers what guests need, in the link they already have. The Knot’s 2026 Real Weddings Study puts the average U.S. guest count at 117: one link for 117 guests is easier to manage than 117 cards plus a website.</p>
<p>Our <a href="/blog/digital-wedding-invitations">digital wedding invitations guide</a> compares formats and costs; for the classic paper set, see <a href="/blog/wedding-invitation-suite">what a wedding invitation suite includes</a>.</p>`,
        figure: { ...more.guestGallery, alt: "Guest photo gallery section with a QR code and photo grid", caption: "After the wedding, the same link can collect guests’ photos through a QR code." },
      },
    ],
    faqs: [
      ["What is an all-in-one wedding invitation?", "A single invitation that contains the invitation, the practical details and the RSVP, either as one printed piece or as one digital link."],
      ["Do I still need a wedding website?", "Not for most single-day weddings. A website helps for multi-day events or extensive travel information."],
      ["Are all-in-one invitations cheaper?", "Usually: fewer printed pieces and one envelope on paper, no printing or postage digitally."],
      ["Can I update an all-in-one invitation after sending it?", "A digital one, yes. A printed one can’t be changed, so keep changeable details online."],
      ["Is an all-in-one invitation too casual for a formal wedding?", "No. The format is neutral; the design and wording set the formality."],
      ["What if some guests aren’t invited to every event?", "List only events everyone attends, and invite the smaller group separately."],
    ],
    methodology: `${productCheck}<p>The average guest count comes from The Knot Worldwide’s 2026 Real Weddings Study press release (February 18, 2026).</p>`,
    sources: [knot],
  },
  {
    slug: "wedding-invitation-suite",
    keyword: "wedding invitation suite",
    title: "Wedding Invitation Suite: All 8 Pieces Explained and the 4 You Can Skip",
    metaTitle: "Wedding Invitation Suite: 8 Pieces + the 4 You Can Skip",
    description: "The 8 pieces of a wedding invitation suite, from save-the-date to thank-you card, when each is sent, the 4 you can skip, and what a digital suite looks like.",
    excerpt: "Save-the-date, invitation, RSVP, details and reception cards: what each piece does and what it costs to mail.",
    intro: "A wedding invitation suite is the set of stationery guests receive before and after the wedding. Its size has grown with tradition, and so has its cost: each insert adds printing and weight. This guide lists every piece of a classic suite, what it’s for and when it’s sent, which pieces you can skip, and how the same information fits into a digital suite.",
    heroImage: "/images/blog/pexels/29821867.jpg",
    imageAlt: "Wedding invitation laid on white fabric",
    datePublished: "2026-11-17",
    readingTime: 7,
    author,
    quickAnswer: "A wedding invitation suite includes the main invitation, an RSVP card with its envelope, and usually a details card; many couples add a save-the-date beforehand and thank-you cards afterward. Reception, accommodation and map cards are optional. A digital suite puts the same information behind one link, which removes inserts and postage and allows updates.",
    tool: { variant: "invitation", title: "Preview a digital suite with your names", subtitle: "One link for the invitation, details and RSVP. Pick a design to see it." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Every piece of a wedding invitation suite",
        body: `<p>Not every wedding needs every piece. The table shows what each one does and whether it’s essential.</p>`,
        table: {
          caption: "Wedding invitation suite pieces",
          head: ["Piece", "Purpose", "When it goes out", "Essential?"],
          rows: [
            ["Save-the-date", "Announces date and place", "6–8 months before (8 for destinations)", "Recommended"],
            ["Invitation", "The formal invitation", "6–8 weeks before", "Yes"],
            ["RSVP card + envelope", "Collects replies", "With the invitation", "Yes, or an online RSVP"],
            ["Details card", "Website, dress code, schedule", "With the invitation", "Often"],
            ["Reception card", "Reception venue if different", "With the invitation", "Only if needed"],
            ["Accommodation / map card", "Hotels, directions", "With the invitation", "Only if guests travel"],
            ["Envelope liner, belly band, wax seal", "Decoration", "—", "No"],
            ["Thank-you card", "Thanks for attending and gifts", "Within a few months after", "Yes"],
          ],
        },
      },
      {
        heading: "What a full suite costs to mail",
        body: `<p>Since July 12, 2026, a USPS Forever stamp for a one-ounce letter costs $0.82 (FreightWaves). A thick suite with several inserts, a stamped RSVP envelope and a square or rigid envelope can need extra postage, so weigh one assembled suite at the post office before buying stamps.</p>
<p>For a wedding with The Knot’s 2026 average of 117 guests, sent to roughly half as many households, postage alone for the invitation and stamped RSVP envelopes quickly reaches around a hundred dollars before any extra weight.</p>`,
      },
      {
        heading: "Which pieces you can skip",
        body: `<ul>
<li><strong>Reception card</strong>: skip it if the reception is at the same place.</li>
<li><strong>Map and accommodation cards</strong>: put them online if few guests travel.</li>
<li><strong>Paper RSVP</strong>: replace it with an online RSVP; The Knot notes digital RSVPs let you send invitations closer to six weeks out.</li>
<li><strong>Decorative extras</strong>: liners and belly bands look lovely but add cost, not information.</li>
</ul>`,
        figure: { ...shot.collection, alt: "Collection of digital wedding invitation designs with wax-seal envelopes", caption: "Digital suites keep the visual identity: each design has its own envelope and seal." },
      },
      {
        heading: "The digital suite",
        body: `<p>A digital suite sends the save-the-date and the invitation as links, and folds the RSVP, details, reception, map and accommodation cards into sections of the invitation. On FOLDÈ, couples choose a design with an animated envelope, then fill in the sections they need; the same link can host a guest photo gallery after the wedding.</p>
<p>Many couples mix both: a printed invitation for grandparents and close family, a digital one for everyone else. Our <a href="/blog/all-in-one-wedding-invitations">all-in-one invitation guide</a> covers what to include.</p>`,
        figure: { ...live.atelier, alt: "Atelier Indigo digital invitation opening screen", caption: "The opening screen plays the role of the main invitation card." },
      },
      {
        heading: "Assembly order for paper suites",
        body: `<p>If you do print, stack the pieces in size order, largest at the bottom, with the invitation text facing up: invitation, then reception or details card, then the RSVP card tucked under the flap of its stamped envelope. Insert the stack so the text faces the back flap of the outer envelope.</p>`,
        figure: { ...live.dressCode, alt: "Dress code section with an illustration", caption: "A dress code once printed on a details card becomes a section with an illustration." },
      },
    ],
    faqs: [
      ["What is included in a wedding invitation suite?", "At minimum the invitation and a way to RSVP; usually a details card; often a save-the-date before and thank-you cards after."],
      ["Do I need a details card?", "Only if there is information that doesn’t fit on the invitation, such as a website, dress code or schedule."],
      ["Should save-the-dates match the invitation suite?", "Ideally yes, with the same palette and fonts, though it isn’t required."],
      ["How much postage does a wedding invitation need?", "It depends on weight and shape. A standard one-ounce letter takes a $0.82 Forever stamp (since July 12, 2026); weigh one complete suite."],
      ["Can a wedding invitation suite be fully digital?", "Yes. All pieces can be links or sections of one digital invitation."],
      ["When do thank-you cards go out?", "Within a few months after the wedding; sooner for gifts received before."],
    ],
    methodology: `${productCheck}<p>Timing follows The Knot’s save-the-date etiquette (updated April 17, 2025) and invitation timeline (updated July 14, 2026); postage from FreightWaves; guest count from The Knot Worldwide’s 2026 Real Weddings Study. The postage estimate is our own illustration, not a quote.</p>`,
    sources: [knotSaveDates, knotTimingDated, stamps, knot],
  },
  {
    slug: "wedding-invitations-with-floral-design",
    keyword: "wedding invitations with floral design",
    title: "Floral Wedding Invitations: 5 Styles and How to Match Them to Your Flowers",
    metaTitle: "Floral Wedding Invitations: 5 Styles, Palettes & Examples",
    description: "Choose a floral wedding invitation that matches your season, venue and bouquet: 5 styles from watercolor to pressed flowers, palettes and real design examples.",
    excerpt: "Watercolor, botanical or garden: how to pick a floral invitation and keep it readable.",
    intro: "Flowers are the most common motif on wedding invitations, which is exactly why floral designs can look generic. The ones that work echo something real about the day, the season, the venue or the bouquet, and leave the text room to breathe. This guide covers the main floral styles, how to match them to your wedding, palettes by season, and real floral designs we opened on a phone.",
    heroImage: "/images/blog/pexels/11503508.jpg",
    imageAlt: "Pale pink invitation with a ribbon and a single peony",
    datePublished: "2026-11-17",
    readingTime: 6,
    author,
    quickAnswer: "Choose a floral wedding invitation that echoes your real flowers, season or venue, and keep the flowers around the text, not behind it. Watercolor florals suit romantic and garden weddings, fine-line botanicals suit modern ones, and dense garden borders suit spring and summer. Limit the palette to two or three colors and check that names and date stay readable on a phone.",
    tool: { variant: "invitation", title: "Preview a floral design with your names", subtitle: "Try Bloom and the other designs from the FOLDÈ collection." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Floral styles and when they fit",
        body: `<p>Floral invitations fall into a few families. Picking the family first narrows the choice.</p>`,
        table: {
          caption: "Floral invitation styles",
          head: ["Style", "Looks like", "Best for"],
          rows: [
            ["Watercolor florals", "Soft painted petals, blended colors", "Romantic, garden and spring weddings"],
            ["Dense garden border", "Many flowers framing the text", "Summer, countryside, outdoor venues"],
            ["Fine-line botanicals", "Thin drawn stems and leaves", "Modern, minimal, city weddings"],
            ["Single bloom", "One rose, peony or sprig", "Elegant and formal weddings"],
            ["Dried and pressed", "Muted, textured florals", "Autumn, rustic and bohemian"],
          ],
        },
      },
      {
        heading: "Match the flowers to your wedding",
        body: `<ul>
<li><strong>Your bouquet</strong>: ask your florist for the main flowers and use the same family on the invitation.</li>
<li><strong>The season</strong>: peonies and ranunculus in spring, roses and wildflowers in summer, dahlias and dried grasses in autumn, greenery and white blooms in winter.</li>
<li><strong>The venue</strong>: a garden venue suits a garden border; a city loft suits fine lines.</li>
<li><strong>The palette</strong>: two or three flower colors plus a neutral background.</li>
</ul>`,
        figure: { ...more.bloom, alt: "Bloom invitation opening with a dense border of painted flowers around the names Lily and James", caption: "Bloom: a dense garden border, with the names in a clear central space." },
      },
      {
        heading: "Keep it readable",
        body: `<p>The most common problem with floral invitations is text placed over busy petals. On the Bloom design above, the flowers frame a calmer center where the names and date sit. Check the same on any design: the text should never cross a dense part of the illustration, especially on a small screen.</p>`,
        figure: { ...more.jardin, alt: "Le Jardin invitation with an arched balcony, cypress trees and flowers", caption: "Le Jardin: flowers and garden architecture around a clear sky behind the names." },
      },
      {
        heading: "Real floral designs",
        body: `<p>Floral designs listed on the FOLDÈ collections page on November 17, 2026 include Bloom (“Blossoming love”), Romantic Garden (“Enchanted floral garden romance”), Botanical Floral (“Soft floral petals and garden blooming”), Le Jardin (“A lush garden romance”) and Rosas (“Velvet roses and deep burgundy romance”). Excellence uses “architectural florals with champagne refinement” for a more formal look.</p>
<p>For more on restraint and typography, read our <a href="/blog/elegant-wedding-invitations">elegant wedding invitations guide</a>.</p>`,
        figure: { ...live.rosas, alt: "Rosas invitation opening screen", caption: "Rosas carries its roses through the sections, from the opening to the RSVP." },
      },
      {
        heading: "Carry the flowers through the suite",
        body: `<p>Repeat one floral element, not the whole illustration, on the save-the-date, the RSVP and the signage. A single stem from the invitation is enough on a welcome sign or a menu.</p>`,
        figure: { ...more.story, alt: "Story section in deep burgundy followed by a countdown title", caption: "The same palette continues into the story and countdown sections." },
      },
    ],
    faqs: [
      ["Are floral wedding invitations still in style?", "Yes. Florals are a lasting choice; what dates an invitation is clutter and poor contrast, not flowers."],
      ["Should the invitation flowers match my bouquet?", "It’s a nice touch, not a rule. Matching the flower family or the palette is enough."],
      ["What flowers suit a winter wedding invitation?", "Greenery, white roses, amaryllis, eucalyptus and berries."],
      ["Can a floral invitation be formal?", "Yes. A single bloom or fine-line botanicals with classic typography reads as formal."],
      ["How many colors should a floral invitation use?", "Two or three flower colors plus a neutral background keeps it calm."],
    ],
    methodology: productCheck,
    sources: [],
  },
  {
    slug: "photo-wedding-invitations",
    keyword: "photo wedding invitations",
    title: "Photo Wedding Invitations: How to Pick the Photo, Place the Names and Protect Privacy",
    metaTitle: "Photo Wedding Invitations: Choosing the Photo & Placing Text",
    description: "How to choose the photo for a wedding invitation, where to place the names, image quality, privacy and the best places for photos in a digital invitation.",
    excerpt: "Which photo to use, where to put the text, resolution and privacy, plus where photos belong in a digital invitation.",
    intro: "A photo invitation is personal in a way no illustration can be, but only if the picture is chosen for the job. The photo has to leave room for the names, survive a phone screen and say something about the couple. This guide covers which photos work, how to place the text, image quality, privacy, and where photos belong in a digital invitation, from the opening to the album and the guest gallery.",
    heroImage: "/images/blog/pexels/29821866.jpg",
    imageAlt: "Wedding invitation with a pink envelope and an illustrated couple card",
    datePublished: "2026-11-17",
    readingTime: 6,
    author,
    quickAnswer: "For a photo wedding invitation, choose a sharp, well-lit picture with calm space where the names can go, such as sky, a wall or soft background. Place the text over that space, add a subtle shadow for contrast, and use the original file rather than a screenshot. In a digital invitation, keep the best photo for the opening and put others in an album section.",
    tool: { variant: "invitation", title: "See your names on an invitation", subtitle: "Pick a design; in the editor you can replace the opening with your own video." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Which photos work on an invitation",
        body: `<table><caption>Photo checklist</caption><thead><tr><th>Works</th><th>Avoid</th></tr></thead><tbody>
<tr><td>Calm area for text (sky, wall, sea)</td><td>Busy backgrounds behind the names</td></tr>
<tr><td>Sharp, original file</td><td>Screenshots and messaging-app copies</td></tr>
<tr><td>Natural light</td><td>Strong filters that age quickly</td></tr>
<tr><td>Portrait orientation for phones</td><td>Wide landscapes cropped to a sliver</td></tr>
<tr><td>A picture you both like</td><td>A photo with other people who may object</td></tr>
</tbody></table>`,
      },
      {
        heading: "Placing the names and date",
        body: `<ul>
<li>Put the text in the calmest third of the image, usually the top or bottom.</li>
<li>Use white or ivory text with a soft shadow on photos; check it at arm’s length on a phone.</li>
<li>Don’t cover faces or hands with text.</li>
<li>Keep the date and venue in a plain section below the photo if the picture is busy.</li>
</ul>`,
        figure: { ...live.editorial, alt: "Editorial invitation opening with names over an illustrated garden scene", caption: "Names placed in the calm upper area, away from the figures." },
      },
      {
        heading: "Where photos belong in a digital invitation",
        body: `<p>A digital invitation has more room than a card, so you don’t have to pick a single photo. On FOLDÈ designs (checked November 17, 2026) there are three natural places:</p>
<ul>
<li><strong>The opening</strong>: couples can upload their own video for the opening screen in the editor.</li>
<li><strong>An album section</strong> (“Photo album” or “Memories”) that swipes through a few pictures.</li>
<li><strong>The guest gallery</strong>: after the wedding, guests add their own photos by link or QR code.</li>
</ul>`,
        figure: { ...more.album, alt: "Photo album section showing a swipeable couple photo on the beach", caption: "The album section of the Rosas design, shown with its demo photos." },
      },
      {
        heading: "Image quality",
        body: `<p>Use the original file from the camera or photographer. On FOLDÈ, couple photos are resized to a maximum of 1,600 pixels when uploaded, which is plenty for a phone screen while keeping the invitation fast to open. For print, ask your printer for their minimum resolution, often 300 dpi at the printed size.</p>`,
      },
      {
        heading: "Privacy",
        body: `<p>A digital invitation can be forwarded. Avoid photos that show other people without their agreement, children who aren’t yours, or your home’s exterior. Guest photos uploaded after the wedding stay in a private gallery reached through the couple’s link.</p>`,
        figure: { ...more.guestGallery, alt: "Guest photo gallery section with QR code", caption: "Guests can add their photos by link or QR code after the wedding." },
      },
    ],
    faqs: [
      ["What photo should we use on our wedding invitation?", "A sharp engagement or couple photo with a calm area for the text. Portrait orientation works best on phones."],
      ["Can we use a professional engagement photo?", "Yes, if your photographer’s license allows it; most do for personal use like invitations."],
      ["How do we make text readable on a photo?", "Place it over a calm area, use light text with a soft shadow, and test on a phone."],
      ["Are photo invitations formal enough?", "They can be. A black-and-white photo with classic typography looks formal."],
      ["Can guests share their own photos after the wedding?", "With a digital invitation that includes a guest gallery, yes, through a link or QR code."],
    ],
    methodology: productCheck,
    sources: [],
  },
  {
    slug: "vintage-wedding-invitations",
    keyword: "vintage wedding invitations",
    title: "Vintage Wedding Invitations: 5 Eras From Victorian to the 1970s, Without Looking Dated",
    metaTitle: "Vintage Wedding Invitations: 5 Era Styles + Wording Tips",
    description: "Five vintage wedding invitation styles by era, from Victorian to the 1970s, with the typography, colors and wording of each and how to keep them modern and readable.",
    excerpt: "Victorian, Art Deco, mid-century: the cues of each era and how to use them without looking dated.",
    intro: "“Vintage” covers a century of styles, from Victorian flourishes to 1970s florals, and an invitation feels authentic when it commits to one of them. The trick is to borrow the era’s typography, colors and ornaments while keeping modern readability. This guide breaks down vintage styles by era, gives wording that fits each, and shows how to translate them to a digital invitation without losing the charm.",
    heroImage: "/images/blog/pexels/29395419.jpg",
    imageAlt: "Vintage-style invitation envelope with a wax seal in soft shadow",
    datePublished: "2026-11-17",
    readingTime: 6,
    author,
    quickAnswer: "A vintage wedding invitation works when it picks one era and borrows its cues: ornate scripts and borders for Victorian, geometric gold for 1920s Art Deco, clean serifs and pastel for mid-century, warm florals for the 1970s. Keep one decorative typeface at most, readable details, and a palette of two or three aged tones such as ivory, sepia and muted gold.",
    tool: { variant: "wording", event: "wedding", title: "Draft vintage-style wording", subtitle: "The formal tone suits most vintage invitations. Add your names and copy the text." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Vintage styles by era",
        body: `<p>Pick the era that matches your venue, dress or music, then use its cues consistently.</p>`,
        table: {
          caption: "Vintage invitation cues by era",
          head: ["Era", "Typography", "Colors", "Ornament"],
          rows: [
            ["Victorian (1840s–1900)", "Ornate script, engraved serifs", "Ivory, deep burgundy, black", "Lace borders, flourishes"],
            ["Art Nouveau (1890s–1910s)", "Flowing, organic letters", "Sage, gold, cream", "Curving vines and florals"],
            ["Art Deco (1920s)", "Geometric sans and tall serifs", "Black, gold, ivory", "Sunbursts, fans, frames"],
            ["Mid-century (1950s–60s)", "Clean serifs, casual script", "Pastel pink, mint, blue", "Simple frames, small motifs"],
            ["1970s", "Rounded, warm display type", "Rust, mustard, olive", "Daisies, arches"],
          ],
        },
      },
      {
        heading: "Keep it fresh, not dated",
        body: `<ul>
<li><strong>One decorative font</strong> for names only; details in a readable serif.</li>
<li><strong>Aged palette, modern contrast</strong>: sepia and ivory, but dark enough text to read on a phone.</li>
<li><strong>Real texture, sparingly</strong>: a paper grain or wax seal, not every effect at once.</li>
<li><strong>Modern information</strong>: an RSVP link or QR code fits a vintage design perfectly well.</li>
</ul>`,
        figure: { ...shot.envelope, alt: "Wax-sealed envelope on a digital invitation", caption: "A wax seal is a vintage cue that works on paper and on screen." },
      },
      {
        heading: "Vintage wording",
        body: `<p>Vintage invitations traditionally use formal, third-person wording with the date and time spelled out.</p>
<blockquote>Mr. and Mrs. Robert Carter
request the pleasure of your company
at the marriage of their daughter
Emma Rose
to
Mr. Lucas Daniel Martin
on Saturday, the twelfth of September
at half past four o’clock</blockquote>
<blockquote>Together with their families
Emma Carter and Lucas Martin
invite you to join them in the celebration of their marriage</blockquote>
<p>More options are in our <a href="/blog/wedding-invitation-wording-examples">wedding invitation wording examples</a> and <a href="/blog/traditional-wedding-invitations">traditional invitations guide</a>.</p>`,
        figure: { ...live.atelier, alt: "Atelier Indigo invitation with ornate illustrated architecture", caption: "Atelier Indigo uses ornate illustration with a clean serif for the names." },
      },
      {
        heading: "Vintage on a digital invitation",
        body: `<p>On a phone, vintage cues come from the envelope, the paper texture and the typography. Designs with a wax seal, ivory paper and serif capitals, such as Atelier Indigo or Rosas, carry the feel without imitating old print badly. Keep sections like the schedule and RSVP clean: readability is part of good design in any era.</p>`,
        figure: { ...more.story, alt: "Burgundy story section with serif headings", caption: "Deep burgundy and serif headings give a Victorian note to the Rosas design." },
      },
    ],
    faqs: [
      ["What makes a wedding invitation look vintage?", "Era-specific typography, an aged color palette and period ornaments such as lace borders, Art Deco frames or wax seals."],
      ["Can vintage invitations be digital?", "Yes. Texture, seals and typography translate well to a screen as long as the text stays readable."],
      ["Which vintage era is easiest to pull off?", "Art Deco and mid-century, because their typography is clean and readable."],
      ["Should vintage invitations use formal wording?", "Usually. Spelled-out dates and third-person wording match most vintage styles."],
      ["What colors are vintage?", "Ivory, sepia, muted gold, dusty rose, sage and burgundy, depending on the era."],
    ],
    methodology: `<p>Era descriptions are general design history, written by the FOLDÈ editorial team. Wording samples are original; names are fictional.</p>${productCheck}`,
    sources: [],
  },
  {
    slug: "traditional-wedding-invitations",
    keyword: "traditional wedding invitations",
    title: "Traditional Wedding Invitations: The 9-Part Order, Wording Rules and 4 Classic Examples",
    metaTitle: "Traditional Wedding Invitations: Wording Rules + 4 Examples",
    description: "The conventions of a traditional wedding invitation: the 9-part order, host line, honour vs pleasure, spelled-out dates and RSVP, with 4 classic examples by host.",
    excerpt: "Host line, “honour” or “pleasure”, spelled-out dates and the classic order of information.",
    intro: "A traditional wedding invitation follows conventions that guests recognize instantly: who hosts, the phrase that introduces the ceremony, the date written in words and a fixed order of information. Knowing them lets you follow them exactly or break them on purpose. This guide explains each convention, gives classic examples for different hosts, and shows how a traditional invitation translates to a digital one without losing its formality.",
    heroImage: "/images/blog/pexels/36617804.jpg",
    imageAlt: "Formal wedding invitation with blue accents and classic typography",
    datePublished: "2026-11-17",
    readingTime: 7,
    author,
    quickAnswer: "A traditional wedding invitation names the hosts first, then uses “request the honour of your presence” for a ceremony in a house of worship or “the pleasure of your company” elsewhere. The couple’s full names follow, then the date and time spelled out in words, the venue and city, and a reception line. Abbreviations and numerals are avoided, except for Mr., Mrs. and Ms.",
    tool: { variant: "wording", event: "wedding", title: "Draft traditional wording", subtitle: "Choose the formal tone and add your names; copy the text into any design." },
    ctaAfter: 1,
    sections: [
      {
        heading: "The order of a traditional invitation",
        body: `<p>Classic invitations follow the same sequence, line by line.</p>`,
        table: {
          caption: "Traditional invitation structure",
          head: ["Line", "Example"],
          rows: [
            ["Hosts", "Mr. and Mrs. Robert Carter"],
            ["Request line", "request the honour of your presence"],
            ["Occasion", "at the marriage of their daughter"],
            ["Couple", "Emma Rose to Mr. Lucas Daniel Martin"],
            ["Date", "Saturday, the twelfth of September"],
            ["Year (optional)", "two thousand twenty-six"],
            ["Time", "at half after four o’clock"],
            ["Venue and city", "Saint Mary’s Church, Burlington, Vermont"],
            ["Reception line", "Reception to follow"],
          ],
        },
      },
      {
        heading: "The conventions, one by one",
        body: `<ul>
<li><strong>“Honour” or “pleasure”</strong>: by long-standing convention, “the honour of your presence” is used for ceremonies in a house of worship and “the pleasure of your company” for other venues. Many couples now use either freely; just stay consistent across the suite.</li>
<li><strong>Spelled out</strong>: dates and times are written in words (“the twelfth of September”, “four o’clock”); “half after four” is the traditional form of 4:30.</li>
<li><strong>No abbreviations</strong>: “Street”, “Saint”, state names in full; only Mr., Mrs. and Ms. are abbreviated.</li>
<li><strong>Third person</strong>: the invitation speaks of the couple, not as the couple.</li>
<li><strong>Hosts named</strong>: whoever hosts the wedding is named first; if the couple hosts, their names lead.</li>
</ul>`,
        figure: { ...more.story, alt: "Burgundy invitation section with formal serif typography", caption: "Formal typography and a single deep color keep a traditional tone on screen." },
      },
      {
        heading: "Classic examples by host",
        body: `<p><strong>Bride’s parents hosting</strong></p>
<blockquote>Mr. and Mrs. Robert Carter
request the honour of your presence
at the marriage of their daughter
Emma Rose
to
Mr. Lucas Daniel Martin</blockquote>
<p><strong>Both families hosting</strong></p>
<blockquote>Mr. and Mrs. Robert Carter
and
Mr. and Mrs. Paul Martin
request the pleasure of your company
at the marriage of their children
Emma Rose and Lucas Daniel</blockquote>
<p><strong>Couple hosting</strong></p>
<blockquote>The pleasure of your company is requested
at the marriage of
Miss Emma Rose Carter
and
Mr. Lucas Daniel Martin</blockquote>
<p><strong>Together with their families</strong></p>
<blockquote>Together with their families
Emma Rose Carter and Lucas Daniel Martin
request the pleasure of your company
at the celebration of their marriage</blockquote>`,
      },
      {
        heading: "RSVP the traditional way",
        body: `<p>Traditionally, guests replied by handwritten note; reply cards came later. Today, a reply card or an online RSVP is perfectly acceptable on a traditional invitation. Write the request formally: “The favour of a reply is requested by the fifteenth of August.” The Knot suggests sending invitations about eight weeks ahead when replies come by paper card.</p>`,
        figure: { ...more.rsvpDark, alt: "Formal RSVP form on a dark invitation background", caption: "An online RSVP can keep the same formal tone as the invitation." },
      },
      {
        heading: "A traditional invitation, delivered digitally",
        body: `<p>Traditional wording works on any medium. On a digital invitation, keep the formal wording on the opening and in the welcome text, use a classic serif, and let the practical sections (map, schedule, RSVP) stay plain. Print a few copies for guests who expect paper.</p>
<p>See our <a href="/blog/wedding-invitation-wording-examples">20 wording examples</a> and <a href="/blog/elegant-wedding-invitations">elegant invitation design rules</a>.</p>`,
        figure: { ...live.atelier, alt: "Atelier Indigo invitation opening screen in ivory", caption: "Ivory paper and serif capitals: traditional cues on a phone." },
      },
    ],
    faqs: [
      ["Is it “honor” or “honour” on a wedding invitation?", "Traditional invitations use the British “honour” and “favour”; American spelling is also accepted. Choose one and use it throughout."],
      ["When do you use “the pleasure of your company”?", "By convention, for ceremonies outside a house of worship, and for reception invitations."],
      ["Should the year be on a traditional invitation?", "It’s optional on invitations; it is more common on wedding announcements."],
      ["How do you write the time traditionally?", "In words: “four o’clock”, “half after four o’clock”. Avoid “p.m.”; add “in the evening” if needed."],
      ["Can a traditional invitation have an online RSVP?", "Yes. Keep the wording formal and offer a paper option to guests who prefer it."],
      ["Who is named as host?", "Whoever hosts the wedding, traditionally the bride’s parents; today often both families or the couple."],
    ],
    methodology: `<p>The conventions above are long-standing North American stationery conventions summarized by the FOLDÈ editorial team; they vary between etiquette guides, which is why we note where modern practice differs. Timing follows The Knot’s invitation timeline (updated July 14, 2026). Examples are original; names are fictional.</p>${productCheck}`,
    sources: [knotTimingDated],
  },
  {
    slug: "winter-wedding-invitations",
    keyword: "winter wedding invitations",
    title: "Winter Wedding Invitations: Send Dates for December to February, Palettes and Wording",
    metaTitle: "Winter Wedding Invitations: Send Dates, Colors & Wording",
    description: "When to send winter wedding invitations around the holidays, winter palettes and motifs, weather details guests need, and wording examples for December to February.",
    excerpt: "Send dates for December, January and February weddings, plus palettes, weather notes and wording.",
    intro: "Winter weddings come with a scheduling problem the rest of the year doesn’t have: invitations land in the middle of holiday mail, holiday travel and year-end busyness. They also need practical notes about weather and daylight. This guide gives send dates for December, January and February weddings, winter palettes and motifs that don’t look like a holiday card, the details guests need, and wording examples.",
    heroImage: "/images/blog/pexels/34579982.jpg",
    imageAlt: "Pale wedding stationery flat lay with pearls",
    datePublished: "2026-11-17",
    readingTime: 6,
    author,
    quickAnswer: "Send winter wedding invitations six to eight weeks ahead, leaning early around the holidays: early October to mid-November for a December wedding, early November to mid-December for January, and after the holiday rush for February, according to The Knot. Use a winter palette without holiday clichés, and add weather, parking and coat details for guests.",
    tool: { variant: "invitation", title: "Preview a winter-ready design", subtitle: "Type your names and choose a design; add weather and parking notes in the details." },
    ctaAfter: 1,
    sections: [
      {
        heading: "When to send winter wedding invitations",
        body: `<p>The Knot’s month-by-month timeline gives these windows for winter weddings:</p>`,
        table: {
          caption: "Send windows for winter weddings (The Knot)",
          head: ["Wedding month", "Send invitations", "Why"],
          rows: [
            ["December", "Early October – mid-November", "Slow wedding month; lean early because of the holiday rush"],
            ["January", "Early November – mid-December", "Send early to beat holiday mail"],
            ["February", "Early December – mid-January", "Send after the holiday rush"],
          ],
        },
      },
      {
        heading: "Winter palettes without holiday clichés",
        body: `<ul>
<li><strong>Midnight and silver</strong>: navy or deep blue with cool metallic accents.</li>
<li><strong>Evergreen and ivory</strong>: forest green with warm white.</li>
<li><strong>Burgundy and blush</strong>: deep red that isn’t Christmas red.</li>
<li><strong>Frost</strong>: white, pale grey and soft blue.</li>
</ul>
<p>Avoid putting red and green together with holly or ornaments unless the wedding is genuinely Christmas-themed; otherwise guests read it as a holiday card.</p>`,
        figure: { ...live.countdown, alt: "Countdown section in deep green", caption: "Deep evergreen in the Excellence design reads as wintery without holiday motifs." },
      },
      {
        heading: "Details winter guests need",
        body: `<ul>
<li>Indoor or outdoor ceremony, and whether there’s heating.</li>
<li>Coat check, cloakroom or shuttle from parking.</li>
<li>Sunset time if photos are planned outside.</li>
<li>A weather backup plan, or where updates will be posted.</li>
<li>Footwear note for snow, ice or gravel.</li>
</ul>
<p>A digital invitation is useful here: if the weather changes the plan, update the schedule and send one message.</p>`,
        figure: { ...live.dressCode, alt: "Dress code section with an illustration and accommodation list", caption: "A dress code section is the place for “bring a warm layer”." },
      },
      {
        heading: "Winter wedding wording",
        body: `<blockquote>Together with their families
Emma Carter and Lucas Martin
request the pleasure of your company
on a winter evening
Saturday, the sixteenth of January</blockquote>
<blockquote>Cold outside, warm hearts inside.
Join us for Emma & Lucas’ winter wedding</blockquote>
<blockquote>A candlelit celebration
for Emma & Lucas
Dinner, dancing and warm drinks to follow</blockquote>
<blockquote>Ceremony indoors · Coat check available
Please dress warmly for photos by the lake</blockquote>`,
        figure: { ...live.rosas, alt: "Rosas invitation opening screen", caption: "Deep burgundy suits a winter evening wedding." },
      },
    ],
    faqs: [
      ["When should I send invitations for a December wedding?", "Between early October and mid-November, leaning early because of holiday mail and travel (The Knot)."],
      ["Do winter wedding invitations need save-the-dates?", "Yes, especially near the holidays, when guests’ calendars fill early."],
      ["What colors work for winter wedding invitations?", "Navy and silver, evergreen and ivory, burgundy and blush, or a frosty white and pale blue."],
      ["Should I mention the weather on the invitation?", "Mention what guests should prepare for: indoor or outdoor, coat check, footwear. Put changeable details online."],
      ["Is a New Year’s Eve wedding invitation different?", "Send it earlier, around eight weeks or more, and include transport home and the end time."],
    ],
    methodology: `<p>Send windows come from The Knot’s invitation timeline (updated July 14, 2026), read on November 17, 2026. Palettes and wording are original to FOLDÈ; names are fictional.</p>${productCheck}`,
    sources: [knotTimingDated],
  },
  {
    slug: "wedding-welcome-signs",
    keyword: "wedding welcome signs",
    title: "Wedding Welcome Signs: 15 Wording Ideas, Sizes and Where to Place Them",
    metaTitle: "Wedding Welcome Signs: 15 Wording Ideas, Sizes & Placement",
    description: "What to write on a wedding welcome sign, common sizes and materials, where to place it, and how to add a QR code for guests’ photos, with 15 wording ideas.",
    excerpt: "Fifteen wording ideas, sizes, materials, placement and the QR code trick for guest photos.",
    intro: "A welcome sign is the first piece of wedding stationery guests see on the day, and often the most photographed. It tells them they’re in the right place, sets the tone and can carry one practical message, such as an unplugged ceremony or a QR code for photos. This guide covers wording, common sizes and materials, placement, and how to match the sign to your invitation.",
    heroImage: "/images/blog/pexels/30740005.jpg",
    imageAlt: "Wooden easel with a white Bienvenidos welcome sign in a garden",
    datePublished: "2026-11-17",
    readingTime: 5,
    author,
    quickAnswer: "A wedding welcome sign greets guests at the entrance with the couple’s names, the date and a short welcome line. Common sizes are 18×24 and 24×36 inches, on foam board, acrylic, wood or a mirror, displayed on an easel at eye level. Add at most one practical message, such as an unplugged ceremony or a QR code for guests to share photos.",
    tool: { variant: "invitation", title: "Match your sign to your invitation", subtitle: "Pick the design first; reuse its colors and fonts on the sign." },
    ctaAfter: 1,
    sections: [
      {
        heading: "15 welcome sign wording ideas",
        body: `<p><strong>Classic</strong></p>
<blockquote>1. Welcome to the wedding of Emma & Lucas · September 12, 2026</blockquote>
<blockquote>2. Welcome to our wedding · The Carter–Martin celebration</blockquote>
<blockquote>3. Together with their families, Emma and Lucas welcome you</blockquote>
<p><strong>Warm and modern</strong></p>
<blockquote>4. Welcome to the beginning of our forever</blockquote>
<blockquote>5. We’re so glad you’re here</blockquote>
<blockquote>6. Thank you for being part of our story</blockquote>
<blockquote>7. Come for the love, stay for the party</blockquote>
<p><strong>Bilingual and destination</strong></p>
<blockquote>8. Bienvenidos · Welcome · Emma & Lucas</blockquote>
<blockquote>9. Benvenuti in Positano · Welcome to our wedding</blockquote>
<p><strong>With a practical message</strong></p>
<blockquote>10. Welcome! Please turn off your phones; our photographer has it covered</blockquote>
<blockquote>11. Choose a seat, not a side</blockquote>
<blockquote>12. Share your photos: scan the code</blockquote>
<blockquote>13. Cocktails this way →</blockquote>
<p><strong>Playful</strong></p>
<blockquote>14. Eat, drink and be married</blockquote>
<blockquote>15. The adventure begins here</blockquote>`,
      },
      {
        heading: "Sizes and materials",
        body: `<p>These are the most common choices; check your easel’s capacity and the venue’s rules on stands.</p>`,
        table: {
          caption: "Welcome sign sizes and materials",
          head: ["Option", "Typical use", "Note"],
          rows: [
            ["18×24 in (≈ 46×61 cm)", "Small venues, table display", "Readable up close"],
            ["24×36 in (≈ 61×91 cm)", "Most ceremonies", "Readable from a few meters"],
            ["Foam board", "Budget, lightweight", "Bends in humidity"],
            ["Acrylic", "Modern, elegant", "Check readability against the background"],
            ["Wood", "Rustic, garden", "Heavier; secure the easel"],
            ["Mirror", "Glamorous, vintage", "Reflections can hide text in photos"],
          ],
        },
      },
      {
        heading: "Where to place it",
        body: `<ul>
<li>At the ceremony entrance or the start of the aisle, at eye level.</li>
<li>Out of the main walking path so guests can stop and read.</li>
<li>Lit after dark: a small spotlight or candles for evening receptions.</li>
<li>Weighted or secured outdoors; wind topples easels.</li>
</ul>`,
        figure: { ...more.guestGallery, alt: "Guest photo gallery with QR code on a digital invitation", caption: "The QR code from the invitation’s guest gallery can be printed on the sign." },
      },
      {
        heading: "Add a QR code for guest photos",
        body: `<p>If your digital invitation has a guest gallery, print its QR code on the welcome sign or a small table card. On FOLDÈ, the gallery section shows a QR code and a link where guests upload photos from their phones; the photos go to a private gallery for the couple. Test the printed code with two different phones before the day.</p>
<p>FOLDÈ doesn’t print signs; use the code and your invitation’s palette with your sign maker.</p>`,
        figure: { ...more.album, alt: "Photo album section of a digital invitation", caption: "Before the wedding, the album section shows the couple’s photos; after, guests add theirs." },
      },
      {
        heading: "Match the sign to the invitation",
        body: `<p>Reuse the invitation’s fonts and palette and one motif, such as a flower or a monogram. Guests will recognize the design they opened on their phone. For more on cohesive design, read our <a href="/blog/elegant-wedding-invitations">elegant invitations guide</a>.</p>`,
        figure: { ...more.bloom, alt: "Bloom floral invitation opening screen", caption: "A floral invitation like Bloom can lend a single stem to the sign." },
      },
    ],
    faqs: [
      ["What size should a wedding welcome sign be?", "24×36 inches is the most common for ceremonies; 18×24 inches works for small venues or tables."],
      ["What do you write on a wedding welcome sign?", "The couple’s names, the date and a short welcome line, plus at most one practical message."],
      ["Where should the welcome sign go?", "At the ceremony entrance, at eye level and out of the main walking path."],
      ["Should the welcome sign match the invitation?", "Ideally, yes: same fonts, palette and one shared motif."],
      ["Can I put a QR code on a welcome sign?", "Yes, for a photo gallery or the schedule. Test it with several phones before the day."],
    ],
    methodology: `<p>Sizes are standard print formats; wording ideas are original to FOLDÈ. FOLDÈ does not make physical signs; the QR code and gallery described come from its digital invitations.</p>${productCheck}`,
    sources: [],
  },
  {
    slug: "couples-shower-invitations",
    keyword: "couples shower invitations",
    title: "Couples Shower Invitations: 16 Wording Examples and How They Differ From a Bridal Shower",
    metaTitle: "Couples Shower Invitations: 16 Wording Examples",
    description: "How a couples or co-ed wedding shower invitation differs from a bridal shower one: who hosts, who to invite, timing, registry and 16 wording examples.",
    excerpt: "Who to invite to a co-ed shower, when to send invitations, and 16 wording examples.",
    intro: "A couples shower, also called a co-ed or Jack and Jill shower, celebrates both partners with friends and family of any gender. The invitation has to make that clear, because many guests still expect a bridal shower. This guide covers how it differs from a bridal shower, who hosts and who to invite, timing, the registry line, and 16 wording examples, from dinner parties to backyard barbecues.",
    heroImage: "/images/blog/pexels/29821867.jpg",
    imageAlt: "Wedding stationery laid on white fabric",
    datePublished: "2026-11-17",
    readingTime: 6,
    author,
    quickAnswer: "A couples shower invitation names both partners as guests of honor and says “couples shower” or “co-ed wedding shower” so guests know partners are invited. Send it four to six weeks ahead, or about two months for travelers, invite only people on the wedding list, name the hosts and RSVP contact, and add one line with the registry.",
    tool: { variant: "wording", event: "shower", title: "Write your shower invitation", subtitle: "Put both names in “Guest of honor” (for example “Emma & Lucas”), add the host and pick a tone." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Couples shower vs bridal shower",
        body: `<p>The difference is who is celebrated and who attends.</p>`,
        table: {
          caption: "Couples shower vs bridal shower",
          head: ["", "Bridal shower", "Couples shower"],
          rows: [
            ["Guests of honor", "The bride", "Both partners"],
            ["Guests", "Traditionally women", "Friends and family of any gender, often with partners"],
            ["Typical format", "Brunch, tea, luncheon", "Dinner, barbecue, cocktail party"],
            ["Gifts", "Registry, often personal items", "Registry, often home and kitchen"],
            ["Invitation must say", "Bridal shower", "Couples shower / co-ed shower"],
          ],
        },
      },
      {
        heading: "Hosts, guest list and timing",
        body: `<ul>
<li><strong>Hosts</strong>: friends, siblings or either family; the host sends invitations and receives replies.</li>
<li><strong>Guest list</strong>: The Knot notes that a couples shower gives more flexibility on who to invite, but the rule doesn’t change: everyone invited must also be invited to the wedding.</li>
<li><strong>Partners</strong>: say whether guests’ partners are invited (“and guest”) on the envelope or message.</li>
<li><strong>Timing</strong>: four to six weeks before the shower, about two months for out-of-town guests, with an RSVP date at least two weeks before (The Knot).</li>
</ul>`,
        figure: { ...shot.rsvp, alt: "RSVP form on a phone", caption: "Ask for replies to the host, with the number of guests coming." },
      },
      {
        heading: "16 couples shower wording examples",
        body: `<p><strong>Classic</strong></p>
<blockquote>1. Please join us for a couples shower
honoring Emma Carter and Lucas Martin
Saturday, August 8 · 6 pm</blockquote>
<blockquote>2. You are invited to a co-ed wedding shower
in honor of Emma & Lucas</blockquote>
<blockquote>3. A dinner party celebrating the soon-to-be newlyweds</blockquote>
<blockquote>4. Hosted by Claire and Tom Martin
in honor of Emma & Lucas</blockquote>
<p><strong>Casual and playful</strong></p>
<blockquote>5. Love is in the air… and so is barbecue!
Couples shower for Emma & Lucas</blockquote>
<blockquote>6. Beers, cheers and almost-married peers</blockquote>
<blockquote>7. Jack and Jill are tying the knot!
Come celebrate Emma & Lucas</blockquote>
<blockquote>8. Taco ’bout love: a fiesta for Emma & Lucas</blockquote>
<blockquote>9. Sip, sip, hooray! A wine night for the happy couple</blockquote>
<p><strong>Home and kitchen themes</strong></p>
<blockquote>10. They’re building a home together.
Help us stock it! Kitchen shower for Emma & Lucas</blockquote>
<blockquote>11. Bring your favorite recipe
for Emma & Lucas’ first cookbook</blockquote>
<blockquote>12. Stock the bar for Emma & Lucas</blockquote>
<p><strong>Partners and guests</strong></p>
<blockquote>13. Bring your partner: this one’s for everyone!</blockquote>
<blockquote>14. Couples and friends welcome</blockquote>
<p><strong>Registry lines</strong></p>
<blockquote>15. Emma & Lucas are registered at Crate &amp; Barrel and on their wedding website.</blockquote>
<blockquote>16. Your company is the best gift; the registry is linked below if you’d like it.</blockquote>`,
      },
      {
        heading: "Party ideas that suit a co-ed crowd",
        body: `<ul>
<li>Backyard barbecue or picnic.</li>
<li>Wine or beer tasting.</li>
<li>Game night with couple trivia.</li>
<li>Cooking class or dinner party around the kitchen registry.</li>
</ul>
<p>For the traditional version, see our <a href="/blog/bridal-shower-invitation-wording">bridal shower wording guide</a>.</p>`,
        figure: { ...shot.collection, alt: "Collection of FOLDÈ wedding invitation designs", caption: "FOLDÈ makes the wedding invitation that follows; the shower invitation can stay simple." },
      },
      {
        heading: "Paper or digital?",
        body: `<p>A couples shower is usually informal, so a message, an email or a digital card works well. Keep it separate from the wedding invitation, whose schedule all wedding guests can see. FOLDÈ, which publishes this guide, makes digital wedding invitations, not shower invitations.</p>`,
        figure: { ...shot.timeline, alt: "Wedding schedule section of a digital invitation", caption: "Don’t add the shower to the wedding schedule unless every wedding guest is invited." },
      },
    ],
    faqs: [
      ["What is a couples shower?", "A wedding shower that celebrates both partners, with guests of any gender, often as a dinner or party rather than a brunch."],
      ["Who hosts a couples shower?", "Friends, siblings or either family. The couple shouldn’t host their own shower."],
      ["Can you have both a bridal shower and a couples shower?", "Yes, as long as guests aren’t expected to bring a gift to both."],
      ["Should guests bring their partners?", "Usually yes at a couples shower; say so clearly on the invitation."],
      ["When should couples shower invitations go out?", "Four to six weeks before, or about two months if guests travel."],
      ["Is it okay to include registry information?", "Yes. As for any shower, one line or a link to the wedding website is expected."],
    ],
    methodology: `<p>Timing and guest-list guidance follow The Knot’s bridal shower invitation etiquette (updated August 15, 2025), which also covers couples showers. Wording examples are original to FOLDÈ; names are fictional. Screenshots show FOLDÈ wedding invitation designs captured on folde-wedding.com on November 17, 2026.</p>`,
    sources: [knotShower],
  },
];
