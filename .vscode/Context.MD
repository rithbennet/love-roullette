Perfect 💘 — since your **Cupid.exe** project and `gamestore` are already set up, the next big milestone is evolving the game from using **constant mock players/settings** into a **fully interactive setup** where users input names and configure rounds before starting the game.

Here’s a focused `plan.md` task list for that transition 👇

---

# 🏹 Cupid.exe — Plan: Interactive Setup & Player Input

### 🎯 Goal

Convert the prototype from hardcoded constants into a dynamic, user‑driven setup:

- Players can **add/remove themselves** in the _Add Players_ screen.
- Users can **configure total rounds (1–15)** on the _Settings_ screen.
- “Start Game” becomes enabled only when **3–5 players** are present.
- All values are live‑synced with the existing `useGameStore`.

---

## 🧠 Context

✅ `useGameStore` already exists — it includes actions:  
`addPlayer`, `removePlayer`, `setTotalRounds`, `startGame`, etc.  
Now we’ll connect those to proper **text input fields, buttons**, and navigation.

---

## 📋 To‑Do Tasks

### 1. **Settings Screen UI (app/index.tsx)**

- [ ] Replace static content with live data from `useGameStore`.
- [ ] Display current round config:
  - [ ] Show `Round Count: {totalRounds}`.
  - [ ] Create `[–]` and `[+]` `Pressable` buttons → call `setTotalRounds()`.
  - [ ] Clamp rounds between 1–15 when pressing buttons.
- [ ] Show player count: `Players: {players.length} / 5`.
- [ ] Add navigation buttons:
  - [ ] “Add Players” → navigate to `/add-players`.
  - [ ] “Start Game” → triggers `startGame()` → navigate to `/pregame`.
- [ ] Disable “Start Game” until there are **3–5 players**.

---

### 2. **Add Players Screen (app/add-players.tsx)**

- [ ] Access state + actions: `players`, `addPlayer`, `removePlayer`.
- [ ] Build basic text entry:
  - [ ] `TextInput` for **Player Name (required)**.
  - [ ] Optional `TextInput` for **Crush Name**.
  - [ ] Buttons or pressable chips for **Daring Level (1–3)**, default `1`.
- [ ] “Add Player” button:
  - [ ] Create ID (from store or auto via `nanoid` inside action).
  - [ ] Call `addPlayer(name, crush, daringLevel)`.
  - [ ] Clear inputs after adding.
  - [ ] Disable if there are already 5 players.
- [ ] Show a live list of all player entries:
  - [ ] Display: `name` + “(❤️ crush)” + daring level emoji (🔥 1‑3).
  - [ ] Add a small “Remove” button → `removePlayer(id)`.
- [ ] Navigation:
  - [ ] “Back to Settings” → `/`.
  - [ ] Optional “Ready” → `/` as shortcut.

---

### 3. **Synchronize Settings with State**

- [ ] Verify `setTotalRounds()` updates immediately in the store.
- [ ] Confirm player array persists when navigating between screens.
- [ ] Ensure `startGame()` only works if:
  ```ts
  players.length >= 3 && players.length <= 5;
  ```
- [ ] Use guards in `startGame()` to enforce the limit before switching to `"pregame"`.

---

### 4. **Pre‑Game Transitions (app/pregame.tsx)**

- [ ] Show intro text:  
      `"Cupid is locking targets... 💘"`
- [ ] Add button:
  - [ ] “Begin Round” → calls `beginRound()` and navigates to `/round`.
- [ ] Optional: display player names (for flavor).

---

### 5. **Verification Checklist**

| Requirement        | Expected Behavior                         |
| ------------------ | ----------------------------------------- |
| Round counter      | Adjusts live between 1–15 with buttons    |
| Player adding      | Adds to state, visible instantly          |
| Player removing    | Updates count dynamically                 |
| Player constraints | Enforce 3 min / 5 max                     |
| Start button       | Enabled only 3–5 players                  |
| Game start         | Moves phase → “pregame”, route `/pregame` |

---

### 6. **Edge Case Testing**

- [ ] Try adding fewer than 3 players → “Start Game” stays disabled.
- [ ] Try adding >5 players → “Add Player” disabled / shows alert.
- [ ] Validate round decrement under 1 → clamped to 1.
- [ ] Validate increment over 15 → clamped to 15.
- [ ] Confirm navigating back to Settings retains existing players and round count.

---

### 7. **Stretch Goals (nice to have)**

- [ ] Add light emoji feedback (💘 when player added, 💀 when removed).
- [ ] Persist `players` and `rounds` to AsyncStorage so reopening app continues setup.
- [ ] Add simple validation messages (e.g. empty name alerts).

---

## 🧩 Deliverables

- [ ] Updated **`app/index.tsx`**  
      (interactive rounds + navigation)
- [ ] Updated **`app/add-players.tsx`**  
      (real player input, remove control)
- [ ] Verified **`startGame()`** works with real data.
- [ ] Game can now start dynamically from user-defined players and settings.

---

✅ **Outcome:**  
Cupid.exe moves from a hardcoded mock setup → a real, configurable hotseat experience, with functional player input and round management ready for the pre‑game and full gameplay loop.

---

Would you like me to generate the starter UI code for `app/add-players.tsx` and `app/index.tsx` (text-only, Expo Router‑safe, hooked to your `useGameStore`)?
