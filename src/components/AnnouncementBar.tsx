import React from "react";
import { SITE_CONFIG } from "@/config/site";

interface AnnouncementBarProps {
  items?: readonly string[] | string[];
}

/**
 * Top Announcement Marquee Bar
 *
 * Continuously moving horizontal announcement bar positioned directly above the main navbar.
 * Features an infinite, seamless loop powered by GPU-accelerated CSS animations.
 *
 * Configurable via `SITE_CONFIG.announcement.items` or via the `items` prop.
 * Pauses smoothly on hover and respects `prefers-reduced-motion`.
 */
export default function AnnouncementBar({
  items = SITE_CONFIG.announcement.items,
}: AnnouncementBarProps) {
  if (!items || items.length === 0) return null;

  // Duplicate items within each track to ensure track width exceeds even 4K viewports (3840px)
  const trackItems = [...items, ...items];

  return (
    <aside
      className="announcement-marquee-wrapper relative w-full bg-black text-white overflow-hidden select-none border-b border-neutral-900 z-30"
      aria-label="Store Announcements"
    >
      <div className="announcement-marquee-track py-2 sm:py-2.5">
        {/* Track 1 (Primary) */}
        <div className="flex shrink-0 items-center">
          {trackItems.map((text, idx) => (
            <span
              key={`primary-${idx}`}
              className="inline-flex items-center text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.18em] uppercase text-neutral-100"
            >
              <span className="px-4 sm:px-7 whitespace-nowrap">{text}</span>
              <span
                className="text-neutral-600 text-[8px] select-none"
                aria-hidden="true"
              >
                •
              </span>
            </span>
          ))}
        </div>

        {/* Track 2 (Seamless loop identical twin) */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {trackItems.map((text, idx) => (
            <span
              key={`clone-${idx}`}
              className="inline-flex items-center text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.18em] uppercase text-neutral-100"
            >
              <span className="px-4 sm:px-7 whitespace-nowrap">{text}</span>
              <span
                className="text-neutral-600 text-[8px] select-none"
                aria-hidden="true"
              >
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
