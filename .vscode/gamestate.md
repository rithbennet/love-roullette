You are generating the logic and basic text-based screens for a local hotseat game called **Cupid.exe**.

Context:
Cupid.exe is built with Expo Router (React Native), Bun, Zustand (for state), and TypeScript.
The UI will be simple text placeholders so we can test the game’s logic before adding design and animations.

Goal:
Create a working game skeleton with Expo Router pages that simulate the Cupid.exe game loop:
setup → preGame → dareRound → proofPhase → punishment → randomEvent → summary.

Requirements:

1. Use TypeScript.
2. Use Zustand to manage the state machine.
3. Each phase should correspond to a simple text screen under `app/` routes:
   - `/index` → setup
   - `/pregame`
   - `/round`
   - `/proof`
   - `/punishment`
   - `/event`
   - `/summary`
4. Each screen should:
   - Display current phase name.
   - Have a “Next” or “Continue” button to call the nextPhase() function from the Zustand store.
5. The store should:
   - Track phase, currentRound, totalRounds, players[], activePlayer, latestDare, etc.
   - Include helper actions: `addPlayer`, `nextPhase`, `resetGame`.
   - Implement the phase transitions defined below.

Game state transitions:
setup → preGame  
preGame → dareRound  
dareRound → proofPhase (if accepted)  
dareRound → punishment (if skipped)  
proofPhase/punishment → randomEvent (25% chance)  
randomEvent → dareRound (until rounds completed)  
after last round → summary  
summary → setup (reset game)

6. Simplify player input for now:
   - Hardcode 2–3 sample players in setup.
   - Pick a random active player in each round.
7. Keep all UI text-based (use <Text>, <Button>, <SafeAreaView>), focused on readability and logic validation.
8. Each screen should import `useGameState` store, display key state info (phase, round, activePlayer).
9. Each “Next” press updates the state and routes to the next corresponding page automatically based on the phase.
10. Follow Expo Router conventions and use `useRouter()` for navigation.

Output expected:

- `src/core/useGameState.ts` (Zustand store)
- Example route files under `app/` directory (one per phase)
- Example of how navigation changes per phase when “Next” button pressed.

After generating, also include short instructions on how to preview the flow (“bun run dev” or “npx expo start”) and check the logs or console showing transitions.

Keep code Expo-managed and Expo-Router compatible. No extra UI dependencies.
