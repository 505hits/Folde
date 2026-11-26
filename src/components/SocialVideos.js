"use client";

// "As seen on Instagram / Shorts": our best short videos in phone frames, played
// muted only while on screen, each linking to the original post.

import ReelPlayer from "@/components/affiliates/ReelPlayer";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SOCIAL_VIDEOS, videoUrl } from "@/lib/social-videos";
import { track } from "@/lib/analytics";
import s from "./social-videos.module.css";

const COPY = {
  en: { label: "As seen on", title: (shorts) => `Our invitations on TikTok & Instagram${shorts ? " & YouTube Shorts" : ""}`, text: "Real FOLDÈ invitations opening on a phone, as couples and their guests see them.", watch: { instagram: "Watch on Instagram", youtube: "Watch on YouTube" }, follow: "Follow", views: "views" },
  fr: { label: "Vu sur", title: (shorts) => `Nos faire-part sur TikTok et Instagram${shorts ? " et YouTube Shorts" : ""}`, text: "De vrais faire-part FOLDÈ qui s’ouvrent sur un téléphone, tels que les couples et leurs invités les découvrent.", watch: { instagram: "Voir sur Instagram", youtube: "Voir sur YouTube" }, follow: "Suivre", views: "vues" },
  es: { label: "Visto en", title: (shorts) => `Nuestras invitaciones en TikTok e Instagram${shorts ? " y YouTube Shorts" : ""}`, text: "Invitaciones FOLDÈ reales abriéndose en un móvil, tal como las ven las parejas y sus invitados.", watch: { instagram: "Ver en Instagram", youtube: "Ver en YouTube" }, follow: "Seguir", views: "visualizaciones" },
};

export function InstagramIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" /></svg>;
}
export function TikTokIcon() {
  return <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3a7 7 0 0 1-3.8-1.2v6.1A5.8 5.8 0 1 1 11 8.9v3.1a2.8 2.8 0 1 0 2 2.7V3h3.6Z" /></svg>;
}
function ShortsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" /><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

export default function SocialVideos({ locale = "en" }) {
  const t = COPY[locale] || COPY.en;
  const hasShorts = SOCIAL_VIDEOS.some((video) => video.platform === "youtube");
  const formatViews = (n) => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
  return (
    <section id="as-seen-on" className={s.section} aria-labelledby="social-videos-title">
      <div className={s.glow} aria-hidden="true" />
      <div className="container">
        <header className={s.header}>
          <span className={s.label}>{t.label}</span>
          <div className={s.platforms} aria-hidden="true">
            <span><TikTokIcon /> TikTok</span>
            <span><InstagramIcon /> Instagram</span>
            {hasShorts && <span><ShortsIcon /> Shorts</span>}
          </div>
          <h2 id="social-videos-title" className={s.title}>{t.title(hasShorts)}</h2>
          <p className={s.text}>{t.text}</p>
        </header>
      </div>

      <div className={s.rail}>
        {SOCIAL_VIDEOS.map((video, index) => (
          <figure key={video.id} className={s.card} style={{ "--tilt": `${index % 2 ? 1.2 : -1.2}deg` }}>
            <div className={s.phone}>
              <div className={s.screen}><ReelPlayer reel={video} /></div>
              <span className={s.badge}>{video.platform === "youtube" ? <ShortsIcon /> : <InstagramIcon />}</span>
              {Number.isFinite(video.views) && <span className={s.views}>▶ {formatViews(video.views)} {t.views}</span>}
            </div>
            <figcaption className={s.caption}>
              <p>“{video.hook}”</p>
              <a href={videoUrl(video)} target="_blank" rel="noopener noreferrer" onClick={() => track("social_video_click", { platform: video.platform, video_id: video.id })}>
                {t.watch[video.platform] || t.watch.instagram} ↗
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={s.follow}>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("social_follow_click", { platform: "instagram" })}>
          <InstagramIcon /> {t.follow} @{INSTAGRAM_HANDLE}
        </a>
      </div>
    </section>
  );
}
