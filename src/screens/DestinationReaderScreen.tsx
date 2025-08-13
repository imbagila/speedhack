import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RotatingCircle } from '../components/RotatingCircle';
import { useWalletStore } from '../store/useWalletStore';
import { onNfcTap, clearNfcTap, simulateTap } from '../utils/nfc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DestinationReader'>;

export default function DestinationReaderScreen({ navigation }: Props) {
    const { setSelectedDestinationCard, usersByCardId } = useWalletStore();

    useEffect(() => {
        onNfcTap((cardId) => {
            if (!usersByCardId[cardId]) return;
            setSelectedDestinationCard(cardId);
            navigation.replace('TransferDetail', { destinationCardId: cardId });
        });
        return () => clearNfcTap();
    }, [navigation, setSelectedDestinationCard, usersByCardId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please Tap Destination ID Card Here</Text>
            <RotatingCircle />
            <View style={styles.devRow}>
                <Pressable style={styles.button} onPress={() => simulateTap('CARD_2')}>
                    <Text style={styles.buttonText}>Simulate CARD_2</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
    title: { fontSize: 18, textAlign: 'center' },
    devRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
    button: { backgroundColor: '#4B7BE5', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
    buttonText: { color: 'white', fontWeight: '600' },
});


