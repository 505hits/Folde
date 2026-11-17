// English articles written for English-language searches (November 2026 plan:
// docs/seo/blog-plan-2026-11.md). Each one is written individually: no shared
// filler, every product claim checked against folde-wedding.com on 2026-11-17.

export const IMG = "/images/blog/folde-2026-11";
export const author = { name: "FOLDÈ Editorial Team", role: "Invitation design & guest experience", href: "/approach", type: "Organization" };

export const shot = {
  editor: { src: `${IMG}/folde-live-preview-editor.webp`, width: 1200, height: 750 },
  collection: { src: `${IMG}/folde-invitation-template-collection.webp`, width: 1200, height: 750 },
  namesMobile: { src: `${IMG}/folde-creation-flow-names-mobile.webp`, width: 520, height: 1126, portrait: true },
  envelope: { src: `${IMG}/digital-invitation-wax-seal-envelope-mobile.webp`, width: 520, height: 1126, portrait: true },
  opening: { src: `${IMG}/digital-invitation-opening-screen-mobile.webp`, width: 520, height: 1126, portrait: true },
  timeline: { src: `${IMG}/digital-invitation-map-and-timeline-mobile.webp`, width: 520, height: 1126, portrait: true },
  rsvp: { src: `${IMG}/digital-invitation-rsvp-form-mobile.webp`, width: 520, height: 1126, portrait: true },
};

const testMethod = `<p>Product details in this guide come from a hands-on check of folde-wedding.com on <strong>November 17, 2026</strong>, in Chromium (Playwright 1.65) at 1440×900 and at a 390×844 mobile size. We started the creation flow with a test couple (“Emma &amp; Lucas”), opened the Rosas design, tapped the envelope and scrolled through the schedule, map and RSVP form. We did not submit a response on a live wedding, and we only describe features we saw on screen. Prices were read on the packages page the same day. FOLDÈ Wedding publishes this guide and sells digital invitations; independent sources are listed below.</p>`;

const knot = { label: "The Knot Worldwide — 2026 Real Weddings Study (press release, Feb. 18, 2026)", href: "https://www.theknotww.com/press-releases/the-knot-worldwide-unveils-2026-real-weddings-study", note: "10,474 U.S. couples married in 2025: average guest count 117, average spend $292 per guest." };
export const knotTiming = { label: "The Knot — When to send wedding invitations", href: "https://www.theknot.com/content/when-to-send-wedding-invitations", note: "Etiquette timeline for save-the-dates, invitations and RSVP deadlines." };
const zolaTiming = { label: "Zola — When should you send out your wedding invitations?", href: "https://www.zola.com/expert-advice/when-should-you-send-out-your-wedding-invitations", note: "Timing guidance, including a reply-by date about a month before the wedding." };
const stamps = { label: "FreightWaves — Price of Forever stamp reaches 82 cents", href: "https://www.freightwaves.com/news/price-of-forever-stamp-reaches-82-cents", note: "USPS 1-ounce letter stamp at $0.82 since July 12, 2026 (postcards $0.65)." };

