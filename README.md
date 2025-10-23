# Cupid.exe

Cupid.exe is a playful, social party game built as a mobile app. It blends dares, punishments, randomized events and light matchmaking mechanics into short rounds designed for groups. The UI is lively and animated with floating hearts, mascots, and sound effects — perfect for in-person gatherings or remote parties.

## Quick overview

- Platform: React Native (Metro) / Expo-compatible project structure
- Goal: Get players to complete dares, pick matches, and survive rounds while earning points and experiencing random events.
- Core concepts: players, rounds, roulette (random selector), dares, punishments, and scoring.

## Gameplay

1. Add players and optional nicknames/avatars.
2. Start a pregame sequence to set the number of rounds and difficulty.
3. Each round: players are selected (manually or via roulette), presented with a prompt (dare or question), and must perform or accept a punishment.
4. The UI shows animated cues, round counters, and feedback. After each round the score updates and the next selection occurs.
5. At the end, a summary screen shows winners, results and highlights.

Key screens in the app (located in the `app/` folder):

- `index.tsx` — App entry / landing
- `pregame.tsx` — Configure match settings and players
- `roulette.tsx` — Random selector for choosing players or teams
- `round.tsx` — Round execution (prompts, accept/decline, scoring)
- `punishment.tsx` — Show and execute punishments
- `summary.tsx` — Final results and scoring summary
- `add-players/` — UI flow for adding players and personalization (crush/daring-level etc.)

## Data & content

Content lives in the `data/` and `core/` folders:

- `data/characters.ts` — character definitions and avatars
- `data/dares.json` — curated dare prompts
- `data/punishments.json` — possible punishments
- `data/randomEvents.json` — random events that affect play

Core logic and state management:

- `src/core/gameStore.ts` — central game state and actions
- `src/core/actions/` — action handlers for dares, roulette, players and game flow
- `src/core/utils/` — scoring, roulette helper functions, and prompts utilities
- `src/core/types.ts` — TypeScript types used across the app

## Notable UI components

- `src/components/AnimatedCupid.tsx` — animated mascot
- `src/components/FloatingHearts.tsx` — particle animation used on celebratory screens
- `src/components/CharacterCard.tsx` — player avatar and info
- `src/components/RoundCounter.tsx` — round progress indicator
- `src/components/FloatingInputBox.tsx` — input used when adding players

Other small helpers and hooks:

- `src/hooks/useClickSound.ts` — play click effects
- `src/assets/sounds/` — sound assets referenced by the UI

## Tech stack

- React Native (Metro bundler)
- TypeScript
- Tailwind / NativeWind for styling (project contains `tailwind.config.js` / `nativewind-env.d.ts`)
- Simple in-app state store under `src/core` (no external backend required)

## Local development (recommended: Expo)

This repository includes `app.json` and Metro configuration consistent with an Expo-managed or Expo-compatible React Native app. The steps below assume you have Node.js installed.

Install dependencies:

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

Or using Bun (faster JS runtime & package manager):

```bash
# If you use Bun as your package manager, run:
bun install
```

Start the Metro/Expo server:

```bash
# If you use Expo CLI (recommended for easiest device/simulator testing)
npx expo start

# Or, if you prefer the React Native CLI and the project is configured for it
# (run these only if you know the project uses native modules built with the RN CLI):
# iOS simulator
npx react-native run-ios
# Android emulator
npx react-native run-android
```

When the development server is running you can open the app on a device via QR code (Expo Go) or launch an iOS/Android simulator.

Notes:

- If you rely on Expo features, installing the Expo CLI globally may help: `npm install -g expo-cli`.
- If building for production or using native modules, follow platform-specific build steps (Xcode / Android Studio).

Bun-specific notes and example commands

- Bun can be used as the package manager and to run CLI binaries from node_modules via `bunx`.
- Bun is excellent for install speed and script execution, but some native toolchains (Xcode, Android SDK, node-gyp native modules) and some React Native native modules still expect Node.js. If you run into build or native-bridge issues, fall back to Node/npm or Yarn for the native build steps.

Example Bun workflow:

```bash
# install dependencies with Bun
bun install

# run the Expo dev server via bunx (runs the local binary from node_modules)
bunx expo start

# or, if using React Native CLI for simulators
bunx react-native run-ios
bunx react-native run-android
```

## Playtesting tips

- Start with a small group (3–6 people) and test the default dares/punishments to tune difficulty.
- Edit or add new prompts in `data/dares.json` or `data/punishments.json` to customize the experience for your group.
- Use `src/core/mockData.ts` for quick testing of full sessions without manual player entry.

## Extending the game

- Add new prompt categories or difficulty levels by updating the JSON data files and the prompt selection logic in `src/core/utils/prompts.ts`.
- Hook a backend for persistence or multiplayer: the local store in `src/core/gameStore.ts` can be extended to sync to an API.
- Add accessibility improvements: voice prompts, larger hit targets and haptic feedback are natural next steps.

## Project structure (high level)

- `app/` — route-driven screens and UI pages
- `src/` — core code, components, assets and helpers
- `data/` — game content JSON and character assets
- `components/` — small, reusable presentational components

## Contributing

Feel free to open issues or PRs. A few suggested contributions:

- New dares, punishments, or event content
- Bug fixes for round flow or scoring logic
- UI polish and accessibility improvements

## License

Specify a license in `LICENSE` or add one to the repo. If this project is private, no action needed.

---

If you want, I can:

- Add badges (build / license / platform) and a short demo GIF/screenshots.
- Generate a CONTRIBUTING.md or a short changelog.
- Create a small script to validate JSON content (dares/punishments) and run it as an npm script.

Files created/edited:

- `README.md` — This file (overview, how to run, structure, and play instructions).

Completion summary: I created a README describing the game's purpose, screens, data files, components, and local dev steps (Expo recommended). If you'd like screenshots, a demo GIF, or a tailored README for Play Store/App Store submission, tell me which and I’ll add them.
