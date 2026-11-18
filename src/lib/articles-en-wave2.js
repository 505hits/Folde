// English articles, wave 2 of the November 2026 plan (docs/seo/blog-plan-2026-11.md).
// Written individually. Etiquette points are taken from the sources listed on each
// article (read on 2026-11-17); product details were checked on folde-wedding.com
// the same day. Wording samples are original; names and venues are fictional.

import { IMG, author, shot, knotTiming } from "@/lib/articles-en";

export const live = {
  atelier: { src: `${IMG}/atelier-indigo-design-opening-mobile.webp`, width: 520, height: 1126, portrait: true },
  editorial: { src: `${IMG}/editorial-design-opening-mobile.webp`, width: 520, height: 1126, portrait: true },
  rosas: { src: `${IMG}/rosas-design-opening-mobile.webp`, width: 520, height: 1126, portrait: true },
  countdown: { src: `${IMG}/wedding-countdown-and-destination-mobile.webp`, width: 520, height: 1126, portrait: true },
  hotels: { src: `${IMG}/accommodations-and-dining-mobile.webp`, width: 520, height: 1126, portrait: true },
  dressCode: { src: `${IMG}/dress-code-and-hotels-mobile.webp`, width: 520, height: 1126, portrait: true },
  venue: { src: `${IMG}/venue-and-directions-mobile.webp`, width: 520, height: 1126, portrait: true },
};

export const knotShower = { label: "The Knot — Who to invite to a bridal shower & other etiquette questions (updated Aug. 15, 2025)", href: "https://www.theknot.com/content/bridal-shower-invite-etiquette", note: "Send invitations four to six weeks ahead, about two months for out-of-town guests; the host sends them; 30–40 guests is typical; don’t invite anyone who isn’t invited to the wedding." };
const knotEngagement = { label: "The Knot — Who should be invited to an engagement party (updated Jul. 27, 2023)", href: "https://www.theknot.com/content/whos-invited-to-engagement-party", note: "Etiquette experts: anyone invited to the engagement party should be invited to the wedding; invitations can go by mail, email or word of mouth." };
const paperlessEngagement = { label: "Paperless Post — Engagement party 101", href: "https://www.paperlesspost.com/blog/engagement-party-101/", note: "Parties are usually held within a few months of the proposal; invitations go out four to six weeks before." };
const weddingwireEngagement = { label: "WeddingWire — The dos and don’ts of engagement party etiquette (Jan. 12, 2021)", href: "https://www.weddingwire.com/wedding-ideas/engagement-party-etiquette", note: "Gifts are not required and shouldn’t be requested; hosting is no longer limited to the bride’s parents." };
const knotReception = { label: "The Knot — The only guide to reception-only wedding invitations (updated Jun. 19, 2024)", href: "https://www.theknot.com/content/reception-only-invites-invitation-wording", note: "Make clear the ceremony already happened (“a celebration of their marriage”) and give guests a way to RSVP." };
export const knotSaveDates = { label: "The Knot — Save-the-date etiquette (updated Apr. 17, 2025)", href: "https://www.theknot.com/content/save-the-dates-etiquette", note: "Six to eight months ahead, closer to eight for a far-flung location; no later than six months; under four months is too late." };
export const knotTimingDated = { ...knotTiming, label: "The Knot — When to send wedding invitations (updated Jul. 14, 2026)", note: "Destination wedding invitations: eight weeks ahead, after save-the-dates; out-of-town guests: about eight weeks before the RSVP deadline." };

export const designCheck = `<p>Product details come from a hands-on check of folde-wedding.com on <strong>November 17, 2026</strong>, in Chromium (Playwright 1.65) at a 390×844 phone size. We opened the Atelier Indigo, Editorial, Rosas and Excellence designs from the collections page, tapped the envelope and scrolled every section. The screenshots in this guide were taken during that check. We did not submit an RSVP on a live wedding. FOLDÈ Wedding publishes this guide and sells digital wedding invitations; independent sources are listed below.</p>`;