export const originalPostsEn = [
  {
    slug: "digital-wedding-invitations",
    keyword: "digital wedding invitations",
    title: "Digital Wedding Invitations: How They Work and What to Include",
    metaTitle: "Digital Wedding Invitations: The Complete 2026 Guide",
    description: "What a digital wedding invitation is, what to put on it, how to send it and when it beats paper, with a real walkthrough and a cost comparison.",
    excerpt: "Formats, must-have details, sending etiquette and the real cost difference with paper, tested on a live product.",
    intro: "A digital wedding invitation can be a flat image in a group chat or a full experience with RSVP, map and schedule in one link. The difference matters to your guests. This guide explains the formats, the details every invitation needs, how and when to send it, and what it really costs compared with paper, with screenshots from a real invitation we opened on a phone.",
    heroImage: shot.collection.src,
    imageAlt: "Grid of FOLDÈ digital wedding invitation designs with wax-seal envelopes on phone screens",
    datePublished: "2026-11-17",
    readingTime: 9,
    author,
    quickAnswer: "A digital wedding invitation is an invitation guests open on their phone through a link, instead of receiving it by mail. The best ones include the names, date, time, venue with a map, a reply-by date and a built-in RSVP, and can be updated after sending. Send it six to eight weeks before the wedding, earlier for destination weddings.",
    tool: { variant: "invitation" },
    ctaAfter: 2,
    sections: [
      {
        heading: "What counts as a digital wedding invitation?",
        body: `<p>“Digital wedding invitation” covers four quite different things. Knowing which one you are choosing avoids most disappointments later.</p>
<ul>
<li><strong>An image or PDF</strong> of a printed design, sent by text or email. Cheap and fast, but it cannot collect replies or be corrected once sent.</li>
<li><strong>An e-card or “evite”</strong>: a card hosted on a platform, usually with a simple yes/no reply.</li>
<li><strong>A wedding website</strong>: a multi-page site with travel, registry and FAQ sections, often shared alongside a separate invitation.</li>
<li><strong>An interactive invitation</strong>: one mobile page that opens like an envelope, then carries the details, schedule, map and RSVP form. FOLDÈ Wedding makes this last kind.</li>
</ul>
<p>The right format depends on what you need the invitation to <em>do</em>. If you only need to announce the date, an image is enough. If you need replies, meal choices and a place to post changes, choose a format with a built-in RSVP.</p>`,
        table: {
          caption: "Digital invitation formats compared",
          head: ["Format", "Collects RSVPs", "Can be updated after sending", "Best for"],
          rows: [
            ["Image or PDF", "No", "No (you resend a file)", "Informal announcements"],
            ["E-card / evite", "Usually yes/no only", "Depends on the platform", "Small, casual events"],
            ["Wedding website", "Often, on a separate page", "Yes", "Guests needing travel and registry details"],
            ["Interactive invitation", "Yes, inside the invitation", "Yes", "One link that does the invitation and the logistics"],
          ],
        },
      },
      {
        heading: "What to include on a digital wedding invitation",
        body: `<p>Paper invitations spread information across several cards. A digital one can hold everything, which makes it tempting to add too much. Start with the essentials and add a section only when it answers a question guests will actually ask.</p>
<p><strong>Always include:</strong></p>
<ol>
<li>The names of the couple (and of the hosts, if parents are hosting).</li>
<li>Date and start time, written so nobody has to guess the time zone.</li>
<li>Venue name and full address, with a map link.</li>
<li>A reply-by date and a way to respond.</li>
</ol>
<p><strong>Add when relevant:</strong> the day's schedule, dress code, accommodation suggestions, transport or parking, a children policy, registry details and one contact person for questions.</p>
<p>On the Rosas design we tested, the invitation shows the venue with an embedded Google map and a “Get directions” button, then a timeline of the day. Those two blocks answer the questions couples otherwise receive one text message at a time.</p>`,
        figure: { ...shot.timeline, alt: "Mobile digital wedding invitation showing a venue map and a wedding day timeline", caption: "Map and schedule on the Rosas design at phone size (folde-wedding.com, Nov. 17, 2026). Guests tap through to directions instead of asking for the address." },
      },
      {
        heading: "How to create one, step by step",
        body: `<p>The process is similar on most platforms. Here is how it went on FOLDÈ, with the times we observed:</p>
<ol>
<li><strong>Pick a design.</strong> The collection shows each design as it appears on a phone, including the envelope opening.</li>
<li><strong>Add your names and date.</strong> When we arrived from a link carrying our test names, the mobile flow already displayed “Emma &amp; Lucas”, and asked for the date first (a tentative date is accepted).</li>
<li><strong>Personalize the opening.</strong> On desktop, the editor shows a live phone preview next to the envelope animations and hero videos you can switch between.</li>
<li><strong>Fill in the practical sections</strong>: venue, schedule, dress code, RSVP questions.</li>
<li><strong>Test it like a guest</strong>: open the link on your own phone, tap the envelope, check the map and send yourself a test reply before sharing.</li>
</ol>
<p>Previewing is free; you pay once when you publish. On November 17, 2026 the packages page listed the Standard plan at $49.90 (a launch discount was displayed at checkout) and the Expert plan, where the studio builds the invitation for you, at $149.</p>`,
        figure: { ...shot.editor, alt: "FOLDÈ live personalization editor with a phone preview of a wax-seal envelope and a list of envelope animations", caption: "The desktop editor: the phone on the left updates as you switch envelope animations and hero videos on the right." },
      },
      {
        heading: "When and how to send it",
        body: `<p>Digital does not change the etiquette calendar. U.S. etiquette guides such as The Knot and Zola recommend sending wedding invitations <strong>six to eight weeks before the wedding</strong>, and earlier (often around three months) when guests must travel. Set the reply-by date two to four weeks before the day, depending on when your caterer needs final numbers.</p>
<p>How you share the link matters as much as when:</p>
<ul>
<li><strong>Send it personally.</strong> A short message in your own words (“Our invitation is here, we’d love to know if you can come by May 1”) gets more replies than a bare link.</li>
<li><strong>Use the channel each guest actually reads</strong>: text for friends, email for colleagues, a call for grandparents.</li>
<li><strong>Keep one link.</strong> If something changes, update the invitation instead of sending a new file, then message only the guests affected.</li>
<li><strong>Print a few.</strong> For guests who prefer paper, a small printed card with a QR code to the same link keeps everyone on one source of truth.</li>
</ul>`,
        figure: { ...shot.envelope, alt: "Phone screen showing a digital wedding invitation envelope sealed with a burgundy wax seal", caption: "What guests see first: a sealed envelope to tap open. The Rosas opening screen at 390 px wide." },
      },
      {
        heading: "Digital vs paper: the real cost difference",
        body: `<p>The cost gap comes less from design than from printing and postage. Paper costs grow with every household you invite; a digital invitation is usually a flat fee.</p>
<p>For scale: The Knot’s 2026 Real Weddings Study puts the average U.S. guest count at <strong>117</strong>. Since July 12, 2026, mailing a standard 1-ounce letter in the U.S. costs <strong>$0.82</strong>, and many invitation suites weigh more than an ounce or use square envelopes that cost extra. Add another stamp on every reply envelope if you include one.</p>`,
        table: {
          caption: "What changes between paper and digital (U.S. figures, November 2026)",
          head: ["", "Paper suite", "Digital invitation"],
          rows: [
            ["Postage", "From $0.82 per invitation, plus return postage for reply cards", "None"],
            ["Printing", "Priced per piece; grows with each card in the suite", "None"],
            ["Corrections after sending", "Reprint or send a notice", "Edit the page once"],
            ["Collecting replies", "Reply cards by mail, entered by hand", "Answers arrive in a dashboard"],
            ["Keepsake value", "A physical object to keep", "A link; print a few copies if it matters to you"],
          ],
        },
        after: `<p>Paper still wins on one point: some guests treasure a physical invitation. Many couples send a digital invitation to everyone and print a handful for grandparents and close family.</p>`,
      },
      {
        heading: "Mistakes that make guests miss details",
        body: `<ul>
<li><strong>Burying the RSVP.</strong> If guests have to scroll past three galleries to reply, many will postpone it. Put the reply-by date near the top.</li>
<li><strong>Asking too many questions.</strong> Ask only what changes a decision: attendance, party size, dietary needs.</li>
<li><strong>Sending different versions.</strong> One link, updated, beats a PDF v2 and v3 in a group chat.</li>
<li><strong>Not testing on a small phone.</strong> Light text on a busy photo looks fine on a laptop and unreadable on a phone.</li>
<li><strong>Forgetting non-digital guests.</strong> Offer a phone number or a printed card.</li>
</ul>`,
        figure: { ...shot.opening, alt: "Opened digital wedding invitation on a phone showing the couple's names, Save the Date and the wedding date over a painted garden scene", caption: "After the envelope: names, “Save the date” and the date are readable over the artwork at phone size." },
      },
      {
        heading: "Are digital invitations acceptable for a formal wedding?",
        body: `<p>Yes, provided the invitation itself feels considered. Formality comes from the wording, the design and how you send it, not only from the paper. A formal wording (“request the pleasure of your company”), restrained typography and a personal message when you share the link read as respectfully as engraved card stock. If your families expect paper, a hybrid works: a printed invitation for the elders, the same design online for everyone else.</p>
<p>For wording ideas, see our <a href="/blog/wedding-invitation-wording-examples">20 wedding invitation wording samples</a>. To handle replies, read <a href="/blog/wedding-rsvp-cards">how to word RSVP cards</a>, and if guests are travelling, our guide to <a href="/blog/destination-wedding-invitations">destination wedding invitations</a>.</p>`,
      },
    ],
    faqs: [
      ["Is it rude to send a digital wedding invitation?", "No. Digital invitations are widely accepted in 2026. What can feel impersonal is a bare link with no message, so send it with a few words of your own and offer another way to reply to guests who are not comfortable online."],
      ["Can I send a digital invitation and a paper one?", "Yes. A common approach is paper for close family and older guests, digital for everyone else, with a QR code on the printed card pointing to the same page so replies end up in one place."],
      ["How do guests RSVP to a digital invitation?", "With a built-in form, they choose whether they attend, who comes with them and any dietary needs, then submit. On FOLDÈ the form asks for first and last name, email, attendance, whether they are accompanied, and allergies or dietary needs."],
      ["Can I change the invitation after sending it?", "With a hosted invitation, yes: you edit the page and everyone sees the update through the same link. Tell guests directly when a change affects their plans, such as a new start time."],
      ["What if some guests don’t use smartphones?", "The link also opens on a computer. For guests without internet access, print a copy or call them, and record their answer yourself."],
      ["How much does a digital wedding invitation cost?", "It ranges from free image templates to paid interactive invitations. On November 17, 2026, FOLDÈ listed a one-time $49.90 Standard plan (with a launch discount shown at checkout) and a $149 Expert plan; previewing was free."],
      ["Should a digital invitation include the registry?", "It can, in its own section or as a link. Etiquette guides still advise against putting registry details in the main invitation wording; a separate, discreet section is the usual compromise."],
    ],
    methodology: testMethod,
    sources: [knotTiming, zolaTiming, knot, stamps],
  },
  {
    slug: "wedding-invitation-wording-examples",
    keyword: "wedding invitation examples",
    title: "Wedding Invitation Examples: 20 Wording Samples You Can Adapt",
    metaTitle: "Wedding Invitation Examples: 20 Wording Samples to Copy",
    description: "20 wedding invitation wording examples (formal, parents hosting, modern, casual, courthouse, reception-only, blended families) and the etiquette behind each line.",
    excerpt: "Ready-to-adapt samples for every situation, plus the line-by-line rules that make wording sound right.",
    intro: "Most couples know the feeling: the design is chosen, and the text box is still empty. The wording has to say who is hosting, who is marrying, when and where, and set the tone of the whole day, in eight lines or fewer. Below are 20 samples sorted by situation, followed by the line-by-line etiquette, so you can adapt one confidently instead of copying it blindly.",
    heroImage: "/images/blog/pexels/36617804.jpg",
    imageAlt: "Printed wedding invitation with an envelope and wedding rings on a table",
    datePublished: "2026-11-17",
    readingTime: 10,
    author,
    quickAnswer: "Good wedding invitation wording follows a fixed order: who is hosting, the request to attend, the couple’s names, the date and time, the venue and city, then reception and reply details. Formal invitations spell out the date and time in words; casual ones can use numerals and a lighter tone. Choose the tone first, then pick a sample that matches who is hosting.",
    tool: { variant: "wording", event: "wedding", title: "Draft your wedding invitation wording" },
    ctaAfter: 2,
    sections: [
      {
        heading: "The anatomy of wedding invitation wording",
        body: `<p>Almost every wedding invitation, formal or not, uses the same building blocks in the same order. Get these right and the tone becomes a matter of word choice.</p>`,
        table: {
          caption: "Each line and what it does",
          head: ["Line", "Purpose", "Formal example", "Casual example"],
          rows: [
            ["Host line", "Says who is inviting", "Mr. and Mrs. James Carter", "Together with their families"],
            ["Request line", "The invitation itself", "request the pleasure of your company", "invite you to celebrate"],
            ["Couple", "Who is marrying", "Emma Rose Carter and Lucas Martin", "Emma & Lucas"],
            ["Date & time", "When", "Saturday, the twelfth of September, two thousand twenty-six, at four o’clock", "Sat. Sept. 12, 2026 · 4 pm"],
            ["Venue", "Where", "The Lake House, Burlington, Vermont", "The Lake House, Burlington"],
            ["Closing line", "What follows", "Reception to follow", "Dinner and dancing to follow"],
          ],
        },
        after: `<p>Two traditional conventions are worth knowing. “Request the honour of your presence” is customarily used for ceremonies in a house of worship, “the pleasure of your company” for other venues. And on formal invitations, the date, year and time are spelled out in words.</p>`,
      },
      {
        heading: "Formal and traditional samples",
        body: `<p><strong>1. Bride’s parents hosting</strong></p>
<blockquote>Mr. and Mrs. James Carter
request the pleasure of your company
at the marriage of their daughter
Emma Rose
to
Lucas Martin
Saturday, the twelfth of September
two thousand twenty-six
at four o’clock in the afternoon
The Lake House, Burlington, Vermont</blockquote>
<p><strong>2. Both sets of parents hosting</strong></p>
<blockquote>Mr. and Mrs. James Carter
and
Mr. and Mrs. Paul Martin
request the pleasure of your company
at the marriage of their children
Emma Rose and Lucas Daniel</blockquote>
<p><strong>3. House of worship</strong></p>
<blockquote>Together with their families
Emma Rose Carter and Lucas Daniel Martin
request the honour of your presence
as they are united in marriage
at Saint Paul’s Church</blockquote>
<p><strong>4. Formal, couple hosting</strong></p>
<blockquote>The pleasure of your company is requested
at the marriage of
Emma Rose Carter
and
Lucas Daniel Martin</blockquote>`,
        figure: { ...shot.opening, alt: "Couple's names and wedding date displayed on the opening screen of a digital wedding invitation", caption: "On a digital invitation, the opening screen carries the names and date; the full wording sits just below. Rosas design at phone size." },
      },
      {
        heading: "Modern and casual samples",
        body: `<p><strong>5. Together with their families</strong></p>
<blockquote>Together with their families
Emma Carter & Lucas Martin
invite you to celebrate their wedding
Saturday, September 12, 2026 at 4 pm</blockquote>
<p><strong>6. Simple and warm</strong></p>
<blockquote>Emma & Lucas
are getting married
and would love for you to be there</blockquote>
<p><strong>7. Short and direct</strong></p>
<blockquote>Join us for the wedding of
Emma & Lucas
September 12, 2026 · Burlington, Vermont</blockquote>
<p><strong>8. Story-led</strong></p>
<blockquote>Ten years, two cities and one very patient dog later,
Emma & Lucas are getting married.
Come celebrate with us.</blockquote>
<p><strong>9. Playful</strong></p>
<blockquote>Eat, drink and be married!
Emma & Lucas
September 12, 2026</blockquote>
<p><strong>10. Relaxed party tone</strong></p>
<blockquote>We’re tying the knot!
Join Emma & Lucas for vows, dinner
and a long night of dancing.</blockquote>
<p><strong>11. Minimal</strong></p>
<blockquote>Emma & Lucas
12.09.2026
The Lake House</blockquote>`,
      },
      {
        heading: "Courthouse, civil ceremony and elopement samples",
        body: `<p>For a civil or courthouse wedding, say plainly where the ceremony happens, and whether guests are invited to the ceremony, the celebration, or both.</p>
<p><strong>12. Civil ceremony with guests</strong></p>
<blockquote>Emma Carter and Lucas Martin
invite you to their civil wedding ceremony
at Burlington City Hall
followed by lunch at The Lake House</blockquote>
<p><strong>13. Married privately, celebrating later</strong></p>
<blockquote>We said “I do” in a small ceremony this spring.
Now we’d love to celebrate with you!
Emma & Lucas
Saturday, September 12, 2026</blockquote>`,
      },
      {
        heading: "Reception-only and after-party samples",
        body: `<p>When some guests are invited to the reception only, the invitation should make that clear without sounding like a second tier.</p>
<p><strong>14. Reception to follow a private ceremony</strong></p>
<blockquote>Following a private ceremony
Emma & Lucas
invite you to join them for dinner and dancing
Saturday, September 12, 2026 at 7 pm</blockquote>
<p><strong>15. Evening celebration</strong></p>
<blockquote>Please join us for an evening reception
in celebration of the marriage of
Emma Carter and Lucas Martin</blockquote>
<p>We cover reception etiquette in more detail in our guide to <a href="/blog/wedding-invitations-with-rsvp">wedding invitations with RSVP</a>.</p>`,
      },
      {
        heading: "Blended, divorced and deceased-parent samples",
        body: `<p>These are the situations where wording causes the most worry. Two principles help: name the people who are hosting, and never make a parent’s name do something it shouldn’t (a deceased parent cannot “request” your presence).</p>
<p><strong>16. Divorced parents both hosting</strong></p>
<blockquote>Mrs. Anne Carter
and
Mr. James Carter
request the pleasure of your company
at the marriage of their daughter
Emma Rose</blockquote>
<p><strong>17. Remarried parent and stepparent</strong></p>
<blockquote>Mr. and Mrs. David Reed
request the pleasure of your company
at the marriage of her daughter
Emma Rose Carter</blockquote>
<p><strong>18. Honoring a parent who has passed away</strong></p>
<blockquote>Together with their families
Emma Rose Carter,
daughter of Anne Carter and the late James Carter,
and Lucas Daniel Martin
invite you to celebrate their marriage</blockquote>
<p><strong>19. Couple and both families</strong></p>
<blockquote>Emma Carter and Lucas Martin
together with their parents
invite you to share in their joy</blockquote>
<p><strong>20. Adults-only celebration</strong></p>
<blockquote>We love your little ones, but this will be an adults-only celebration.
We hope you can enjoy a night off with us!</blockquote>
<p>Put the adults-only note in the details section rather than in the main invitation wording, and address the invitation to the invited names only.</p>`,
        figure: { ...shot.editor, alt: "Online invitation editor with a live phone preview next to envelope animation choices", caption: "Testing wording in context: the live preview shows how long names and lines wrap on a phone before you publish." },
      },
      {
        heading: "Fitting the wording on a digital invitation",
        body: `<p>Digital invitations relax the space limit of a 5×7 card, but not the reader’s patience. Keep the invitation wording itself to the classic eight lines, then move everything else into dedicated sections: schedule, dress code, accommodation, RSVP. This keeps the opening elegant and lets guests find practical details quickly.</p>
<p>Two checks before publishing: read the wording aloud (awkward line breaks become obvious), and look at it on the smallest phone you can find, where long names may wrap onto two lines. Then send it with a short personal message; our <a href="/blog/digital-wedding-invitations">guide to digital wedding invitations</a> covers timing and sharing.</p>`,
        figure: { ...shot.envelope, alt: "Burgundy wax-seal envelope on a phone screen", caption: "The envelope comes first, so the wording is read once the guest has chosen to open it, which is a good reason to keep it short." },
      },
    ],
    faqs: [
      ["Who should be named first on a wedding invitation?", "Traditionally the bride’s name comes first, and in a heterosexual couple hosted by the bride’s parents, only her first and middle names are used because her surname appears in the host line. Same-sex and modern couples often list names alphabetically or in the order that sounds best."],
      ["Do you write the year on a wedding invitation?", "On formal invitations the year is optional but common and spelled out (“two thousand twenty-six”). Casual invitations use numerals."],
      ["Should the time say “half after four” or “4:30”?", "“Half after four o’clock” is the formal convention; “4:30 pm” is fine on a casual or digital invitation. Do not write “p.m.” on formal invitations; use “in the afternoon” or “in the evening”."],
      ["How do I word an invitation if we’re paying for the wedding ourselves?", "Use “Together with their families” or simply list your names as hosts: “Emma Carter and Lucas Martin invite you…”."],
      ["Where do I mention the dress code?", "In a details section or on a separate card, not in the invitation wording itself. “Black tie” can appear in the lower right corner of a formal invitation."],
      ["Can I mention the registry in the invitation wording?", "Etiquette guides still advise against it. Put a discreet registry section or link on the invitation’s details page instead."],
      ["How do I word a plus-one?", "Address the invitation to “Ms. Emma Carter and Guest” or name the partner if you know them. On a digital RSVP, a field such as “Will you be accompanied?” makes it clear who may bring someone."],
    ],
    methodology: `<p>The samples were written by the FOLDÈ editorial team for this guide; names, venues and dates are fictional. Etiquette conventions (host line, “honour of your presence” for religious ceremonies, spelled-out dates) reflect long-standing U.S. stationery practice as described by the sources below. Screenshots come from folde-wedding.com, captured on November 17, 2026 at desktop and mobile sizes.</p>`,
    sources: [knotTiming, zolaTiming],
  },
  {
    slug: "wedding-rsvp-cards",
    keyword: "wedding rsvp cards",
    title: "Wedding RSVP Cards: Wording, Examples and Digital Alternatives",
    metaTitle: "Wedding RSVP Cards: Wording, Examples and Deadlines",
    description: "How to word wedding RSVP cards, what to ask, when to set the deadline and how paper reply cards compare with a digital RSVP, with 7 examples.",
    excerpt: "Seven RSVP card wordings, the questions worth asking and the paper vs digital trade-offs.",
    intro: "RSVP cards are the least glamorous piece of a wedding suite and the one that decides your seating chart, catering order and final budget. A clear card gets you complete answers on time; a vague one gets you a stack of blanks and follow-up calls. Here is how to word them, what to ask, when to set the deadline, and how paper reply cards compare with a digital RSVP.",
    heroImage: "/images/blog/pexels/34579982.jpg",
    imageAlt: "Elegant wedding stationery flat lay with reply cards and envelopes",
    datePublished: "2026-11-17",
    readingTime: 8,
    author,
    quickAnswer: "A wedding RSVP card asks guests to confirm whether they will attend by a set date, usually two to four weeks before the wedding. It includes a reply-by date, a line for guest names (often starting with “M”), accept and decline options, and meal or dietary questions if needed. Digital RSVPs collect the same answers online and record them automatically.",
    tool: { variant: "rsvp" },
    ctaAfter: 2,
    sections: [
      {
        heading: "What goes on a wedding RSVP card",
        body: `<p>An RSVP card (also called a response or reply card) has one job: get an unambiguous answer you can plan with. Keep only what serves that job.</p>`,
        table: {
          caption: "Questions to include, and when",
          head: ["Field", "Include it?", "Why"],
          rows: [
            ["Reply-by date", "Always", "Your caterer and venue need final numbers"],
            ["Guest name(s)", "Always", "Tells you who answered (and who is coming)"],
            ["Accepts / declines", "Always", "The actual answer"],
            ["Number attending", "If invitations cover a household", "Avoids surprise extra guests"],
            ["Meal choice", "Only for plated dinners", "The kitchen needs counts per dish"],
            ["Dietary needs / allergies", "Recommended", "Safety, and fewer last-minute requests"],
            ["Song request or message", "Optional", "Fun, but don’t let it crowd the essentials"],
          ],
        },
      },
      {
        heading: "RSVP card wording examples",
        body: `<p><strong>1. Classic formal</strong></p>
<blockquote>The favour of a reply is requested
by the first of August
M______________________
___ accepts with pleasure
___ declines with regret</blockquote>
<p>The “M” is the start of Mr., Mrs., Ms. or Mx.: guests complete their own title and name.</p>
<p><strong>2. Classic with seats reserved</strong></p>
<blockquote>Kindly reply by August 1
M______________________
We have reserved ___ seats in your honor
___ Joyfully accepts ___ Regretfully declines</blockquote>
<p><strong>3. With meal choice</strong></p>
<blockquote>Please reply by August 1
Name(s) ______________________
___ Will attend ___ Will not attend
___ Beef ___ Fish ___ Vegetarian</blockquote>
<p><strong>4. Modern</strong></p>
<blockquote>Can you make it?
Let us know by August 1
Name(s) ______________________
___ Wouldn’t miss it ___ Will celebrate from afar</blockquote>
<p><strong>5. Playful</strong></p>
<blockquote>___ Can’t wait to celebrate!
___ Sending love from my couch</blockquote>
<p><strong>6. Pointing to an online RSVP</strong></p>
<blockquote>Kindly reply online by August 1
scan the code or visit our invitation link</blockquote>
<p><strong>7. Adults-only reminder</strong></p>
<blockquote>We have reserved ___ seats in your honor.
We hope you understand that our celebration is adults only.</blockquote>`,
      },
      {
        heading: "When to set the RSVP deadline",
        body: `<p>U.S. etiquette guides place the reply-by date <strong>two to four weeks before the wedding</strong>. Zola suggests about a month, which leaves time to chase late replies; others accept two to three weeks. Work backwards from your vendors: ask your caterer and venue when they need final numbers, then set the RSVP date about a week earlier.</p>
<p>Invitations themselves usually go out six to eight weeks before the wedding (earlier for destination weddings), which gives guests roughly a month to answer.</p>`,
        figure: { ...shot.envelope, alt: "Digital invitation envelope with a wax seal shown on a mobile phone", caption: "With a digital invitation, the RSVP form lives inside the invitation, so the reply-by date and the form are one tap apart." },
      },
      {
        heading: "Paper reply cards: the practical details",
        body: `<ul>
<li><strong>Pre-stamp and pre-address the reply envelope.</strong> Since July 12, 2026 a 1-ounce U.S. letter costs $0.82, and a postcard stamp $0.65, which is why some couples use RSVP postcards instead of a card plus envelope.</li>
<li><strong>Number the backs in pencil.</strong> Write a small number on the back of each reply card that matches your guest list. When a card comes back with no name (it happens), you still know who sent it.</li>
<li><strong>Log replies as they arrive</strong>, ideally the same day, in one spreadsheet.</li>
<li><strong>Plan for non-replies.</strong> Expect to contact some guests after the deadline; a friendly message works better than a reminder card.</li>
</ul>`,
      },
      {
        heading: "Digital RSVP: how it compares",
        body: `<p>A digital RSVP asks the same questions in a form. On the FOLDÈ invitation we opened, the RSVP section asks for first name, last name and email, then “Will you attend?” (yes or regretfully decline), “Will you be accompanied?” (alone, with a guest or with family) and allergies or dietary needs. The answer goes to the couple’s dashboard, so nobody types replies into a spreadsheet.</p>`,
        figure: { ...shot.rsvp, alt: "Digital wedding RSVP form on a phone with attendance, accompanied and dietary needs fields and a Submit RSVP button", caption: "The RSVP form inside a FOLDÈ invitation (Rosas design, phone size, Nov. 17, 2026)." },
        table: {
          caption: "Paper reply cards vs digital RSVP",
          head: ["", "Paper RSVP card", "Digital RSVP"],
          rows: [
            ["Cost per guest", "Card, envelope and return stamp", "Included in the invitation"],
            ["Speed", "Days in the mail", "Instant"],
            ["Unreadable or nameless replies", "Common", "Required fields prevent them"],
            ["Changing an answer", "Guest calls or writes", "Guest contacts the couple; couple updates the record"],
            ["Older guests", "Familiar", "Offer phone help or a printed option"],
          ],
        },
      },
      {
        heading: "Following up on missing replies",
        body: `<p>The day after the deadline, list who has not answered and contact them personally, by text or phone rather than a group message. Keep it light: “We’re finalizing numbers with the caterer this week. Will you be able to join us?” Most late replies are forgotten, not declined.</p>
<p>If guests ask how to reply, our guide on <a href="/blog/how-to-rsvp-to-a-wedding">how to RSVP to a wedding</a> walks them through cards and online forms. For the invitation itself, see <a href="/blog/digital-wedding-invitations">digital wedding invitations</a> or browse <a href="/collections">FOLDÈ designs with built-in RSVP</a>.</p>`,
        figure: { ...shot.opening, alt: "Digital wedding invitation opening screen with names and date", caption: "One link carries the invitation and the reply form, so follow-ups can simply point back to it." },
      },
    ],
    faqs: [
      ["What does the M on an RSVP card mean?", "It is the first letter of the guest’s title (Mr., Mrs., Ms., Mx.). Guests complete the title and write their names, for example “Ms. Emma Carter”."],
      ["Do RSVP cards need a stamp?", "By etiquette, yes: the hosts pre-stamp and pre-address the reply envelope so replying costs the guest nothing. In the U.S. a 1-ounce letter stamp has cost $0.82 since July 12, 2026."],
      ["How many days before the wedding should RSVPs be due?", "Two to four weeks. Check your caterer’s deadline for final numbers and set the RSVP date about a week before it."],
      ["Can I include an online RSVP with paper invitations?", "Yes. Many couples print a small card with a QR code or short link instead of a reply card and envelope. Keep one reply method if you can, so answers don’t end up in two places."],
      ["Should RSVP cards ask about plus-ones?", "Only if the invitation includes one. Write the number of seats reserved, or ask “Will you be accompanied?” on a digital form, so guests know whether they may bring someone."],
      ["What if a guest sends back a blank RSVP card?", "That is what the pencil numbers on the back are for: match the number to your guest list, then contact the guest to confirm."],
    ],
    methodology: testMethod,
    sources: [zolaTiming, knotTiming, stamps],
  },
  {
    slug: "how-to-rsvp-to-a-wedding",
    keyword: "how to rsvp to a wedding",
    title: "How to RSVP to a Wedding: Card, Online and Text Examples",
    metaTitle: "How to RSVP to a Wedding (Card, Online and Text Examples)",
    description: "How to fill out a wedding RSVP card, answer online, bring a plus-one, decline politely or change your answer, with example replies you can copy.",
    excerpt: "Fill in the card, answer online, decline gracefully: examples for every case.",
    intro: "You received a wedding invitation and a reply card, or a link with an RSVP form. Answering takes two minutes, but small mistakes, like adding a guest who wasn’t invited or replying a week late, create real problems for the couple. Here is exactly how to RSVP to a wedding, on paper or online, with wording for accepting, declining and the awkward cases in between.",
    heroImage: "/images/blog/pexels/20485643.jpg",
    imageAlt: "Wedding rings beside a printed wedding invitation",
    datePublished: "2026-11-17",
    readingTime: 7,
    author,
    quickAnswer: "To RSVP to a wedding, reply by the date on the invitation using the method the couple asked for: the reply card, their online form, or a message if no method is given. Write only the names on the invitation, tick accept or decline, answer meal or dietary questions, and send it. If you can’t attend, decline promptly and add a short kind note.",
    tool: { variant: "rsvp", title: "Practice a digital RSVP", subtitle: "Most online invitations ask the same few questions. Try them here; this demo sends nothing." },
    sticky: { text: "Planning your own wedding?", button: "Create your invitation" },
    ctaAfter: 3,
    sections: [
      {
        heading: "The four rules of replying to a wedding invitation",
        body: `<ol>
<li><strong>Reply by the deadline, ideally within a week.</strong> Couples give final numbers to their caterer shortly after the RSVP date.</li>
<li><strong>Use the method they chose.</strong> Card, online form or text: whatever the invitation asks.</li>
<li><strong>Only include the people named on the invitation.</strong> If the envelope says “Ms. Emma Carter”, it is an invitation for one. “And Guest” means you may bring someone.</li>
<li><strong>Reply even if you can’t come.</strong> A “no” is useful information; silence means the couple has to chase you.</li>
</ol>`,
      },
      {
        heading: "How to fill out an RSVP card",
        body: `<p>Most cards follow the same layout. Here is what to write on each line.</p>
<ul>
<li><strong>The “M” line</strong>: complete your title and full name, for example “<em>Ms.</em> Emma Carter” or “<em>Mr. and Mrs.</em> Lucas Martin”. If several of you are invited, write every name.</li>
<li><strong>Accepts / declines</strong>: tick or circle one option. Some cards say “joyfully accepts” and “regretfully declines”.</li>
<li><strong>“___ seats reserved” or “number attending”</strong>: write how many of the invited people will come, never more than the number reserved.</li>
<li><strong>Meal choice</strong>: mark one choice per person; initials next to each choice help the caterer.</li>
<li><strong>Space for a note</strong>: optional, but a line like “So happy for you both!” is always welcome.</li>
</ul>
<p>Then post it in the stamped envelope provided. No envelope? The card is probably a postcard, or the couple prefers an online reply.</p>`,
        table: {
          caption: "Example: completed RSVP cards",
          head: ["Situation", "M line", "Response", "Seats / meal"],
          rows: [
            ["Single guest, attending", "Ms. Emma Carter", "Accepts with pleasure", "1 · Fish"],
            ["Couple, attending", "Mr. and Mrs. Lucas Martin", "Accepts with pleasure", "2 · Beef (LM), Vegetarian (EM)"],
            ["Invited with a guest", "Ms. Emma Carter and Mr. Noah Reed", "Accepts with pleasure", "2"],
            ["Declining", "Mr. Paul Martin", "Declines with regret", "0"],
          ],
        },
      },
      {
        heading: "How to RSVP online",
        body: `<p>Many couples now use an invitation link with a built-in form. The process is quick:</p>
<ol>
<li>Open the link from the invitation (or scan the QR code on a printed card).</li>
<li>Find the RSVP section; on many invitations it is at the end, after the schedule and map.</li>
<li>Enter your name exactly as on the invitation, plus your email if asked.</li>
<li>Answer “Will you attend?”, then the follow-up questions: whether you are accompanied, dietary needs.</li>
<li>Submit, and keep the link: it usually holds the schedule and address you will need on the day.</li>
</ol>
<p>On the FOLDÈ invitation we tested, the form asks for first name, last name, email, attendance, whether you are accompanied (alone, with a guest, or with family) and allergies or dietary needs.</p>`,
        figure: { ...shot.rsvp, alt: "Online wedding RSVP form on a phone asking whether the guest will attend, if they are accompanied and about dietary needs", caption: "A typical online wedding RSVP at phone size (FOLDÈ Rosas design, Nov. 17, 2026)." },
      },
      {
        heading: "Examples: accepting, declining and everything in between",
        body: `<p><strong>Accepting by text or email</strong></p>
<blockquote>Hi Emma and Lucas! We’re thrilled for you and would love to come. That’s two of us, and Noah is vegetarian. See you on the 12th!</blockquote>
<p><strong>Declining politely</strong></p>
<blockquote>Dear Emma and Lucas, thank you so much for the invitation. Unfortunately we’ll be abroad that week and can’t attend. We’ll be thinking of you and can’t wait to see the photos!</blockquote>
<p><strong>Asking about a plus-one (only if genuinely unclear)</strong></p>
<blockquote>Hi Emma, I’d love to come! Quick question so I fill the card correctly: is the invitation for me alone? Either way is completely fine.</blockquote>
<p><strong>Replying when there is no RSVP method</strong></p>
<blockquote>Dear Mrs. Carter, Ms. Emma Carter accepts with pleasure your kind invitation for Saturday, the twelfth of September.</blockquote>
<p>That last one is the traditional handwritten reply for formal invitations without a reply card: it repeats the invitation’s wording in the third person.</p>`,
        figure: { ...shot.opening, alt: "Wedding invitation opening screen on a phone with the couple's names and date", caption: "Keep the invitation link: the date, address and schedule you need on the day are all there." },
      },
      {
        heading: "What if your plans change after you reply?",
        body: `<ul>
<li><strong>From yes to no</strong>: tell the couple directly and as early as possible, by message or phone. Don’t just submit a new online form without telling them, because seating plans may already be printed.</li>
<li><strong>From no to yes</strong>: ask first. The couple may have given your place away or closed numbers with the caterer.</li>
<li><strong>A last-minute emergency</strong>: call or text the couple (or a parent or witness on the day) rather than simply not showing up.</li>
</ul>`,
      },
      {
        heading: "Common RSVP mistakes to avoid",
        body: `<ul>
<li>Writing in children or a partner who weren’t named on the invitation.</li>
<li>Replying “maybe”: answer yes or no, and if you truly can’t know yet, tell the couple when you will.</li>
<li>Answering in the comments of a social post instead of the method requested.</li>
<li>Forgetting the meal choice on a card that asks for one.</li>
<li>Sending the card back with no name; some couples number cards for this reason, but don’t rely on it.</li>
</ul>
<p>Planning your own wedding? Our guides to <a href="/blog/wedding-rsvp-cards">RSVP card wording</a> and <a href="/blog/digital-wedding-invitations">digital wedding invitations</a> show the other side of the process.</p>`,
        figure: { ...shot.envelope, alt: "Sealed digital wedding invitation envelope on a phone", caption: "Online invitations often open on an envelope; the RSVP form is inside, usually near the end." },
      },
    ],
    faqs: [
      ["How soon should you RSVP to a wedding?", "As soon as you know, and in any case before the reply-by date. Replying within a week of receiving the invitation is considered good form."],
      ["Is it rude to RSVP no to a wedding?", "No. Declining promptly and kindly is polite; not answering is what causes trouble. You don’t need to give a detailed reason."],
      ["Do I need to send a gift if I decline?", "It isn’t required. Many guests send a card or a small gift from the registry; follow your relationship with the couple."],
      ["What does “and guest” mean on a wedding invitation?", "You may bring one companion of your choice. Write their name on the RSVP so the couple can add it to the seating plan."],
      ["Can I RSVP by text if the invitation has a card?", "Use the card if one is provided; it is what the couple will be tracking. If the deadline is close and the card is lost, a message is better than nothing."],
      ["What if I made a mistake on my online RSVP?", "Contact the couple and tell them the correct answer. Depending on the platform, they can update it on their side."],
    ],
    methodology: testMethod,
    sources: [knotTiming, zolaTiming],
  },
  {
    slug: "rehearsal-dinner-invitations",
    keyword: "rehearsal dinner invitations",
    title: "Rehearsal Dinner Invitations: Wording, Timing and Who to Invite",
    metaTitle: "Rehearsal Dinner Invitations: Wording, Timing & Guest List",
    description: "Who hosts and who is invited to the rehearsal dinner, when to send the invitations, what to include, and 10 wording examples from formal to casual.",
    excerpt: "Guest list, timing, details and ten wording examples for the night before the wedding.",
    intro: "The rehearsal dinner is the smaller, more personal evening before the wedding, and its invitation has to do two things the main invitation doesn’t: make the event feel intimate, and make it clear to the people who aren’t invited that it isn’t for everyone. This guide covers who hosts and who to invite, when to send invitations, what to include, and ten wording examples you can adapt.",
    heroImage: "/images/blog/pexels/29821867.jpg",
    imageAlt: "Wedding invitation laid on white fabric",
    datePublished: "2026-11-17",
    readingTime: 7,
    author,
    quickAnswer: "Rehearsal dinner invitations are usually sent separately from the wedding invitation, around the same time or a few weeks after, so guests have them at least four weeks before. Invite the wedding party and their partners, immediate family and the officiant; out-of-town guests are optional. Include the hosts, the couple’s names, date, time, venue, dress code and a reply-by date.",
    tool: { variant: "wording", event: "rehearsal", title: "Draft your rehearsal dinner wording", subtitle: "Pick a tone and add the couple’s names. Copy the text for a card or a message." },
    ctaAfter: 2,
    sections: [
      {
        heading: "Who hosts, and who is invited?",
        body: `<p>Traditionally the groom’s family hosts the rehearsal dinner, but today it is often the couple themselves, either set of parents, or several family members together. The invitation should name whoever is hosting.</p>`,
        table: {
          caption: "Rehearsal dinner guest list",
          head: ["Guest", "Invite?", "Note"],
          rows: [
            ["Wedding party (attendants, best man, maid of honor)", "Always", "They are at the rehearsal itself"],
            ["Their partners or spouses", "Usually", "Especially if they are traveling with them"],
            ["Parents and immediate family", "Always", "Including siblings not in the wedding party"],
            ["Officiant (and their partner)", "Usually", "A courtesy, since they lead the rehearsal"],
            ["Flower girl / ring bearer and parents", "Usually", "Consider an earlier time for young children"],
            ["Out-of-town guests", "Optional", "Some couples turn it into a welcome dinner"],
          ],
        },
      },
      {
        heading: "When to send rehearsal dinner invitations",
        body: `<p>Wedding invitations typically go out six to eight weeks before the wedding. Rehearsal dinner invitations can be sent at the same time (in a separate envelope or message) or shortly after, as long as guests have them <strong>at least four weeks ahead</strong>. If many guests are traveling, send them with the wedding invitation so people can book the extra night.</p>
<p>Set the reply-by date a week or two before the restaurant needs final numbers.</p>`,
      },
      {
        heading: "Should it be part of the wedding invitation?",
        body: `<p>Only if everyone receiving the wedding invitation is also invited to the dinner, which is the case for a “welcome dinner” open to all guests. Otherwise, keep it <strong>separate</strong>.</p>
<p>This matters even more with a digital wedding invitation. Its schedule is visible to every guest who opens the link, so an invitation-only dinner listed there will be seen by people who weren’t invited. Send the rehearsal dinner invitation on its own: a card, a personal message, or a separate invitation.</p>`,
        figure: { ...shot.timeline, alt: "Wedding day timeline on a digital invitation listing welcome cocktail, ceremony, dinner and party", caption: "A shared timeline is seen by every guest who opens the link, so list only events everyone is invited to." },
      },
      {
        heading: "What to include",
        body: `<ul>
<li>Who is hosting (“Hosted by the Martin family”).</li>
<li>That it is in honor of the couple, with their names.</li>
<li>Date and time; mention if the rehearsal itself comes first and where.</li>
<li>Restaurant or venue name and address.</li>
<li>Dress code, especially if it differs from the wedding.</li>
<li>Reply-by date and how to reply.</li>
<li>Whether partners or children are included, if it might be unclear.</li>
</ul>`,
        figure: { ...shot.editor, alt: "Invitation editor showing a live phone preview and design choices", caption: "Digital tools make it easy to keep the same visual style across the wedding and the rehearsal dinner." },
      },
      {
        heading: "10 rehearsal dinner wording examples",
        body: `<p><strong>Formal</strong></p>
<blockquote>1. Mr. and Mrs. Paul Martin
request the pleasure of your company
at the rehearsal dinner
in honor of Emma Carter and Lucas Martin
Friday, the eleventh of September
at seven o’clock in the evening
The Harbor Room, Burlington</blockquote>
<blockquote>2. Please join us for dinner
following the wedding rehearsal
in honor of Emma and Lucas
Friday, September 11 · 7 pm</blockquote>
<blockquote>3. Hosted by the families of the couple
A rehearsal dinner honoring
Emma Rose Carter and Lucas Daniel Martin</blockquote>
<p><strong>Modern</strong></p>
<blockquote>4. The night before the big day
Rehearsal dinner for Emma & Lucas
Friday, September 11 · The Harbor Room</blockquote>
<blockquote>5. Before we say “I do”, let’s raise a glass.
Join us for the rehearsal dinner.</blockquote>
<blockquote>6. Dinner with the people who made it all happen
Emma & Lucas’ rehearsal dinner</blockquote>
<p><strong>Casual and playful</strong></p>
<blockquote>7. They’ve practiced the walk, now let’s eat!
Rehearsal dinner for Emma & Lucas</blockquote>
<blockquote>8. Pizza, prosecco and a few embarrassing stories.
Join us the night before the wedding.</blockquote>
<blockquote>9. One more sleep! Celebrate with us at the rehearsal dinner.</blockquote>
<p><strong>Welcome dinner (all guests)</strong></p>
<blockquote>10. Arriving early? Join us for a welcome dinner
the evening before the wedding.
Everyone is invited!</blockquote>`,
        figure: { ...shot.envelope, alt: "Wax-sealed digital invitation envelope on a phone screen", caption: "The same wax-seal style can open a wedding invitation; for a private dinner, send it separately from the main link." },
      },
      {
        heading: "Etiquette details people forget",
        body: `<ul>
<li><strong>Thank the hosts</strong> during the dinner; toasts by the hosts and the couple are customary.</li>
<li><strong>Keep the toasts short</strong> if the wedding party will also speak the next day.</li>
<li><strong>Plan the timing</strong> so everyone gets a reasonable night’s sleep before the wedding.</li>
<li><strong>Tell vendors who arrive the day before</strong> (planner, photographer) whether they are invited; it is a kind gesture, not an obligation.</li>
</ul>
<p>For the main invitation, see our <a href="/blog/wedding-invitation-wording-examples">wedding invitation wording examples</a> and our guide to <a href="/blog/digital-wedding-invitations">digital wedding invitations</a>.</p>`,
      },
    ],
    faqs: [
      ["Who pays for the rehearsal dinner?", "Traditionally the groom’s family. Today it is often the couple, either set of parents, or shared costs; whoever pays is named as host on the invitation."],
      ["Do you need formal invitations for a rehearsal dinner?", "No. A printed card, a digital invitation or even a personal message are all acceptable. Match the formality of the dinner itself."],
      ["Should out-of-town guests be invited to the rehearsal dinner?", "It is a generous gesture but not required. If the guest list grows, some couples host a separate welcome drinks event open to all guests."],
      ["Is the rehearsal dinner always the night before?", "Usually, because the rehearsal happens the day before the ceremony. Some couples hold it two nights before so the wedding party isn’t tired on the day."],
      ["Can I put the rehearsal dinner on my wedding website or invitation?", "Only if everyone who can see the page is invited. Otherwise, send it separately to avoid hurt feelings."],
      ["How long should a rehearsal dinner last?", "Two to three hours is typical, ending early enough for the wedding party to rest before the wedding."],
    ],
    methodology: `<p>Guest-list conventions and timing reflect common U.S. etiquette guidance (sources below). Wording samples are original to FOLDÈ; names and venues are fictional. Product screenshots were captured on folde-wedding.com on November 17, 2026.</p>`,
    sources: [knotTiming, zolaTiming],
  },
];
