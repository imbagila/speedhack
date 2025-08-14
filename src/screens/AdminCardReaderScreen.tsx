import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useWalletStore } from '../store/useWalletStore';
import { onNfcTap, clearNfcTap } from '../utils/nfc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminCardReader'>;

export default function AdminCardReaderScreen({ navigation }: Props) {
    const { setSelectedDestinationCard, usersByCardId, pendingTopupAmount, topup, setPendingTopupAmount, loadUserFromRemote } = useWalletStore();
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        onNfcTap(async (cardId) => {
            if (hasProcessedRef.current) return;
            if (!usersByCardId[cardId]) {
                const remote = await loadUserFromRemote(cardId);
                if (!remote) {
                    Alert.alert('Card not registered', 'This card is not registered yet.');
                    return;
                }
            }
            setSelectedDestinationCard(cardId);
            if (pendingTopupAmount && pendingTopupAmount > 0) {
                hasProcessedRef.current = true;
                const amount = pendingTopupAmount;
                setPendingTopupAmount(null);
                await topup(cardId, amount);
                clearNfcTap();
                navigation.replace('AdminTopupSuccess');
            }
        });
        return () => clearNfcTap();
    }, [navigation, pendingTopupAmount, setPendingTopupAmount, setSelectedDestinationCard, topup, usersByCardId, loadUserFromRemote]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please Tap ID Card To Be Topup Here</Text>
            <ActivityIndicator size="large" />
            <Text style={styles.hint}>Hold a card near the device</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
    title: { fontSize: 18, textAlign: 'center' },
    hint: { color: '#666' },
});


