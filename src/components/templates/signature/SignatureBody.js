"use client";

/* eslint-disable @next/next/no-img-element */
// Shared structure of the illustrated signature invitations. Each design
// (Nacre, Jardin Brodé, Riviera, Suite, Love Letter, Photobooth, Meadow) supplies its own stylesheet `s`, its artwork
// `art` (exposed to CSS as --a-<name> variables) and a few options.

import React, { useRef } from 'react';
import { localizedStockLabel, weddingDateLabel, weddingDateParts } from '@/lib/template-copy.mjs';
import { Reveal, Scrolly, Particles, RollingNumber, RsvpForm, GuestPhotos, useCountdown, useViewportVars, mapSrc, directionsHref } from './kit';
import FoldeCredit, { FoldeMadeWith } from '../../FoldeCredit';

const DEFAULT_VENUE = 'https://images.pexels.com/photos/34639710/pexels-photo-34639710.jpeg';

// Picks a cell of the painted icon sheet for the i-th programme entry.
function iconCell(icons, i) {
  const k = icons.order ? icons.order[i % icons.order.length] : i % (icons.cols * icons.rows);
  return { '--col': k % icons.cols, '--row': Math.floor(k / icons.cols) };
}

function Heading({ s, kicker, title, sub, write = true }) {
  return (
    <header className={s.head}>
      {kicker && <Reveal variant="fade"><p className={s.kicker}>{kicker}</p></Reveal>}
      <Reveal as="h2" variant={write ? 'write' : 'blur'} className={s.title}><span>{title}</span></Reveal>
      {sub && <Reveal variant="rise" delay={250}><p className={s.sub}>{sub}</p></Reveal>}
    </header>
  );
}

/** Decorative artwork: fades in and drifts slightly with the scroll. */
function Art({ s, name, className = '', alt = '' }) {
  return (
    <Scrolly className={`${s.art} ${className}`} aria-hidden={alt ? undefined : 'true'}>
      <Reveal variant="fade" className={s.artInner}><img src={name} alt={alt} loading="lazy" /></Reveal>
    </Scrolly>
  );
}

