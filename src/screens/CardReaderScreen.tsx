import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RotatingCircle } from '../components/RotatingCircle';
import { useWalletStore } from '../store/useWalletStore';
import { onNfcTap, clearNfcTap, simulateTap } from '../utils/nfc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CardReader'>;

export default function CardReaderScreen({ navigation }: Props) {
    const { getUserByCardId, setSelectedSourceCard, seedDemoData } = useWalletStore();

    useEffect(() => {
        seedDemoData();
        onNfcTap((cardId) => {
            setSelectedSourceCard(cardId);
            const existing = getUserByCardId(cardId);
            if (existing) {
                navigation.replace('Profile', { cardId });
            } else {
                navigation.replace('Register', { cardId });
            }
        });
        return () => clearNfcTap();
    }, [getUserByCardId, navigation, seedDemoData, setSelectedSourceCard]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please Tap Your ID Card Here</Text>
            <RotatingCircle />
            <View style={styles.devRow}>
                <Pressable style={styles.button} onPress={() => simulateTap('CARD_1')}>
                    <Text style={styles.buttonText}>Simulate New Card</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => simulateTap('CARD_2')}>
                    <Text style={styles.buttonText}>Simulate Existing CARD_2</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 },
    title: { fontSize: 18, textAlign: 'center' },
    devRow: { flexDirection: 'row', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' },
    button: { backgroundColor: '#4B7BE5', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
    buttonText: { color: 'white', fontWeight: '600' },
});


