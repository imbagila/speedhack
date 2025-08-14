import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RotatingCircle } from '../components/RotatingCircle';
import { useWalletStore } from '../store/useWalletStore';
import { onNfcTap, clearNfcTap } from '../utils/nfc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminCardReader'>;

export default function AdminCardReaderScreen({ navigation }: Props) {
    const { setSelectedDestinationCard, usersByCardId, pendingTopupAmount, topup, setPendingTopupAmount, loadUserFromRemote } = useWalletStore();

    useEffect(() => {
        onNfcTap(async (cardId) => {
            if (!usersByCardId[cardId]) {
                const remote = await loadUserFromRemote(cardId);
                if (!remote) return;
            }
            setSelectedDestinationCard(cardId);
            if (pendingTopupAmount && pendingTopupAmount > 0) {
                await topup(cardId, pendingTopupAmount);
                setPendingTopupAmount(null);
                navigation.replace('AdminTopupSuccess');
            }
        });
        return () => clearNfcTap();
    }, [navigation, pendingTopupAmount, setPendingTopupAmount, setSelectedDestinationCard, topup, usersByCardId, loadUserFromRemote]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please Tap ID Card To Be Topup Here</Text>
            <RotatingCircle />
            <Text style={styles.hint}>Hold a card near the device</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
    title: { fontSize: 18, textAlign: 'center' },
    hint: { color: '#666' },
});