export default function SignatureBody({ ctx, s, art, options = {}, opening = null }) {
  const { t, copy, labels, lang, partner1, partner2, showPartner2, dateStr, targetDate, ceremonyVenue, receptionVenue, timeline, accommodations, menu, sections, images, gallery, story, showGifts, preview } = ctx;
  const rootRef = useRef(null);
  useViewportVars(rootRef);
  const countdown = useCountdown(targetDate, t.time);
  const dateLabel = weddingDateLabel(dateStr, lang);
  const parts = weddingDateParts(dateStr, lang);
  const artVars = Object.fromEntries(Object.entries(art).map(([key, value]) => [`--a-${key}`, `url(${value})`]));
  const icons = options.icons;

  return (
    <div ref={rootRef} className={s.root} data-preview={preview ? 'true' : 'false'} style={artVars}>
      {options.fonts && <link href={options.fonts} rel="stylesheet" />}

      {/* ============ OPENING PANEL ============ */}
      {opening || (
      <section className={s.opening}>
        {options.particles && <Particles {...options.particles} />}
        <div className={s.openingArt} aria-hidden="true" />
        <div className={s.openingInner}>
          <Reveal variant="fade"><p className={s.kicker}>{story.eyebrow}</p></Reveal>
          <Reveal variant="write" delay={150} className={s.names}>
            <span>{partner1}</span>
          </Reveal>
          {showPartner2 && (
            <>
              <Reveal variant="scale" delay={500}><span className={s.amp}>&amp;</span></Reveal>
              <Reveal variant="write" delay={650} className={s.names}><span>{partner2}</span></Reveal>
            </>
          )}
          <Reveal variant="rise" delay={950} className={s.openingDate}>
            <span>{parts.month}</span><strong>{parts.day}</strong><span>{parts.year}</span>
          </Reveal>
          <Reveal variant="fade" delay={1150}><p className={s.openingPlace}>{ceremonyVenue}</p></Reveal>
        </div>
      </section>
      )}

      {/* ============ STORY ============ */}
      <section id="sig-story" className={`${s.section} ${s.story}`}>
        {art.story && <Art s={s} name={art.story} className={s.storyArt} />}
        <div className={s.storyCard}>
          <Heading s={s} title={story.title} />
          <Reveal variant="rise" delay={200}><p className={s.body}>{story.text}</p></Reveal>
          {sections.showIntro !== false && (
            <Reveal variant="blur" delay={350}>
              <p className={s.signature}>{t.introTitle || copy.dayHasArrived}</p>
              <p className={s.small}>{t.introText || copy.cantWaitToCelebrate}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ============ COUNTDOWN ============ */}
      {!countdown.past && !options.skipCount && (
        <section id="sig-count" className={`${s.section} ${s.count}`}>
          {art.countTop && <Art s={s} name={art.countTop} className={s.countTop} />}
          <Heading s={s} kicker={t.countdownEyebrow || labels.countdownEyebrow} title={t.countdownTitle || labels.countdownTitle} />
          <Reveal variant="scale" className={s.countFrame}>
            <div className={s.countRow}>
              {['days', 'hours', 'minutes', 'seconds'].map((key) => (
                <div key={key} className={s.countCell}>
                  <RollingNumber value={countdown[key]} pad={Math.max(2, String(countdown[key]).length)} className={s.countNum} />
                  <span>{labels[key]}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal variant="write" delay={300} className={s.flourish}><span>{dateLabel}</span></Reveal>
        </section>
      )}

      {/* ============ VENUE ============ */}
      {sections.showVenue !== false && (
        <section id="sig-venue" className={`${s.section} ${s.venue}`}>
          <Heading s={s} kicker={t.venueTitle || copy.venueShort} title={ceremonyVenue} />
          <Scrolly className={s.venueFrame}>
            <Reveal variant="iris" className={s.venuePhoto}>
              <img src={images.venue || DEFAULT_VENUE} alt={ceremonyVenue} loading="lazy" />
            </Reveal>
            <span className={s.venueRim} aria-hidden="true" />
          </Scrolly>
          <Reveal variant="rise"><p className={s.body}>{receptionVenue}</p></Reveal>
          <Reveal variant="rise" delay={120}>
            <a className={s.btn} href={directionsHref(receptionVenue)} target="_blank" rel="noopener noreferrer"><span>{copy.getDirections}</span></a>
          </Reveal>
          <Reveal variant="scale" className={s.map}>
            <iframe title={ceremonyVenue} src={mapSrc(receptionVenue)} loading="lazy" allowFullScreen />
          </Reveal>
        </section>
      )}

      {/* ============ SCHEDULE ============ */}
      {sections.showSchedule !== false && (
        <section id="sig-schedule" className={`${s.section} ${s.schedule}`}>
          {art.scheduleTop && <Art s={s} name={art.scheduleTop} className={s.scheduleTop} />}
          <Heading s={s} kicker={copy.celebrationTitle} title={t.scheduleTitle || copy.scheduleTitle} sub={copy.scheduleSubtitle} />
          <Scrolly as="ol" from={0.82} to={0.4} className={s.timeline} style={{ '--n': timeline.length }}>
            <li className={s.rail} aria-hidden="true"><i /></li>
            {timeline.map((item, i) => (
              <li key={i} className={s.event} data-side={i % 2 ? 'b' : 'a'} style={{ '--i': i }}>
                {icons && <span className={s.eventIcon} style={iconCell(icons, i)} aria-hidden="true" />}
                <span className={s.eventDot} aria-hidden="true" />
                <span className={s.eventText}>
                  <strong>{item.time}</strong>
                  <em>{localizedStockLabel(item.title, lang, 'event')}</em>
                </span>
              </li>
            ))}
          </Scrolly>
        </section>
      )}

      {/* ============ DRESS CODE ============ */}
      {sections.showDressCode !== false && (
        <section className={`${s.section} ${s.dress}`}>
          <div className={s.dressCard}>
            <Heading s={s} kicker={copy.dressCodeInspiration} title={copy.dressCodeTitle} />
            <Reveal variant="blur" className={t.dressCode?.image || !art.dress ? s.dressPhoto : s.dressArt}>
              <img src={t.dressCode?.image || art.dress || '/images/dress_code_floral.png'} alt={copy.dressCodeInspiration} loading="lazy" />
            </Reveal>
            {t.dressCode?.text && <Reveal variant="write" delay={150} className={s.flourish}><span>{t.dressCode.text}</span></Reveal>}
          </div>
        </section>
      )}

      {/* ============ ACCOMMODATIONS ============ */}
      {sections.showAccommodations !== false && accommodations.length > 0 && (
        <section className={`${s.section} ${s.stay}`}>
          <Heading s={s} title={copy.accommodationsTitle} sub={copy.accommodationsSubtitle} />
          <div className={s.stayList}>
            {accommodations.map((item, i) => (
              <Reveal key={i} variant="rise" delay={i * 140} className={s.stayCard}>
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ MENU ============ */}
      {sections.showMenu !== false && (
        <section className={`${s.section} ${s.menu}`}>
          {art.menuTop && <Art s={s} name={art.menuTop} className={s.menuTop} />}
          <Heading s={s} title={t.menuTitle || copy.menuTitle} sub={copy.menuSubtitle} />
          <div className={s.courses}>
            {menu.map((course, i) => (
              <Reveal key={i} variant="rise" delay={i * 150} className={s.course}>
                <small>{localizedStockLabel(course.course, lang, 'course')}</small>
                <p>{course.dish}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ GALLERY ============ */}
      {sections.showGallery !== false && (
        <section id="gallery" className={`${s.section} ${s.gallery}`}>
          <Heading s={s} title={t.galleryTitle || copy.memoriesTitle} sub={copy.memoriesSubtitle} />
          <Reveal variant="fade" className={s.reel}>
            {gallery.map((src, i) => (
              <figure key={src + i} className={s.shot} style={{ '--i': i }}>
                <img src={src} alt={`${copy.memoryLabel || 'Memory'} ${i + 1}`} loading="lazy" />
              </figure>
            ))}
          </Reveal>
        </section>
      )}

      {/* ============ GIFTS ============ */}
      {showGifts && (
        <section id="sig-gifts" className={`${s.section} ${s.gifts}`}>
          <div className={s.giftCard}>
            <Heading s={s} kicker={labels.gifts} title={story.giftTitle} />
            <Reveal variant="rise" delay={150}><p className={s.body}>{story.giftText}</p></Reveal>
            {t.giftLink && <Reveal variant="rise" delay={250}><a className={s.btn} href={t.giftLink} target="_blank" rel="noopener noreferrer"><span>{t.giftButton || labels.giftButton}</span></a></Reveal>}
          </div>
        </section>
      )}

      {/* ============ MADE WITH (quiet line just above the RSVP) ============ */}
      <div className={s.madeWithRow}><FoldeMadeWith language={lang} themeId={ctx.themeId} /></div>

      {/* ============ RSVP ============ */}
      {sections.showRSVP !== false && (
        <section id="rsvp" className={`${s.section} ${s.rsvp}`}>
          {art.rsvpTop && <Art s={s} name={art.rsvpTop} className={s.rsvpTop} />}
          <Heading s={s} title={copy.rsvpTitle} sub={copy.rsvpSubtitle} />
          {t.rsvpDeadline && <Reveal variant="fade" delay={150}><p className={s.small}>{copy.rsvpReplyBy} {t.rsvpDeadline}</p></Reveal>}
          <Reveal variant="rise" delay={150} threshold={0.05} className={s.rsvpCard}>
            <RsvpForm ctx={ctx} s={s} burstColors={options.burst} />
          </Reveal>
        </section>
      )}

      {/* ============ GUEST PHOTOS ============ */}
      {sections.showGuestGallery !== false && (
        <section className={`${s.section} ${s.guestSection}`}>
          <Heading s={s} title={copy.guestGalleryTitle} sub={copy.guestGallerySubtitle} />
          <GuestPhotos ctx={ctx} s={s} />
        </section>
      )}

      {/* ============ FINALE ============ */}
      <footer className={s.finale}>
        {options.particles && <Particles {...options.particles} />}
        {art.finaleTop && <Art s={s} name={art.finaleTop} className={s.finaleTop} />}
        <Reveal variant="write" className={s.finaleNames}><span>{partner1}{showPartner2 ? ` & ${partner2}` : ''}</span></Reveal>
        <Reveal variant="fade" delay={300}><p className={s.kicker}>{dateLabel}</p></Reveal>
        {art.finale && <Art s={s} name={art.finale} className={s.finaleArt} />}
      </footer>
      <FoldeCredit language={lang} themeId={ctx.themeId} tone={options.creditTone || 'light'} accent={options.creditAccent || '#8A5A35'} background={options.creditBg} />
    </div>
  );
}
