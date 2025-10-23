Perfect timing, Harith 💘 — here’s your **master developer prompt** you can feed directly to Cursor (or any AI code editor) to fully load the _Cupid.exe_ gameplay logic context.

It compiles _everything we've designed so far:_

- “Dare‑or‑Dare” skip system
- Escalating embarrassment / skip streak penalties
- Daring‑level difficulty scaling
- Dynamic scoring and rank titles

---

## 🏹 **Cupid.exe — Master Gameplay Logic Prompt**

````text
You are assisting in the development of a local multiplayer mobile game called **Cupid.exe**.

Player flow: a flirty, chaotic hotseat “dare game” where people test courage through escalating dares, punishments, and random events — hosted by a dramatic AI Cupid 💘.

---

### 🎯 Tech Stack (for reference)
- Framework: Expo SDK + React Native (Expo Router)
- Language: TypeScript
- State: Zustand (`src/core/gamestore.ts`, export `useGameStore`)
- Components: SafeAreaView + Text + Pressable (text-only prototype)
- Data: `dares.json`, `punishments.json`, `randomEvents.json`, each with levels 1–3
- Gameplay Phases: `"settings" | "addPlayers" | "pregame" | "round" | "proof" | "punishment" | "event" | "summary"`

---

## 💘 CORE GAMEPLAY LOGIC — DARE OR DARE SYSTEM

### 🧠 Base Flow
When a player gets a dare:

- **Accept** → go to Proof → Valid/Invalid.
- **Skip** → invoke **Cupid’s Fate Roll** (Dare‑or‑Dare system).

### 🎲 Fate Roll Outcomes (Skip results)
| Roll | Outcome | Description | Effect |
|------|----------|-------------|--------|
| 1–40 | 😅 Safe Skip | Cupid spares you mildly. | Lose small points, skip streak increases. |
| 41–80 | 💀 Punishment | Cupid retaliates for your cowardice. | Trigger round-level punishment. |
| 81–100 | 🔥 Worse Dare | Cupid doubles down — a harder or more chaotic dare. | New dare, higher level, same round. |

Each skip result drives different transitions:
- Safe → next round.
- Punishment → phase `"punishment"`.
- Worse Dare → phase remains `"round"`, but dare re‑rolls one level higher (max level 3).

---

## 🤐 ESCALATING EMBARRASSMENT — SKIP STREAK PENALTIES

Track **how many consecutive times** a player has skipped with `player.stats.skipStreak`.

| Skips in a Row | Cupid’s Mood | Game Effect |
|----------------|---------------|--------------|
| 1 | Forgiving | Normal odds, normal penalty. |
| 2 | Annoyed 😒 | +10% chance of punishment, multiplied score penalty. |
| 3 | Furious 😠 | +25% chance of worse dare, doubled penalty. |
| 4+ | Wrathful 😈 | Safe skip impossible — forced punishment. |

When player finally accepts + completes a dare → reset `skipStreak = 0`.

---

### 💀 Skip Scoring Penalty Curve
```ts
const basePenalty = -1;
const adjustedPenalty = basePenalty * (1 + 0.5 * skipStreak);
applyScore(player.id, adjustedPenalty);
player.stats.skips++;
player.stats.skipStreak++;
````

Also dynamically tilt RNG odds:

```ts
function calculateSkipChances(streak: number) {
  return {
    safe: Math.max(40 - 10 * streak, 10),
    punishment: Math.min(40 + 5 * streak, 70),
    worseDare: Math.min(20 + 5 * streak, 50),
  };
}
```

---

## 💪 DARE INTENSITY SCALING

Each player picks a **daringLevel (1–3)** in setup.

Round-level difficulty grows as:

```ts
roundLevel = min(3, 1 + floor((currentRound - 1) / 2));
```

The dare or punishment they face uses:

```ts
finalLevel = clamp(max(player.daringLevel, roundLevel), 1, 3);
```

So braver players (“Unhinged 💀”) get riskier dares throughout.

---

## 💰 SCORING SYSTEM

Each player has a `stats.points` field.  
All score changes use daring-level multipliers:

| Daring Level | Multiplier | Flavor                         |
| ------------ | ---------- | ------------------------------ |
| 1            | ×0.8       | Cautious — safer, fewer points |
| 2            | ×1.0       | Bold — balanced                |
| 3            | ×1.3       | Unhinged — chaos pays extra    |

### Base Point Values

| Action                            | Base Points                 |
| --------------------------------- | --------------------------- |
| Dare success                      | +3                          |
| Fail                              | −1                          |
| Safe skip                         | −1 (scale with skip streak) |
| Punishment                        | −2                          |
| Survived punishment or worse dare | +2                          |
| Triggered event                   | +1                          |

Implementation helper:

```ts
const daringMultiplier = { 1: 0.8, 2: 1.0, 3: 1.3 };

