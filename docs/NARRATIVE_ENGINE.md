# PLOT Narrative State & Decision Engine Architecture

## 1. Core Principles
1. **Story-Scoped State**: Progress, relationships, stats, and choices are strictly partitioned by `(userId, storyId)` and `UserStoryTimeline`.
2. **Choice Idempotency**: Choices are recorded with unique node keys and duplicate selections return stored results without double-charging or mutating state twice.
3. **Multi-Turn Branching**:
   - Free Strategic Choice -> 2-Turn Dialogue & Narration Resolution (+Trust / +Reputation)
   - 💎 Premium Intimacy Choice (10 Diamonds) -> 2-Turn Intimate Dialogue & Romantic Spark (+Love Bond)
   - Merged Climax -> Antagonist Intrusion -> Defiance -> Cliffhanger Hook

## 2. Decision Memory & Dynamic Recap
- Choices are stored in `UserChoice` and `UserStoryTimeline.choicesJson`.
- `getUserStoryJourney` dynamically generates:
  - "Previously on PLOT" recaps based on the player's last 3 choices.
  - PLOT DNA profile (Romantic vs Strategic vs Loyal).
  - Reachable and unlocked ending collections.

## 3. Timeline Architecture
- **Slot 0**: Free Primary Timeline
- **Slot 1–2**: PLOT+ Premium Alternate Timelines (replay from key decision branches without overwriting the primary ending).
