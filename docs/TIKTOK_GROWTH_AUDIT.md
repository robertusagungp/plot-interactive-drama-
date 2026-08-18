# PLOT — TikTok Marketing & Growth Readiness Audit

**Date:** August 18, 2026  
**Auditor:** Senior Product Engineer & Growth Architect  
**Repository:** PLOT — Interactive Drama Platform (`robertusagungp/plot-interactive-drama-`)  
**Target:** Organic TikTok Acquisition & Paid TikTok Advertising Readiness  

---

## 1. Executive Summary

This audit evaluates the technical readiness of **PLOT** for organic TikTok content acquisition and paid TikTok Ads campaigns. The target funnel to measure with high accuracy is:

$$\text{TikTok Video/Ad} \longrightarrow \text{Landing Page / Direct Play} \longrightarrow \text{Story View} \longrightarrow \text{Story Start} \longrightarrow \text{Episode Progression} \longrightarrow \text{Registration} \longrightarrow \text{Episode 1 Completion} \longrightarrow \text{Monetization / Subscription / Purchase}$$

All identified technical gaps have been classified into **P0** (Critical / Blocker before paid ads), **P1** (Strongly recommended for tracking & conversion optimization), and **P2** (Nice-to-have performance enhancement).

---

## 2. Issues Classification Matrix

| ID | Category | Item | Severity | Current Status | Remediation Required |
|---|---|---|---|---|---|
| **AUD-01** | Routing / Deep Link | Direct Play entry points (`/play/[slug]`) | **P0** | ⚠️ Missing | Create `/play/[slug]` route that captures UTMs and launches Ep 1 immediately. |
| **AUD-02** | Attribution | UTM capture & persistence (First-Touch & Last-Touch) | **P0** | ⚠️ Missing | Store UTMs in cookies/localStorage and link to User on registration. |
| **AUD-03** | Ad Tracking | TikTok Pixel Integration (`NEXT_PUBLIC_TIKTOK_PIXEL_ID`) | **P0** | ⚠️ Missing | Install TikTok Pixel with client-side SPA navigation support & deduplication. |
| **AUD-04** | Ad Tracking | Server-Side TikTok Events API (CAPI) | **P0** | ⚠️ Missing | Build server-side CAPI client with event deduplication for `Purchase` & `CompleteRegistration`. |
| **AUD-05** | Monetization | Authoritative `Purchase` Event Trigger | **P0** | ⚠️ Missing | Ensure `Purchase` fires ONLY upon admin/gateway payment approval, never on button click. |
| **AUD-06** | Telemetry | 14 Standardized Internal Analytics Events | **P1** | ⚠️ Partial | Standardize events (`landing_view`, `story_start`, `episode_complete`, etc.). |
| **AUD-07** | Privacy | Marketing & Analytics Consent Mechanism | **P1** | ⚠️ Missing | Implement cookie/tracking consent banner respecting GDPR/privacy rules. |
| **AUD-08** | Social / UX | Above-the-fold TikTok mobile landing card & CTA | **P1** | ⚠️ Generic | Optimize `/story/[slug]` above-the-fold with artwork, short hook, and `"MAIN SEKARANG"` CTA. |
| **AUD-09** | Social Metadata | Dynamic Open Graph & Twitter Cards per story | **P1** | ⚠️ Basic | Enrich Open Graph tags with story artwork, tags, localized synopsis, and canonical URLs. |
| **AUD-10** | Database | Dedicated `UserAttribution` Model | **P1** | ⚠️ Missing | Add `UserAttribution` model to Prisma schema to record first/last touch UTMs permanently. |
| **AUD-11** | Resilience | 404 behavior for invalid campaign URLs | **P2** | ✅ Handled | Custom 404 page exists, but should guide users gracefully to trending stories. |
| **AUD-12** | Performance | Mobile LCP, WebP images, Font Subsetting | **P2** | ⚠️ Needs check | Use optimized Unsplash parameters (`w=800&q=80&format=webp`) and dynamic imports. |