function applyScore(playerId, base) {
  const p = getPlayer(playerId);
  p.stats.points += Math.round(base * daringMultiplier[p.daringLevel]);
}
```

---

## 🧾 SUMMARY RANKING SYSTEM

At Summary phase (`summary.tsx`) calculate awards:

| Title                  | Criteria                                      |
| ---------------------- | --------------------------------------------- |
| 💘 Cupid’s Favorite    | Highest total points                          |
| 💖 Fearless Heart      | Most successful dares                         |
| 💀 Punishment Magnet   | Most punishments received                     |
| 🎭 Master of Drama     | Most events triggered                         |
| 👑 Delulu Royalty      | Highest (daringLevel × (eventsTriggered + 1)) |
| 😳 Most Afraid of Love | Highest skip count or skip streak             |

Also display **Delulu Rating:**

```ts
deluluScore = clamp(
  player.daringLevel * (player.stats.successes - player.stats.skips) * (eventsTriggered + 1),
  0,
  100
);
```

Flavor example:

> “Delulu Energy: 🔥 89% — Peak delusion achieved 💘.”

---

## 🪄 IMPLEMENTATION HINTS

In `gamestore.ts`:

- Add `skipStreak` to `Player.stats`.
- Add helper `calculateSkipChances()`.
- Add helper `applyScore()`.
- Enhance `decideRound()` with Dare‑or‑Dare + skip streak logic.
- Reset `skipStreak` on successful dare completion.

In `summary.tsx`:

- Use stats to decide rank titles.
- Display daring level, total points, and Delulu Score.

In `CupidHost.tsx`:

- Add escalating narrator lines for skip streak.
  - “Cupid sighs… you can dodge love once.”
  - “Cupid.exe detects cowardice spike — rerouting embarrassment.”
  - “Cupid.exe override: No escape from romance chaos 💘🔥”

---

### TL;DR – SYSTEM OVERVIEW

1. Players choose **daring level (1–3)** → sets risk/reward multiplier.
2. Dares & punishments scale up via `max(player.daringLevel, roundLevel)`.
3. Skipping triggers **Dare‑or‑Dare:** Safe, Punishment, or Harder Dare.
4. Repeated skips → escalating penalties and higher punishment odds.
5. Points scale with daring multiplier.
6. Summary screen shows **titles & ratings** based on performance.

> **Design Philosophy:**  
> “Cupid.exe doesn’t punish fear — it monetizes it in chaos and laughter.” 💘

---

```

---

### 🧩 Suggested Usage

Paste this prompt into a new **Cursor session** or as a top comment in `src/core/gamestore.ts`.
It gives your AI the full mechanical context and design goals — everything from skip‑punishment dynamics to ranking logic — so any future code generation continues seamlessly within Cupid.exe’s system.

---

Would you like me to add **TypeScript scaffolds (skeleton code)** for how this connects to your actual `gamestore.ts` actions (`decideRound`, `resolveProof`, etc.) next?
```