export const originalPostsEnWave2 = [
  {
    slug: "bridal-shower-invitation-wording",
    keyword: "bridal shower invitation wording",
    title: "Bridal Shower Invitation Wording: 24 Examples, From Brunch to Surprise Showers",
    metaTitle: "Bridal Shower Invitation Wording: 24 Examples + Etiquette",
    description: "What to write on a bridal or couples shower invitation, when to send it, who to invite and how to mention the registry, with 24 original wording examples.",
    excerpt: "Twenty-four wording examples, from classic to brunch and couples showers, plus the timing and guest-list rules.",
    intro: "A bridal shower invitation is usually written by the host, not the bride, and it has a few rules the wedding invitation doesn’t: the guest list has to be a subset of the wedding list, and it is the one place where mentioning the registry is expected. Below you’ll find what to include, when to send it, who to invite, and 24 wording examples you can copy and adapt, from formal to brunch, couples and surprise showers.",
    heroImage: "/images/blog/pexels/11503508.jpg",
    imageAlt: "Soft pink invitation card with a pale ribbon and a single peony",
    datePublished: "2026-11-17",
    readingTime: 8,
    author,
    quickAnswer: "A bridal shower invitation names the guest of honor and the host, gives the date, time and full address, and says how and by when to RSVP. Send it four to six weeks before the shower, or about two months ahead if guests are traveling. Only invite people who are also invited to the wedding, and add registry details on the card or a linked page.",
    tool: { variant: "wording", event: "shower", title: "Write your shower invitation", subtitle: "Add the guest of honor and the host, pick a tone, then copy the text into your card or message." },
    ctaAfter: 2,
    sections: [
      {
        heading: "What a bridal shower invitation must say",
        body: `<p>Shower invitations are less formal than the wedding invitation, but guests still need the same practical details. Check every line below before you send.</p>`,
        table: {
          caption: "Bridal shower invitation checklist",
          head: ["Element", "Example", "Why it matters"],
          rows: [
            ["Type of event", "Bridal shower, wedding shower or couples shower", "Tells guests who is celebrated and who can attend"],
            ["Guest(s) of honor", "Honoring Emma Carter", "Use the name guests know her by"],
            ["Host(s)", "Hosted by Claire Martin and the bridesmaids", "Guests reply to the host, not the couple"],
            ["Date and time", "Sunday, August 9 · 11 am to 2 pm", "An end time helps guests plan the day"],
            ["Full address", "The Garden Room, 12 Lake Street, Burlington", "Street address, not just the venue name"],
            ["RSVP", "Reply to Claire by July 26, 555 0142", "A date at least two weeks before the event"],
            ["Registry", "Registered at … or a link to the wedding website", "Expected on shower invitations"],
            ["Optional extras", "Theme, dress code, ‘bring a recipe’", "Only if guests need to act on it"],
          ],
        },
      },
      {
        heading: "When to send shower invitations",
        body: `<p>The Knot’s guidance is to mail bridal shower invitations <strong>at least four to six weeks</strong> before the shower, and to give out-of-town guests <strong>about two months’</strong> notice so they can arrange travel and buy a gift. Set the reply-by date at least two weeks before the event, so the host can confirm food and seating.</p>
<p>If the shower is close to the wedding, send the shower invitation first: guests then aren’t juggling two invitations that arrive the same week.</p>`,
        table: {
          caption: "Shower invitation timeline",
          head: ["When", "What to do"],
          rows: [
            ["8 weeks before", "Send to out-of-town guests (or everyone, if many travel)"],
            ["4–6 weeks before", "Send to local guests"],
            ["2+ weeks before", "RSVP deadline"],
            ["1 week before", "Gentle reminder to anyone who hasn’t replied"],
          ],
        },
      },
      {
        heading: "Who hosts, and who is invited",
        body: `<ul>
<li><strong>The host sends the invitations</strong> and usually pays for them. Traditionally that was the maid of honor or the bride’s mother; today it can be any friend or relative who offers.</li>
<li><strong>The couple approves the guest list</strong> before anything is sent, unless the shower is a genuine surprise.</li>
<li><strong>Never invite someone who isn’t invited to the wedding.</strong> Cross-check the two lists. The Knot calls this “a big no-no”.</li>
<li><strong>30 to 40 guests</strong> is a common size, adjusted to the venue or home.</li>
<li><strong>Couples or co-ed showers</strong> invite both partners’ friends and family; say “couples shower” or “wedding shower” on the invitation so nobody is surprised. See our <a href="/blog/couples-shower-invitations">couples shower invitation guide</a>.</li>
</ul>`,
        figure: { ...shot.rsvp, alt: "Digital RSVP form asking for attendance, party size and dietary needs", caption: "However you send it, make replying easy: a short form or a direct contact for the host." },
      },
      {
        heading: "24 bridal shower invitation wording examples",
        body: `<p>Replace the names, dates and details. Each line break is a suggested line on the card.</p>
<p><strong>Classic</strong></p>
<blockquote>1. Please join us for a bridal shower
honoring Emma Carter
Sunday, the ninth of August, at eleven o’clock
The Garden Room, Burlington
Hosted by Claire Martin</blockquote>
<blockquote>2. You are invited to a shower
in honor of the bride-to-be, Emma Carter
Sunday, August 9 · 11 am
Kindly reply to Claire by July 26</blockquote>
<blockquote>3. With love and joy, please join us
to shower Emma with good wishes
before she marries Lucas Martin</blockquote>
<blockquote>4. A bridal luncheon in honor of Emma Carter
hosted by her mother and sisters</blockquote>
<p><strong>Modern</strong></p>
<blockquote>5. She found her forever. Let’s celebrate!
Bridal shower for Emma · Sunday, August 9</blockquote>
<blockquote>6. Love is in the air
Join us for Emma’s bridal shower</blockquote>
<blockquote>7. From Miss to Mrs.
Celebrate Emma before the big day</blockquote>
<blockquote>8. Before the vows, a little party.
Bridal shower honoring Emma Carter</blockquote>
<p><strong>Brunch, tea and garden</strong></p>
<blockquote>9. Brunch and bubbly for the bride-to-be
Sunday, August 9 · 11 am</blockquote>
<blockquote>10. Love is brewing!
Join us for a tea party honoring Emma</blockquote>
<blockquote>11. Mimosas, waffles and wedding wishes
A brunch shower for Emma</blockquote>
<blockquote>12. She’s blooming! Join us in the garden
for Emma’s bridal shower</blockquote>
<p><strong>Couples and co-ed showers</strong></p>
<blockquote>13. Please join us for a couples shower
honoring Emma Carter and Lucas Martin</blockquote>
<blockquote>14. Two hearts, one home.
A wedding shower for Emma & Lucas</blockquote>
<blockquote>15. Drinks, dinner and good company
Co-ed shower celebrating Emma & Lucas</blockquote>
<blockquote>16. They’re building a life together.
Help us stock the kitchen! Couples shower for Emma & Lucas</blockquote>
<p><strong>Surprise and long-distance</strong></p>
<blockquote>17. Shh… it’s a surprise!
Please join us for a surprise shower honoring Emma
Arrive by 10:45 am, she arrives at 11</blockquote>
<blockquote>18. Can’t be there in person? Join us on video
to shower Emma with love · Link sent after you RSVP</blockquote>
<p><strong>Themed requests</strong></p>
<blockquote>19. Please bring a favorite recipe
to help fill Emma’s first family cookbook</blockquote>
<blockquote>20. Instead of a card, bring a book
with a note inside to start Emma’s library</blockquote>
<blockquote>21. Wear your garden-party best
and bring your appetite</blockquote>
<blockquote>22. Bring a photo of you with Emma
for the memory board</blockquote>
<p><strong>Registry lines</strong></p>
<blockquote>23. Emma is registered at Crate &amp; Barrel and online at
emmaandlucas.com/registry</blockquote>
<blockquote>24. Your presence is the best gift;
if you wish to bring something, Emma’s registry is linked below.</blockquote>`,
      },
      {
        heading: "How to mention the registry politely",
        body: `<p>On a wedding invitation, registry details are traditionally left off. A shower is different: it is a gift-giving party, so guests expect the information. Keep it to one line, name the store or link the wedding website, and don’t list specific items or ask for cash on the card itself.</p>
<p>For a recipe, book or photo theme, explain the request in a single sentence so guests know exactly what to bring.</p>`,
        figure: { ...live.rosas, alt: "Rosas digital wedding invitation opening screen with the couple’s names", caption: "The wedding invitation, unlike the shower invitation, traditionally leaves registry details off (FOLDÈ Rosas design)." },
      },
      {
        heading: "Paper, email or a digital invitation?",
        body: `<p>Both are fine. The Knot notes that most shower invitations are still mailed, but digital invitations are increasingly common, and replies usually come by phone or email to the host.</p>
<p>A word of caution if the couple uses a digital wedding invitation: its schedule is visible to every wedding guest, and the shower guest list is smaller. Send the shower invitation separately rather than adding it to the wedding link. FOLDÈ, which publishes this guide, makes digital <em>wedding</em> invitations; for the shower itself, a card or a simple message from the host is the right tool.</p>
<p>Sending it online? Compare <a href="/blog/bridal-shower-invitations-online">four ways to send shower invitations online</a>; planning a tea? See our <a href="/blog/tea-party-bridal-shower-invitations">tea party invitation guide</a>. Going as a guest? Here is <a href="/blog/bridal-shower-card-messages">what to write in the bridal shower card</a>.</p>
<p>For the wedding invitation that follows, see our <a href="/blog/wedding-invitation-wording-examples">wedding invitation wording examples</a> and, for the night before the wedding, our <a href="/blog/rehearsal-dinner-invitations">rehearsal dinner invitation guide</a>.</p>`,
        figure: { ...shot.timeline, alt: "Wedding timeline on a digital invitation visible to all guests", caption: "A wedding invitation’s schedule is seen by every guest, so keep invitation-only events like the shower separate." },
      },
    ],
    faqs: [
      ["Who should send the bridal shower invitations?", "The host. They collect addresses, get the couple’s approval on the guest list and handle the replies. The bride shouldn’t send her own shower invitations."],
      ["Can you invite someone to the shower who isn’t invited to the wedding?", "No. Everyone invited to a shower expects a wedding invitation. Office showers among colleagues are the usual exception, since they are hosted separately."],
      ["Is it okay to put registry information on a shower invitation?", "Yes. Unlike the wedding invitation, the shower invitation is the expected place for it. One line with the store or a link to the wedding website is enough."],
      ["How far in advance should bridal shower invitations go out?", "Four to six weeks before the shower, or about two months if many guests travel. Ask for replies at least two weeks before the event."],
      ["What’s the difference between a bridal shower and a couples shower?", "A bridal shower traditionally celebrates the bride with mostly female guests; a couples or co-ed shower celebrates both partners with friends and family of any gender. Name the type on the invitation."],
      ["Should the invitation say who is paying?", "No. Naming the host is enough; guests should never be asked to contribute to the cost of a shower held in someone’s honor."],
    ],
    methodology: `<p>Timing, guest-list and registry guidance follow The Knot’s bridal shower invitation etiquette (updated August 15, 2025), read on November 17, 2026. The 24 wording examples are original to FOLDÈ; names, dates and venues are fictional. Screenshots show FOLDÈ wedding invitations captured on folde-wedding.com the same day.</p>`,
    sources: [knotShower],
  },
  {
    slug: "engagement-party-invitations",
    keyword: "engagement party invitations",
    title: "Engagement Party Invitations: 20 Wording Examples and the Guest-List Rule",
    metaTitle: "Engagement Party Invitations: 20 Wording Examples + Etiquette",
    description: "When to send engagement party invitations, who to invite, who hosts, whether to mention gifts, and 20 wording examples, plus what to write in an engagement card.",
    excerpt: "The one guest-list rule that matters, timing, hosting and 20 wording examples for every kind of engagement party.",
    intro: "An engagement party is the first official celebration of the wedding, and its invitation quietly sets expectations: who is part of this wedding, how formal it will be, and whether gifts are expected. This guide covers the guest-list rule every etiquette expert agrees on, when to send the invitations, who hosts, and 20 wording examples, from a formal dinner hosted by parents to a casual backyard party. It ends with what to write if you’re the one sending an engagement card.",
    heroImage: "/images/blog/pexels/20485643.jpg",
    imageAlt: "Wedding rings resting on a white invitation with a sage envelope and wax seal",
    datePublished: "2026-11-17",
    readingTime: 7,
    author,
    quickAnswer: "Send engagement party invitations four to six weeks before the party, which is usually held within a few months of the proposal. Only invite people you will also invite to the wedding. Include the couple’s names, the hosts, date, time, address and how to RSVP. Gifts aren’t expected, so don’t ask for them; a gentle “no gifts, please” is fine.",
    tool: { variant: "wording", event: "engagement", title: "Write your engagement party invitation", subtitle: "Add the couple’s names, pick a tone and copy the text for a card, an email or a message." },
    ctaAfter: 2,
    sections: [
      {
        heading: "The guest-list rule: everyone invited must be invited to the wedding",
        body: `<p>This is the rule etiquette experts agree on. In The Knot’s guide, etiquette expert Diane Gottsman says anyone on the engagement party list must also be on the wedding guest list; WeddingWire says the same. Guests reasonably assume an engagement party invitation means a wedding invitation will follow.</p>
<p>The practical approach is to work backward: draft the wedding list first, then choose engagement party guests from it. The reverse isn’t true: not every wedding guest needs to be invited to the engagement party.</p>
<p>Two common workarounds, both mentioned by The Knot’s experts: hold <strong>two smaller parties</strong> (one with family, one with friends), or keep a casual get-together with friends clearly informal, which creates less expectation than a formal invitation.</p>`,
      },
      {
        heading: "When to have the party and send invitations",
        body: `<p>Paperless Post notes that engagement parties are typically held <strong>within a few months of the proposal</strong>, and that invitations should go out <strong>four to six weeks before</strong> the party. Digital invitations can be sent closer to the four-week mark, since they arrive instantly.</p>`,
        table: {
          caption: "What to include on an engagement party invitation",
          head: ["Element", "Example"],
          rows: [
            ["Hosts", "Paul and Anne Martin, or “Emma & Lucas”"],
            ["Purpose and names", "To celebrate the engagement of Emma Carter and Lucas Martin"],
            ["Date and time", "Saturday, June 6 · 7 to 10 pm"],
            ["Address", "Full street address, plus parking note if needed"],
            ["Dress code", "Cocktail attire, garden casual…"],
            ["RSVP", "Reply-by date and how to reply"],
            ["Gifts (optional)", "“No gifts, please, just your company”"],
          ],
        },
      },
      {
        heading: "Who hosts the engagement party?",
        body: `<p>Traditionally the bride’s parents hosted, but WeddingWire and The Knot both note that today anyone can: either set of parents, friends, or the couple themselves. When parents live in different cities, two parties with two hosts are common. Whoever hosts is named on the invitation and receives the replies.</p>`,
        figure: { ...live.atelier, alt: "Atelier Indigo digital wedding invitation opening with the couple’s names", caption: "The engagement party often sets the tone for the wedding style that follows. Atelier Indigo, from the FOLDÈ collection." },
      },
      {
        heading: "20 engagement party invitation wording examples",
        body: `<p><strong>Formal, hosted by parents</strong></p>
<blockquote>1. Mr. and Mrs. Paul Martin
request the pleasure of your company
at a dinner celebrating the engagement of
Emma Carter and Lucas Martin
Saturday, the sixth of June, at seven o’clock</blockquote>
<blockquote>2. Please join Anne and Robert Carter
in celebrating the engagement of their daughter
Emma to Lucas Martin</blockquote>
<blockquote>3. The families of Emma Carter and Lucas Martin
invite you to an engagement reception
in their honor</blockquote>
<p><strong>Hosted by the couple</strong></p>
<blockquote>4. We’re engaged! Join us for drinks and a toast
Emma & Lucas · Saturday, June 6 · 7 pm</blockquote>
<blockquote>5. We said yes to forever.
Now let’s celebrate with the people we love.</blockquote>
<blockquote>6. It’s official!
Come celebrate with Emma & Lucas</blockquote>
<blockquote>7. Ring on, party on.
Engagement party for Emma & Lucas</blockquote>
<p><strong>Dinner and cocktail parties</strong></p>
<blockquote>8. An evening of cocktails and celebration
in honor of Emma & Lucas</blockquote>
<blockquote>9. Dinner is served, and so is the good news.
Join us for an engagement dinner</blockquote>
<blockquote>10. Raise a glass to the happy couple
Champagne toast for Emma & Lucas</blockquote>
<p><strong>Casual and backyard</strong></p>
<blockquote>11. Burgers, beers and big news!
Backyard engagement party for Emma & Lucas</blockquote>
<blockquote>12. Love, laughter and happily ever after start here.
Join us for a casual celebration</blockquote>
<blockquote>13. Grab a drink, we’re celebrating!
Emma & Lucas are engaged</blockquote>
<p><strong>Surprise and friends-only</strong></p>
<blockquote>14. Shh! Surprise engagement party for Emma & Lucas
Please arrive by 6:45 pm</blockquote>
<blockquote>15. Friends, food and a very happy couple
Join us to celebrate Emma & Lucas</blockquote>
<p><strong>Weekend, out-of-town and virtual</strong></p>
<blockquote>16. Since we’re all in town for the holidays,
let’s celebrate Emma & Lucas’ engagement!</blockquote>
<blockquote>17. Can’t travel? Raise a glass with us online
Engagement toast for Emma & Lucas · Link after RSVP</blockquote>
<p><strong>Gift lines</strong></p>
<blockquote>18. No gifts, please. Your company is the best present.</blockquote>
<blockquote>19. Your presence is all we wish for.</blockquote>
<blockquote>20. Please, no gifts; just bring your dancing shoes.</blockquote>`,
      },
      {
        heading: "Gifts: what to say (and not say)",
        body: `<p>WeddingWire is clear that guests don’t have to bring gifts to an engagement party and that asking for them is improper, so leave registry links off the invitation. Many couples add a “no gifts” line to take the pressure off; it’s optional. Expect that some guests will bring a small gift anyway, and send a thank-you note for each.</p>`,
      },
      {
        heading: "What to write in an engagement card",
        body: `<p>If you’re a guest, an engagement card is a congratulations card, not an invitation. Keep it short and personal:</p>
<ul>
<li>“Congratulations on your engagement! We’re so happy for you both.”</li>
<li>“To a lifetime of adventures together. Cheers to the two of you!”</li>
<li>“We knew it from the start. Congratulations, Emma and Lucas!”</li>
<li>“Wishing you a joyful engagement and a beautiful wedding.”</li>
<li>“So happy that Lucas found someone as wonderful as you, Emma.”</li>
<li>“Here’s to love, laughter and happily ever after.”</li>
</ul>
<p>When the wedding invitations come, our <a href="/blog/wedding-invitation-wording-examples">wedding invitation wording guide</a> and <a href="/blog/digital-wedding-invitations">digital wedding invitations guide</a> cover the next step.</p>`,
        figure: { ...shot.collection, alt: "Collection of FOLDÈ digital wedding invitation designs on phone screens", caption: "Once the date is set, couples choose the wedding invitation style. FOLDÈ designs are made for the wedding invitation itself." },
      },
      {
        heading: "Paper, email or digital?",
        body: `<p>The Knot’s experts note that an engagement party invitation can be delivered by mail, email or word of mouth; the format should match the formality of the party. A formal dinner calls for a printed or carefully designed invitation; a backyard party can be a message.</p>
<p>FOLDÈ, which publishes this guide, makes digital <em>wedding</em> invitations, not engagement party invitations. If you like a FOLDÈ design, the engagement party is a good moment to choose it for the wedding.</p>`,
        figure: { ...shot.envelope, alt: "Sealed digital wedding invitation envelope on a phone", caption: "Digital wedding invitations open on an envelope like this one; the engagement party invitation can stay simpler." },
      },
    ],
    faqs: [
      ["How soon after getting engaged should you have the party?", "Usually within a few months of the proposal, while the news is fresh. Long engagements sometimes wait longer; there is no strict rule."],
      ["Can you invite people to the engagement party who aren’t invited to the wedding?", "It is best not to. Guests assume an engagement party invitation means a wedding invitation will follow."],
      ["Do you bring a gift to an engagement party?", "It isn’t required. A card is always welcome; some guests bring a small gift. Hosts shouldn’t ask for gifts on the invitation."],
      ["Who pays for the engagement party?", "Whoever hosts it. That used to be the bride’s parents; today it is often either family, friends or the couple."],
      ["Can you have more than one engagement party?", "Yes. Separate parties for each family, or for family and friends, are common when people live in different places."],
      ["Should the engagement party invitation match the wedding invitations?", "It doesn’t have to. Many couples haven’t chosen their wedding style yet; match the invitation to the party instead."],
    ],
    methodology: `<p>Guest-list and hosting guidance come from The Knot (updated July 27, 2023) and WeddingWire (January 12, 2021); timing from Paperless Post. All were read on November 17, 2026. Wording examples are original to FOLDÈ; names are fictional. Screenshots show FOLDÈ wedding invitation designs captured on folde-wedding.com the same day.</p>`,
    sources: [knotEngagement, paperlessEngagement, weddingwireEngagement],
  },
  {
    slug: "wedding-reception-invitation-wording",
    keyword: "wedding reception invitation wording",
    title: "Wedding Reception Invitation Wording: 18 Examples for Cards and Reception-Only Parties",
    metaTitle: "Wedding Reception Invitation Wording: 18 Examples",
    description: "How to word a reception card, a reception-only invitation after a private ceremony or elopement, and a delayed celebration, with 18 examples and etiquette.",
    excerpt: "Reception cards, reception-only invitations and delayed celebrations: what to write so nobody is confused.",
    intro: "Reception wording depends on one question: did the ceremony already happen, or are guests invited to both? A reception card inside a full invitation, an invitation to a party after a private ceremony, and a celebration months after an elopement each need different words. This guide explains the three situations, the phrases that make it clear, what to include, and 18 examples you can adapt, including reception cards and casual after-parties.",
    heroImage: "/images/blog/pexels/29821866.jpg",
    imageAlt: "Wedding invitation with a pink envelope and an illustrated couple card",
    datePublished: "2026-11-17",
    readingTime: 7,
    author,
    quickAnswer: "Use reception wording when guests are invited to the party but not the ceremony. Phrases like “a celebration of their marriage” or “a reception in their honor” make it clear the vows already happened. Include the couple’s names, date, time, venue, dress code and how to RSVP. If some guests attend both events, send the main invitation with a separate reception card.",
    tool: { variant: "wording", event: "reception", title: "Draft your reception invitation", subtitle: "Pick a tone, add your names and copy the text, or start a digital invitation with it." },
    ctaAfter: 2,
    sections: [
      {
        heading: "Three situations, three kinds of wording",
        body: `<p>The Knot’s guide to reception-only invitations notes that a reception can take place hours, days, weeks, months or even a year after the ceremony. Start by identifying your case.</p>`,
        table: {
          caption: "Which reception wording do you need?",
          head: ["Situation", "What to send", "Key wording"],
          rows: [
            ["Ceremony and reception, same day, everyone invited", "Main invitation + optional reception card", "“Reception to follow” or a card with the reception venue"],
            ["Small private ceremony, larger reception", "Reception-only invitation (plus a ceremony card for the few invited to both)", "“a celebration of their marriage”"],
            ["Elopement or courthouse wedding, party later", "Reception or celebration invitation", "“We eloped! Now let’s celebrate”"],
            ["Celebration months after the wedding", "Celebration invitation", "“in celebration of their recent marriage”"],
          ],
        },
      },
      {
        heading: "Etiquette: make it clear the ceremony already happened",
        body: `<p>The Knot puts it simply: the wording should give the when and where, and make clear a ceremony already took place. “A celebration of their marriage” does exactly that. Avoid “request the honour of your presence at their marriage” on a reception-only invitation, since guests would expect to see the vows.</p>
<p>A truly private ceremony (immediate family only) is the easiest case to explain. If half the guests are invited to the ceremony and everyone to the reception, consider a ceremony insert card for the smaller group rather than two different invitations.</p>
<p>Whatever the format, guests need a way to reply. The Knot notes that RSVP cards are the traditional route and online RSVPs work as well.</p>`,
        figure: { ...shot.rsvp, alt: "Digital RSVP form on a phone asking for attendance and dietary needs", caption: "A reception invitation still needs a clear way to reply, by card or online." },
      },
      {
        heading: "What to include",
        body: `<ul>
<li>Who is hosting (the couple, or their parents).</li>
<li>The couple’s names and that it celebrates their marriage.</li>
<li>Date and start time; an end time if the venue has one.</li>
<li>Venue name, full address and parking or shuttle details.</li>
<li>What to expect: dinner, cocktails, dancing.</li>
<li>Dress code.</li>
<li>Reply-by date and how to reply.</li>
</ul>`,
        figure: { ...live.venue, alt: "Wedding details section of a digital invitation with venue photo, address and a Get directions button", caption: "On a digital invitation, the venue section can hold the address and a directions button (FOLDÈ Editorial design)." },
      },
      {
        heading: "18 wedding reception invitation wording examples",
        body: `<p><strong>Reception cards (inside a full invitation)</strong></p>
<blockquote>1. Reception to follow
The Harbor Room · 12 Lake Street</blockquote>
<blockquote>2. Dinner and dancing
immediately following the ceremony
at The Harbor Room</blockquote>
<blockquote>3. Please join us for the reception
at six o’clock in the evening
The Harbor Room, Burlington</blockquote>
<blockquote>4. Cocktails, dinner and dancing to follow
at the Lakeside Pavilion</blockquote>
<p><strong>Reception-only, formal</strong></p>
<blockquote>5. Emma Carter and Lucas Martin
request the pleasure of your company
at a reception celebrating their marriage
Saturday, the third of October
at seven o’clock in the evening</blockquote>
<blockquote>6. Mr. and Mrs. Robert Carter
request the pleasure of your company
at a reception in honor of
their daughter Emma and Lucas Martin</blockquote>
<blockquote>7. Please join us for a celebration of the marriage of
Emma Carter and Lucas Martin
Dinner and dancing to follow</blockquote>
<blockquote>8. Having been married in a private ceremony,
Emma and Lucas invite you to celebrate with them</blockquote>
<p><strong>After an elopement or courthouse wedding</strong></p>
<blockquote>9. We eloped!
Now let’s celebrate with everyone we love.</blockquote>
<blockquote>10. We said “I do” with just our families.
Now it’s party time!</blockquote>
<blockquote>11. Married at City Hall, celebrating with you.
Join Emma & Lucas for dinner and dancing</blockquote>
<blockquote>12. Just married! The party we owe you
is finally happening.</blockquote>
<p><strong>Delayed celebration</strong></p>
<blockquote>13. In celebration of their recent marriage
please join Emma and Lucas</blockquote>
<blockquote>14. Six months married and still smiling.
Celebrate with us!</blockquote>
<blockquote>15. We tied the knot in Italy.
Now we’re bringing the party home.</blockquote>
<p><strong>Casual party</strong></p>
<blockquote>16. Mr. & Mrs. Martin are throwing a party!
Food, drinks and a dance floor</blockquote>
<blockquote>17. Backyard wedding party for Emma & Lucas
Come as you are, leave very full</blockquote>
<blockquote>18. Married! Let’s eat, drink and dance.</blockquote>`,
      },
      {
        heading: "Reception details on a digital invitation",
        body: `<p>A digital invitation can carry everything a reception needs on one link. On FOLDÈ designs (checked November 17, 2026), the sections include a schedule (“The Celebration”), the venue with a directions button, dress code, menu, accommodations and an RSVP form, and couples can hide the ones they don’t need. For a reception-only event, list only that celebration in the schedule.</p>
<p>Wording for the main invitation is in our <a href="/blog/wedding-invitation-wording-examples">20 wedding invitation examples</a>; for the dinner the night before, see <a href="/blog/rehearsal-dinner-invitations">rehearsal dinner invitations</a>.</p>`,
        figure: { ...live.hotels, alt: "Accommodations and dining sections of a digital wedding invitation listing hotels and a three-course menu", caption: "Accommodations and menu sections, as they appear on a phone (FOLDÈ Excellence design)." },
      },
      {
        heading: "When to send a reception invitation",
        body: `<p>Treat it like a wedding invitation: about six to eight weeks before the event, earlier if guests travel. For guests coming from out of town, The Knot suggests sending invitations around eight weeks before your RSVP deadline. If the reception is months after an elopement, a short announcement first lets people know a party is coming.</p>`,
        figure: { ...shot.timeline, alt: "Timeline and map section of a digital wedding invitation", caption: "List only the events each guest is invited to in the schedule." },
      },
    ],
    faqs: [
      ["Is it rude to invite guests only to the reception?", "Not when the ceremony is genuinely small or private and the invitation says so clearly. It becomes awkward when most guests attend the ceremony and a few are left out."],
      ["What is a reception card?", "A small card inside the wedding invitation suite that gives the reception venue and time when it differs from the ceremony."],
      ["Should a reception-only invitation say “honour of your presence”?", "That phrase traditionally refers to a ceremony, especially a religious one. Use “the pleasure of your company” for the reception."],
      ["Can we have a reception a year after the wedding?", "Yes. Word it as a celebration of your marriage so guests know it isn’t the ceremony."],
      ["Do reception-only guests give gifts?", "Many do, as for any wedding celebration. You don’t need to mention gifts on the invitation."],
      ["How do we tell people about the ceremony we already had?", "A sentence on the invitation (“married in a private ceremony in Italy”) or a short announcement before the invitations is enough."],
    ],
    methodology: `<p>Etiquette points follow The Knot’s guide to reception-only invitations (updated June 19, 2024) and its invitation timeline (updated July 14, 2026), both read on November 17, 2026. Wording examples are original to FOLDÈ; names and venues are fictional. Screenshots show FOLDÈ designs captured on folde-wedding.com the same day.</p>`,
    sources: [knotReception, knotTimingDated],
  },
  {
    slug: "elegant-wedding-invitations",
    keyword: "elegant wedding invitations",
    title: "Elegant Wedding Invitations: 9 Design Rules and Real Examples",
    metaTitle: "Elegant Wedding Invitations: 9 Design Rules + Examples",
    description: "What makes a wedding invitation look elegant: typography, palette, wording and restraint, with nine rules, real digital designs and the mistakes to avoid.",
    excerpt: "Restraint, hierarchy and a limited palette: nine rules, shown on real invitation designs.",
    intro: "Elegance in a wedding invitation is less about gold foil than about restraint: a clear hierarchy, a limited palette, and wording that sounds like the event. That holds on paper and on a phone screen, where small type and busy backgrounds fail faster. This guide gives nine design rules, shows them on real invitation designs we opened on a phone, and lists the mistakes that make an invitation look cluttered instead of refined.",
    heroImage: "/images/blog/pexels/34579982.jpg",
    imageAlt: "Elegant wedding stationery flat lay with a patterned envelope liner and pearls",
    datePublished: "2026-11-17",
    readingTime: 8,
    author,
    quickAnswer: "Elegant wedding invitations rely on restraint: one or two typefaces with a clear hierarchy, a limited color palette, generous white space and formal or warmly precise wording. Digital invitations add elegance through a refined opening, such as a wax-seal envelope, and calm sections that stay readable on a phone. Avoid crowding the date, mixing fonts or decoration that hurts legibility.",
    tool: { variant: "invitation", title: "Preview an elegant design with your names", subtitle: "Six designs from the FOLDÈ collection. Type your names and see them on the real opening screen." },
    ctaAfter: 1,
    sections: [
      {
        heading: "9 rules for an elegant wedding invitation",
        body: `<p>These rules apply to paper and to digital invitations. Each comes down to one idea: let the important information breathe.</p>`,
        table: {
          caption: "Elegant invitation design rules",
          head: ["Rule", "Do", "Avoid"],
          rows: [
            ["1. Clear hierarchy", "Names largest, then date, then venue", "Everything the same size"],
            ["2. Two typefaces at most", "A serif or script for names, a clean serif or sans for details", "Three or more decorative fonts"],
            ["3. Limited palette", "One accent color plus ivory, white or a deep neutral", "Many bright colors competing"],
            ["4. White space", "Generous margins around the text", "Filling every corner"],
            ["5. Readable script", "Script only for short words like names", "Long sentences in script"],
            ["6. Precise wording", "Formal or warm, but consistent", "Mixing jokes with formal phrases"],
            ["7. One signature detail", "A wax seal, a monogram or a single motif", "Several competing ornaments"],
            ["8. Consistent suite", "Same palette on save-the-date, invitation and RSVP", "A different style for each piece"],
            ["9. Test on a phone", "Check contrast and size at arm’s length", "Thin gold text on a busy photo"],
          ],
        },
      },
      {
        heading: "Real examples: elegant digital invitation designs",
        body: `<p>We opened four designs from the FOLDÈ collection on a phone on November 17, 2026. Their names, tags and descriptions below are as listed on the collections page that day.</p>`,
        table: {
          caption: "Four FOLDÈ designs and what makes them elegant",
          head: ["Design", "Collection tag", "Listed description", "Elegance cue"],
          rows: [
            ["Rosas", "Romantic", "Velvet roses and deep burgundy romance", "One deep color, serif names"],
            ["Atelier Indigo", "Elegant", "Editorial ivory with refined indigo details", "Ivory paper, single accent color"],
            ["Editorial", "Minimal", "Modern typography and understated ivory paper", "Typography does the work"],
            ["Excellence", "Elegant", "Architectural florals with champagne refinement", "Muted green and champagne"],
          ],
        },
        figure: { ...live.atelier, alt: "Atelier Indigo invitation opening screen with the names Selin and Kaan in light serif capitals", caption: "Atelier Indigo: names in spaced serif capitals, date below, plenty of room around the text." },
      },
      {
        heading: "Typography: where elegance is won or lost",
        body: `<p>On the designs above, the couple’s names are set in widely spaced serif capitals, with “Wedding Day” and the date smaller underneath. That is the hierarchy most elegant invitations share: the names first, the date second, everything else after.</p>
<ul>
<li><strong>Letter spacing</strong> on capitals reads as refined; tight capitals look loud.</li>
<li><strong>Script</strong> works for names or a single word, never for addresses or times.</li>
<li><strong>Numbers</strong> should be easy to read: spell out the date on a formal card, use numerals on a phone if space is tight.</li>
<li><strong>Contrast</strong>: white text over a photo needs a soft shadow or a darker area behind it.</li>
</ul>`,
        figure: { ...live.editorial, alt: "Editorial invitation opening screen with the names Elena and Nicolas over a painted garden scene", caption: "Editorial: the same hierarchy over an illustrated scene, with the text kept in the calm upper area." },
      },
      {
        heading: "Elegant wording",
        body: `<p>Elegant doesn’t have to mean old-fashioned, but it does mean consistent. Choose one register and keep it through every card.</p>
<blockquote>Together with their families
Emma Rose Carter and Lucas Daniel Martin
request the pleasure of your company
at the celebration of their marriage
Saturday, the twelfth of September
two thousand twenty-six
at four o’clock in the afternoon</blockquote>
<blockquote>Emma &amp; Lucas
invite you to celebrate their marriage
September 12, 2026 · A château in Burgundy, France</blockquote>
<p>More options, from formal to relaxed, are in our <a href="/blog/wedding-invitation-wording-examples">20 wedding invitation wording examples</a>.</p>`,
      },
      {
        heading: "What makes a digital invitation feel elegant",
        body: `<p>On a phone, elegance comes from the sequence as much as the design: an opening moment, then calm, well-spaced sections.</p>
<ul>
<li><strong>A considered opening</strong>: on FOLDÈ designs, guests first see a sealed envelope and tap to open it.</li>
<li><strong>Sound off until chosen</strong>: the designs we opened showed a sound button rather than playing music at full volume.</li>
<li><strong>Sections that match the style</strong>: a countdown, dress code, accommodations and RSVP use the same palette and type.</li>
<li><strong>Only the sections you need</strong>: hiding unused sections keeps the page short.</li>
</ul>`,
        figure: { ...live.countdown, alt: "Countdown clock section reading Our Forever above a venue photo on a digital invitation", caption: "A countdown section in the Excellence design: dark green, serif title, nothing else competing." },
      },
      {
        heading: "Mistakes that make an invitation look less elegant",
        body: `<ul>
<li>Putting the date in a decorative script nobody can read quickly.</li>
<li>Using a photo as background without checking text contrast.</li>
<li>Adding every possible section: an elegant invitation edits.</li>
<li>Mixing a formal wording with emoji or casual jokes.</li>
<li>Choosing gold or foil-like colors that become hard to read on screens.</li>
<li>Letting the RSVP look like an afterthought: it should match the design.</li>
</ul>`,
        figure: { ...live.dressCode, alt: "Dress code section with a watercolor illustration of a couple and an accommodations list", caption: "A dress code illustration in the same soft palette as the rest of the invitation." },
      },
      {
        heading: "Paper or digital for an elegant wedding?",
        body: `<p>Paper wins on touch: weight, texture, letterpress, a real wax seal. Digital wins on everything that happens after sending: updates, a map, an RSVP that counts itself. Many couples keep a few printed invitations for grandparents and send a digital invitation to everyone else. Our <a href="/blog/digital-wedding-invitations">digital wedding invitations guide</a> compares costs and formats in detail.</p>
<p>Browse every design on the <a href="/collections">FOLDÈ collections page</a>.</p>`,
        figure: { ...live.rosas, alt: "Rosas invitation opening screen with the names Aylin and Berkan over a painted couple", caption: "Rosas: a romantic scene, still with one clear block of text." },
      },
    ],
    faqs: [
      ["What colors look most elegant on a wedding invitation?", "Ivory, white or deep neutrals with one accent: burgundy, navy, sage or champagne. Limiting the palette matters more than the exact color."],
      ["Are script fonts elegant?", "Yes, in small doses. Use script for names or a single word and pair it with a readable serif or sans-serif for the details."],
      ["Can a digital invitation look as elegant as paper?", "It can, if the type is large enough for a phone, the palette is limited and the opening is considered. Test it on a real phone before sending."],
      ["Is black and white elegant for a wedding invitation?", "Very. Black and white relies entirely on typography and spacing, which is why it reads as refined."],
      ["How formal should elegant wording be?", "As formal as the event. A black-tie dinner suits traditional wording; a garden wedding can be warm and simple while staying elegant."],
      ["Should the save-the-date match the invitation?", "Ideally, yes: the same palette and typefaces make the whole suite feel intentional."],
    ],
    methodology: designCheck,
    sources: [knotTimingDated],
  },
  {
    slug: "destination-wedding-invitations",
    keyword: "destination wedding invitations",
    title: "Destination Wedding Invitations: 12 Wording Examples, the Send Timeline and Travel Details",
    metaTitle: "Destination Wedding Invitations: Timeline + 12 Wordings",
    description: "When to send save-the-dates and invitations for a destination wedding, what travel details to include, 12 wording examples and how to keep guests updated.",
    excerpt: "The timeline, the travel details guests need, and 12 wording examples for weddings away from home.",
    intro: "A destination wedding invitation is a travel document as much as an invitation. Guests have to book flights, hotels and time off, sometimes renew a passport, and they will make those decisions from what you send them. This guide gives the timeline for save-the-dates and invitations, the travel details every destination invitation needs, 12 wording examples, and how to keep everyone updated without sending a new message each time something changes.",
    heroImage: "/images/blog/pexels/1024993.jpg",
    imageAlt: "Couple walking along a tropical beach at sunset",
    datePublished: "2026-11-17",
    readingTime: 8,
    author,
    quickAnswer: "For a destination wedding, send save-the-dates about eight months ahead, the upper end of The Knot’s six-to-eight-month range for far-flung locations, then the invitation at least eight weeks before, earlier if guests need passports or visas. Include the location, the dates of every event, an RSVP deadline, accommodation options, airport and transport tips, a dress code for the climate and one contact for questions.",
    tool: { variant: "invitation", title: "See your destination invitation", subtitle: "Type your names and pick a design. The real invitation also holds hotels, a map with directions and your RSVP." },
    ctaAfter: 1,
    sections: [
      {
        heading: "Destination wedding invitation timeline",
        body: `<p>The Knot recommends sending save-the-dates six to eight months before the wedding and skewing toward eight for a far-flung location or a holiday weekend; under four months is too late for a save-the-date to be useful. For the invitation itself, The Knot suggests eight weeks ahead for a destination wedding, since guests already know to book from the save-the-date.</p>`,
        table: {
          caption: "Destination wedding stationery timeline",
          head: ["When", "What to send", "Why"],
          rows: [
            ["8+ months before", "Save-the-date with location and dates", "Time to book flights, save and request leave"],
            ["6 months before", "Latest date for save-the-dates", "Later, guests may not be able to travel"],
            ["3–4 months before", "Invitation, if guests need passports or visas", "Our recommendation for international travel"],
            ["8 weeks before (minimum)", "Invitation", "The Knot’s guidance for destination weddings"],
            ["4–6 weeks before", "RSVP deadline", "Time to confirm numbers with the venue"],
          ],
        },
      },
      {
        heading: "What every destination invitation should include",
        body: `<ul>
<li><strong>Location</strong>: venue, town and country, with a map link.</li>
<li><strong>Every event and its date</strong>: welcome drinks, ceremony, reception, farewell brunch.</li>
<li><strong>RSVP deadline</strong>, and whether plus-ones and children are invited.</li>
<li><strong>Where to stay</strong>: hotel options, room-block codes and booking deadlines.</li>
<li><strong>Getting there</strong>: nearest airport, transfers or shuttles.</li>
<li><strong>Dress code for the climate</strong>: “beach formal”, “no stilettos on the lawn”.</li>
<li><strong>Documents</strong>: a reminder to check passport validity and any entry requirements.</li>
<li><strong>A contact</strong> for travel questions, ideally not the couple.</li>
</ul>`,
        figure: { ...live.countdown, alt: "Digital invitation with a countdown and a destination section showing the venue", caption: "A countdown and a destination section, as guests see them on a phone (FOLDÈ Excellence design)." },
      },
      {
        heading: "Put the travel details where guests can find them again",
        body: `<p>Destination guests come back to the invitation several times: to book, to pack, and on the day. A printed card can’t hold all that; a digital invitation or wedding website can. On FOLDÈ designs (checked November 17, 2026), the invitation includes an accommodations section with hotel names and prices, a venue section with a directions button, the schedule, dress code and RSVP, all on one link that can be updated after sending.</p>`,
        figure: { ...live.hotels, alt: "Accommodations section listing two hotels with nightly prices, followed by a dining menu", caption: "An accommodations section with hotel suggestions and prices, then the menu." },
      },
      {
        heading: "12 destination wedding invitation wording examples",
        body: `<p><strong>Formal</strong></p>
<blockquote>1. Together with their families
Emma Carter and Lucas Martin
request the pleasure of your company
at their wedding in Positano, Italy
Saturday, the twelfth of September</blockquote>
<blockquote>2. Please join us as we celebrate our marriage
on the shores of Lake Como
September 10–13, 2026</blockquote>
<blockquote>3. Mr. and Mrs. Robert Carter
invite you to the wedding of their daughter Emma to Lucas Martin
at a château in Burgundy, France</blockquote>
<p><strong>Weekend celebration</strong></p>
<blockquote>4. Pack your bags! Join Emma & Lucas
for a wedding weekend in Tulum
Friday welcome drinks to Sunday brunch</blockquote>
<blockquote>5. Three days, one island and all our favorite people.
Join us in Santorini</blockquote>
<blockquote>6. Sun, sea and “I do”.
Wedding weekend in the Algarve</blockquote>
<p><strong>Relaxed</strong></p>
<blockquote>7. We’re getting married in Mexico, and we’d love you there!</blockquote>
<blockquote>8. Flip-flops encouraged.
Beach wedding for Emma & Lucas</blockquote>
<blockquote>9. Passport? Check. Sunscreen? Check.
Celebrate with us in Bali</blockquote>
<p><strong>Considerate lines</strong></p>
<blockquote>10. We know traveling is a big ask.
Your presence is the only gift we hope for.</blockquote>
<blockquote>11. We understand if you can’t make the trip;
we’ll celebrate with you when we’re home.</blockquote>
<blockquote>12. Adults-only celebration. Thank you for understanding.</blockquote>`,
      },
      {
        heading: "Etiquette for destination weddings",
        body: `<ul>
<li><strong>Expect more declines</strong> than for a local wedding, and don’t take them personally.</li>
<li><strong>Gifts</strong>: many couples tell guests that the trip is gift enough. It’s a kind line to include.</li>
<li><strong>Welcome events</strong>: if everyone is invited, list them on the invitation; if not, invite separately.</li>
<li><strong>Costs</strong>: guests usually pay their own travel and lodging; negotiate a room block to help.</li>
<li><strong>Updates</strong>: if a time or shuttle changes, update the invitation and send one short message.</li>
</ul>`,
        figure: { ...live.venue, alt: "Venue section of a digital invitation with address and a Get directions button", caption: "A directions button saves guests from copying an address into a maps app in a foreign country." },
      },
      {
        heading: "Paper, digital or both?",
        body: `<p>A printed save-the-date can make a lovely keepsake, but international postage is slow and expensive, and travel details change. Many destination couples send a digital save-the-date and invitation, and print a few for family. Our <a href="/blog/digital-wedding-invitations">digital wedding invitations guide</a> compares the two, and our <a href="/blog/wedding-rsvp-cards">RSVP guide</a> covers what to ask guests.</p>`,
        figure: { ...shot.rsvp, alt: "RSVP form on a digital wedding invitation", caption: "One RSVP form for all guests, wherever they live." },
      },
    ],
    faqs: [
      ["How far in advance should you send destination wedding invitations?", "At least eight weeks before the wedding, following save-the-dates sent about eight months ahead. If guests need passports or visas, send the invitation three to four months ahead."],
      ["Do you need save-the-dates for a destination wedding?", "Yes. They are the piece that lets guests book travel and time off; send them about eight months before."],
      ["What should a destination wedding invitation include?", "Location, dates of each event, RSVP deadline, where to stay, how to get there, a climate-appropriate dress code, a reminder about travel documents and a contact for questions."],
      ["Who pays for guests at a destination wedding?", "Guests usually pay their own travel and accommodation. Couples often cover a welcome event and may negotiate a hotel room block."],
      ["Is it okay to say “no gifts” on a destination invitation?", "Yes. Many couples say the trip is gift enough, which guests appreciate."],
      ["Should I send a paper invitation abroad?", "You can, but international mail is slow. A digital invitation arrives instantly and can be updated if travel details change."],
    ],
    methodology: `${designCheck}<p>Timeline guidance comes from The Knot’s save-the-date etiquette (updated April 17, 2025) and invitation timeline (updated July 14, 2026), read on November 17, 2026. The three-to-four-month window for guests who need passports or visas is our own recommendation, not The Knot’s.</p>`,
    sources: [knotSaveDates, knotTimingDated],
  },
];
