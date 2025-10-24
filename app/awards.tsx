import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState, Player } from '../src/core/gameStore';
import { Button } from '../src/components/Button';

const HEAD_ASSETS = [
    require('../src/assets/mascots/head/victim-head-1.png'),
    require('../src/assets/mascots/head/victim-head-2.png'),
    require('../src/assets/mascots/head/victim-head-3.png'),
    require('../src/assets/mascots/head/victim-head-4.png'),
    require('../src/assets/mascots/head/victime-head-5.png'),
];

const CIRCLE_COLORS = ['#B794F6', '#FFA07A', '#FFD93D', '#98D8C8', '#87CEEB'];

function getAwards(players: Player[]) {
    const maxPunishments = Math.max(...players.map((p) => p.stats.punishments), 0);
    const maxSuccesses = Math.max(...players.map((p) => p.stats.successes), 0);
    const maxEvents = Math.max(...players.map((p) => p.stats.eventsTriggered), 0);
    const maxSkips = Math.max(...players.map((p) => p.stats.skips), 0);

    return {
        mostPunished: players.find((p) => p.stats.punishments === maxPunishments),
        fearlessHeart: players.find((p) => p.stats.successes === maxSuccesses),
        masterOfDrama: players.find((p) => p.stats.eventsTriggered === maxEvents),
        mostAfraid: players.find((p) => p.stats.skips === maxSkips),
    };
}

export default function AwardsScreen() {
    const router = useRouter();
    const players = useGameState((state) => state.players);
    const resetGame = useGameState((state) => state.resetGame);
    const awards = getAwards(players);

    const Award = ({
        title,
        player,
        description,
        icon,
    }: {
        title: string;
        player?: Player;
        description: string;
        icon: string;
    }) => {
        if (!player) return null;

        const playerIndex = players.findIndex((p) => p.id === player.id);
        const headAsset = HEAD_ASSETS[playerIndex % HEAD_ASSETS.length];
        const circleColor = CIRCLE_COLORS[playerIndex % CIRCLE_COLORS.length];

        return (
            <View className="mb-8">
                <View className="items-center mb-6">
                    <Text className="text-6xl mb-4">{icon}</Text>
                    <Text className="text-3xl font-bold text-[#622135] mb-6">
                        {title}
                    </Text>

                    <View
                        className="w-40 h-40 rounded-full items-center justify-center mb-4"
                        style={{ backgroundColor: circleColor }}
                    >
                        <Image
                            source={headAsset}
                            className="w-32 h-32"
                            resizeMode="contain"
                        />
                    </View>

                    <Text className="text-2xl text-white font-light italic">
                        {player.name}
                    </Text>
                </View>

                <Text className="text-center text-base text-[#622135] italic px-8 leading-6">
                    {description}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
            <LinearGradient
                colors={['#FFE2E2', '#FFC2DD', '#FFB3C1']}
                locations={[0, 0.5, 1]}
                style={{ flex: 1 }}
            >
                <ScrollView className="flex-1">
                    <View className="px-6 py-8">
                        <Award
                            title="Most Punished"
                            player={awards.mostPunished}
                            description="For the soul who suffered most in the name of love and poor decisions. Cupid salutes your pain."
                            icon="💘"
                        />

                        <Award
                            title="Fearless Heart"
                            player={awards.fearlessHeart}
                            description="The one who never backed down from a challenge. Your courage is admirable!"
                            icon="💖"
                        />

                        <Award
                            title="Master of Drama"
                            player={awards.masterOfDrama}
                            description="Chaos follows you everywhere. You kept everyone on their toes!"
                            icon="🎭"
                        />

                        <Award
                            title="Most Afraid of Love"
                            player={awards.mostAfraid}
                            description="You skipped so many chances! Maybe next time you'll take the leap."
                            icon="😳"
                        />
                    </View>
                </ScrollView>

                <View className="px-6 pb-6">
                    <Button
                        onPress={() => {
                            resetGame();
                            router.push('/');
                        }}
                        className="rounded-2xl py-4 px-6 border-2 border-[#622135]"
                        style={{ backgroundColor: '#E3F2FD' }}
                    >
                        <Text className="text-center text-xl italic text-[#622135] font-light">
                            Main Menu
                        </Text>
                    </Button>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}