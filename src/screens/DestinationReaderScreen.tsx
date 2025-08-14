import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useWalletStore } from '../store/useWalletStore';
import { onNfcTap, clearNfcTap } from '../utils/nfc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DestinationReader'>;

export default function DestinationReaderScreen({ navigation }: Props) {
    const { setSelectedDestinationCard, usersByCardId, loadUserFromRemote } = useWalletStore();

    useEffect(() => {
        onNfcTap(async (cardId) => {
            if (!usersByCardId[cardId]) {
                const remote = await loadUserFromRemote(cardId);
                if (!remote) {
                    Alert.alert('Card not registered', 'Destination card is not registered yet.');
                    return;
                }
            }
            setSelectedDestinationCard(cardId);
            navigation.replace('TransferDetail', { destinationCardId: cardId });
        });
        return () => clearNfcTap();
    }, [navigation, setSelectedDestinationCard, usersByCardId, loadUserFromRemote]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please Tap Destination ID Card Here</Text>
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


