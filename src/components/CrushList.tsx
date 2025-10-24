import React, { forwardRef, useImperativeHandle, useRef, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGameState } from '../core/gameStore';

type CrushListHandle = {
    show: () => void;
    hide: () => void;
};

interface Props {
    items?: string[];
    onSelect: (item: string) => void;
    title?: string;
}

const CrushList = forwardRef<CrushListHandle, Props>(({ items, onSelect, title = 'Select a Crush' }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const players = useGameState((s) => s.players);

    useImperativeHandle(ref, () => ({
        show: () => bottomSheetRef.current?.expand?.(),
        hide: () => bottomSheetRef.current?.close?.(),
    }));

    const data = items && items.length > 0 ? items : players.map((p) => p.name).filter(Boolean);

    const snapPoints = useMemo(() => {
        const itemCount = data.length;
        if (itemCount === 0) return ['25%'];
        if (itemCount <= 2) return ['30%'];
        if (itemCount <= 4) return ['45%'];
        if (itemCount <= 6) return ['60%'];
        return ['75%'];
    }, [data.length]);

    const renderItem = useCallback(
        ({ item, index }: { item: string; index: number }) => (
            <TouchableOpacity
                onPress={() => {
                    onSelect(item);
                    bottomSheetRef.current?.close?.();
                }}
                className="mx-4 mb-2 p-4 bg-white rounded-xl border border-[#622135]/10 active:bg-[#622135]/5 shadow-sm"
                style={{
                    shadowColor: '#622135',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                }}
            >
                <Text className="text-xl font-semibold text-[#622135]">{item}</Text>
            </TouchableOpacity>
        ),
        [onSelect]
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: '#FFF5F7' }}
            handleIndicatorStyle={{ backgroundColor: '#622135', width: 40 }}
        >
            <View className="flex-1 px-2 pt-2 pb-4">
                <View className="px-4 pb-3 border-b border-[#622135]/10">
                    <Text className="text-2xl font-bold text-[#622135]">{title}</Text>
                    <Text className="text-sm text-[#622135]/60 mt-1">
                        {data.length} {data.length === 1 ? 'option' : 'options'} available
                    </Text>
                </View>

                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(item, idx) => `${item}-${idx}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-12">
                            <Text className="text-base text-[#622135]/40 font-medium">
                                No crushes available
                            </Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </BottomSheet>
    );
});

export default CrushList;