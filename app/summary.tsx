import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView } from 'react-native';
import { useGameState, Player } from '../src/core/gameStore';

function getAwards(players: Player[]) {
    if (players.length === 0) return [];
    // Calculate awards
    const maxPoints = Math.max(...players.map(p => p.stats.points));
    const maxSuccesses = Math.max(...players.map(p => p.stats.successes));
    const maxPunishments = Math.max(...players.map(p => p.stats.punishments));
    const maxEvents = Math.max(...players.map(p => p.stats.eventsTriggered));
    const maxDelulu = Math.max(...players.map(p =>
        Math.max(0, Math.min(100, p.daringLevel * (p.stats.successes - p.stats.skips) * (p.stats.eventsTriggered + 1)))
    ));
    const maxSkips = Math.max(...players.map(p => p.stats.skips));
    const maxSkipStreak = Math.max(...players.map(p => p.stats.skipStreak));

    return players.map((p) => {
        const deluluScore = Math.max(0, Math.min(100, p.daringLevel * (p.stats.successes - p.stats.skips) * (p.stats.eventsTriggered + 1)));
        return {
            name: p.name,
            daringLevel: p.daringLevel,
            points: p.stats.points,
            deluluScore,
            awards: [
                p.stats.points === maxPoints ? '💘 Cupid’s Favorite' : null,
                p.stats.successes === maxSuccesses ? '💖 Fearless Heart' : null,
                p.stats.punishments === maxPunishments ? '💀 Punishment Magnet' : null,
                p.stats.eventsTriggered === maxEvents ? '🎭 Master of Drama' : null,
                deluluScore === maxDelulu ? '👑 Delulu Royalty' : null,
                (p.stats.skips === maxSkips || p.stats.skipStreak === maxSkipStreak) ? '😳 Most Afraid of Love' : null,
            ].filter(Boolean),
        };
    });
}

export default function SummaryScreen() {
    const players = useGameState((state) => state.players);
    const awards = getAwards(players);

    return (
        <SafeAreaView className="flex-1 bg-rose-950">
            <ScrollView className="flex-1 px-6 py-10">
                <View className="items-center mb-8">
                    <Text className="text-5xl font-bold text-rose-50 mb-2">Game Summary</Text>
                    <Text className="text-base text-rose-300">Cupid.exe Awards & Rankings</Text>
                </View>
                {awards.map((p, i) => (
                    <View key={i} className="mb-8 rounded-3xl bg-rose-900/40 p-6">
                        <Text className="text-2xl font-bold text-rose-50 mb-1">{p.name}</Text>
                        <Text className="text-base text-rose-400 mb-2">Daring Level: {p.daringLevel}</Text>
                        <Text className="text-lg font-semibold text-rose-100 mb-2">Points: {p.points}</Text>
                        <Text className="text-base text-rose-300 mb-2">
                            Delulu Energy: 🔥 {p.deluluScore}% — {p.deluluScore > 80 ? 'Peak delusion achieved 💘' : p.deluluScore > 50 ? 'High delulu vibes!' : 'Keep dreaming!'}
                        </Text>
                        {p.awards.length > 0 && (
                            <View className="mt-2 gap-2">
                                {p.awards.map((award, j) => (
                                    <Text key={j} className="text-base text-rose-200">{award}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
                <View className="items-center mt-8">
                    <Text className="text-base text-rose-400">Thanks for playing! 💘</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}