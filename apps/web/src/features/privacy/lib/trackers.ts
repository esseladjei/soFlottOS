// ---------------------------------------------------------------------------
// Loads and stops third-party measurement and advertising technology.
//
// `applyConsent` is the one gate. It is called with the visitor's decision
// (or `null` before any decision) and makes the page match it:
//
//   - no decision / denied  -> nothing is loaded, known cookies are removed
//   - granted               -> the matching scripts are loaded, once
//   - granted -> withdrawn  -> cookies are removed and the page must reload,
//                              which is the only way to reliably stop scripts
//                              that are already running
//
// A tracker whose ID is not configured (see `privacy-config.ts`) is never loaded.
// Page views are sent by hand so only the path is shared - never the query
// string or fragment, which could contain tokens or personal data.
// ---------------------------------------------------------------------------

import { clearCookiesFor } from "@/features/privacy/lib/cookie-cleanup";
import { NO_CONSENT, optionalCategories, type ConsentChoices, type OptionalCategory } from "@/features/privacy/lib/consent-model";
import { ensureGtag, updateGoogleConsent } from "@/features/privacy/lib/google-consent";
import { trackerIds } from "@/features/privacy/lib/privacy-config";

interface Fbq {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
  disablePushState: boolean;
}

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    _linkedin_data_partner_ids?: string[];
    _linkedin_partner_id?: string;
  }
}

export type ApplyResult = "applied" | "reload";

const googleConfigured = trackerIds.googleAnalytics !== null || trackerIds.googleAds !== null;

/** Categories whose technology is running in this page and so needs a reload to stop. */
const running = new Set<OptionalCategory>();
const loadedScripts = new Set<string>();
const configuredGoogleIds = new Set<string>();
const lastPagePerTracker = new Map<string, string>();
let gtagLoaded = false;

function loadScript(src: string) {
  if (loadedScripts.has(src)) return;
  loadedScripts.add(src);

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

/** `true` the first time a tracker sees `path`, so route changes are sent once. */
function isNewPage(tracker: string, path: string): boolean {
  if (lastPagePerTracker.get(tracker) === path) return false;
  lastPagePerTracker.set(tracker, path);
  return true;
}

function activateGoogle(ids: string[], path: string) {
  if (ids.length === 0) return;

  const gtag = ensureGtag();

  if (!gtagLoaded) {
    gtagLoaded = true;
    gtag("js", new Date());
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`);
  }

  for (const id of ids) {
    if (!configuredGoogleIds.has(id)) {
      configuredGoogleIds.add(id);
      gtag("config", id, { send_page_view: false });
    }

    if (isNewPage(id, path)) {
      gtag("event", "page_view", {
        send_to: id,
        page_path: path,
        page_location: `${window.location.origin}${path}`,
      });
    }
  }
}

function activateMeta(id: string, path: string) {
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;

    fbq.push = fbq;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    // Page views are sent below; the pixel must not also watch history changes or auto-collect clicks.
    fbq.disablePushState = true;
    window.fbq = fbq;
    window._fbq = fbq;

    loadScript("https://connect.facebook.net/en_US/fbevents.js");
    fbq("set", "autoConfig", false, id);
    fbq("init", id);
  }

  if (isNewPage("meta", path)) window.fbq?.("track", "PageView");
}

function activateLinkedIn(id: string) {
  window._linkedin_partner_id = id;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids ?? [];
  if (!window._linkedin_data_partner_ids.includes(id)) window._linkedin_data_partner_ids.push(id);

  loadScript("https://snap.licdn.com/li.lms-analytics/insight.min.js");
}

function activateAnalytics(path: string) {
  running.add("analytics");

  if (trackerIds.googleAnalytics) activateGoogle([trackerIds.googleAnalytics], path);
}

function activateMarketing(path: string) {
  const hasMarketingTech = trackerIds.googleAds || trackerIds.metaPixel || trackerIds.linkedIn;
  if (hasMarketingTech) running.add("marketing");

  if (trackerIds.googleAds) activateGoogle([trackerIds.googleAds], path);
  if (trackerIds.metaPixel) activateMeta(trackerIds.metaPixel, path);
  if (trackerIds.linkedIn) activateLinkedIn(trackerIds.linkedIn);
}

/** Tells Google's scripts to stop measuring right away, even before the reload completes. */
function disableGoogleMeasurement() {
  for (const id of [trackerIds.googleAnalytics, trackerIds.googleAds]) {
    if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
  }
}

/**
 * Makes the page match the visitor's decision. Returns `"reload"` when a
 * technology that already runs was withdrawn and the page has to be reloaded.
 */
export function applyConsent(decision: ConsentChoices | null, path: string): ApplyResult {
  const choices = decision ?? NO_CONSENT;
  const denied = optionalCategories.filter((category) => !choices[category]);
  const withdrawn = denied.filter((category) => running.has(category));

  if (googleConfigured) updateGoogleConsent(choices);

  clearCookiesFor(denied);

  if (withdrawn.length > 0) {
    disableGoogleMeasurement();
    return "reload";
  }

  if (choices.analytics) activateAnalytics(path);
  if (choices.marketing) activateMarketing(path);

  return "applied";
}