---

## 3. Deep-Dive Audit Findings

### 3.1 Routing & Deep Linking (`AUD-01`) — [Severity: P0]
- **Current State:** Links directly point to `/story/[slug]` (a detail page with full episode lists) or `/story/[slug]/episode/1`. There was no dedicated short deep-link path like `/play/{slug}` optimized for TikTok bio links and ad destination URLs.
- **Risk:** TikTok users have short attention spans (2-3 seconds). Dropping them on a complex landing page with multiple options causes drop-off.
- **Solution:** Create `/play/[slug]` that captures incoming UTMs, saves attribution, fires `story_start` and `landing_view`, and immediately routes the user into Episode 1 with zero unnecessary taps.

### 3.2 Attribution Persistence (`AUD-02`) — [Severity: P0]
- **Current State:** If a user enters with `?utm_source=tiktok&utm_campaign=launch_01`, navigates between episodes, plays as a guest, and registers 20 minutes later, the URL query parameters are lost upon registration.
- **Risk:** Zero marketing attribution for registered users and downstream purchases; TikTok ad spend ROI cannot be calculated.
- **Solution:** Persist both **First-Touch** (acquisition channel) and **Last-Touch** (conversion channel) parameters in browser cookies (`plot_attribution_first`, `plot_attribution_last`) and sync with the database on `/api/auth/register`.

### 3.3 TikTok Pixel & Events API (`AUD-03`, `AUD-04`, `AUD-05`) — [Severity: P0]
- **Current State:** No TikTok Pixel script or Server-Side Events API client existed in the codebase.
- **Risk:** Cannot optimize TikTok ad delivery for `CompleteRegistration` or `Purchase`.
- **Solution:** 
  - Install a client-side TikTok Pixel component initialized via `NEXT_PUBLIC_TIKTOK_PIXEL_ID`.
  - Build a server-side TikTok Events API client using `TIKTOK_ACCESS_TOKEN` and `TIKTOK_PIXEL_ID` environment variables.
  - Implement event deduplication using matching `event_id` between client and server.
  - Fire `Purchase` strictly when a payment order is approved in `src/lib/services/payments.ts`.

### 3.4 Internal Analytics Events Standardization (`AUD-06`) — [Severity: P1]
- **Current State:** Analytics only tracked generic `story_view` and `choice_selected`.
- **Solution:** Implement all 14 standard events: `landing_view`, `story_view`, `story_start`, `episode_start`, `choice_selected`, `episode_complete`, `story_complete`, `ending_unlocked`, `registration_started`, `registration_completed`, `paywall_view`, `checkout_started`, `subscription_started`, `purchase_completed`.

### 3.5 Privacy & Data Sanitation (`AUD-07`) — [Severity: P1]
- **Current State:** No consent banner for marketing cookies.
- **Rule:** Never send dialogue text, user choices, passwords, or personal chat text to third-party ad networks. Send only non-sensitive event identifiers (`story_id`, `episode_number`, `price_idr`).
- **Solution:** Provide a lightweight, mobile-friendly consent banner (`plot_consent`) and data sanitizer.

---

## 4. Remediation Plan & Verification Milestones

1. **Milestone 1:** Add `UserAttribution` to Prisma schema and migrate database.
2. **Milestone 2:** Implement `src/lib/analytics/attribution.ts` and `src/components/analytics/AttributionProvider.tsx`.
3. **Milestone 3:** Implement TikTok Pixel (`TikTokPixel.tsx`) & Server-Side Events API (`tiktok-events-api.ts`).
4. **Milestone 4:** Create `/play/[slug]` direct-entry route and optimize `/story/[slug]` mobile landing UX.
5. **Milestone 5:** Connect authoritative `Purchase` and `CompleteRegistration` tracking.
6. **Milestone 6:** Generate Content Bank, 30 TikTok Video Scripts, and 14-Day Organic Launch Plan.
7. **Milestone 7:** Execute end-to-end verification tests and compile `TIKTOK_ADS_READINESS.md`.
