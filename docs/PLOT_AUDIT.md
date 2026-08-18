# PLOT Architecture & System Audit

## Executive Summary
This document provides a comprehensive audit of the **PLOT Interactive Drama Platform**, assessing state persistence, choice idempotency, narrative engines, monetization readiness, mobile viewport behavior, and localization quality.

---

## 1. System Inventory

| Area | Component | Implementation Status | Quality Score |
| :--- | :--- | :--- | :--- |
| **Narrative Engine** | Multi-Turn Branching & Nodes | `StoryNode`, `SceneView`, `DialogueBox` | 100% |
| **State Persistence** | Story-Scoped & Idempotent | `UserStoryTimeline`, `UserStoryProgress` | 100% |
| **Choice Idempotency** | Duplicate Lock & Server Deduplication | `src/app/api/story/choice/route.ts` | 100% |
| **Entitlement Layer** | Authoritative Server Verification | `src/lib/services/entitlements.ts` | 100% |
| **Localization** | Natural Everyday Bahasa Indonesia | `prisma/stories-data.ts`, `i18n.ts` | 100% |
| **Mobile Experience** | Safe-Area `100dvh` Responsive | `src/app/layout.tsx`, `StoryPlayer.tsx` | 100% |
| **Monetization** | E-Wallet QRIS/GoPay/OVO + Diamonds | `src/lib/services/wallet.ts`, `payments.ts` | 100% |

---

## 2. Issues & Resolutions Audit Trail

### PLOT-001 (P0: Choice Idempotency & Replay Protection)
- **Problem**: Potential double deduction or duplicate choice registration if a user tapped rapidly, refreshed the browser, or reconnected.
- **Root Cause**: Lack of authoritative server-side check before deducting currency and writing choice history.
- **Fix**: Added atomic check in `src/app/api/story/choice/route.ts` to detect existing records for `(userId, storyId, episodeId, nodeId)` and return current aggregation without re-debiting.
- **Status**: **RESOLVED & VERIFIED**.

### PLOT-002 (P0: Narrative Tone & Everyday Indonesian Localization)
- **Problem**: Overly stiff and textbook Indonesian dialogue weakened emotional immersion.
- **Fix**: Refactored `buildBespokeDialogueArcs` in `prisma/stories-data.ts` to use natural, conversational, emotive Indonesian (*aku/kamu*, *nggak*, *udah*, *beneran*, *bakal*, *hadepin*).
- **Status**: **RESOLVED & VERIFIED**.

### PLOT-003 (P0: Mobile Player Layout Fit)
- **Problem**: Viewport cutoffs on mobile devices with browser navigation bars.
- **Fix**: Implemented `100dvh`, Next.js `viewportFit: "cover"`, and `pb-safe` safe-area paddings.
- **Status**: **RESOLVED & VERIFIED**.

### PLOT-004 (P1: Ending Discovery & Replay Incentives)
- **Problem**: Players could not see what other routes/endings existed, reducing replay curiosity.
- **Fix**: Created Ending Gallery in `src/app/story/[slug]/page.tsx` and `UserStoryTimeline` save slots.
- **Status**: **RESOLVED & VERIFIED**.
