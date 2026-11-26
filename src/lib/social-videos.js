// Short videos shown on the home page ("As seen on Instagram / Shorts").
// Order = best performing first. Each entry is a compressed copy served from
// /public (no Instagram or YouTube embed, so no third-party script slows the page).
// To add a YouTube Short: { platform: 'youtube', id: '<short id>', src, poster, hook }.
// `views` is optional and must be the real figure read on the platform.
import { AFFILIATE_REELS } from "@/lib/affiliate-copy";

export const INSTAGRAM_HANDLE = "folde.design";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export const SOCIAL_VIDEOS = AFFILIATE_REELS.map((reel) => ({ ...reel, platform: "instagram" }));

export function videoUrl(video) {
  return video.platform === "youtube"
    ? `https://www.youtube.com/shorts/${video.id}`
    : `https://www.instagram.com/${INSTAGRAM_HANDLE}/reel/${video.id}/`;
}
