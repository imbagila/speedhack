import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RotatingCircle } from '../components/RotatingCircle';
import { useWalletStore } from '../store/useWalletStore';
import { onNfcTap, clearNfcTap } from '../utils/nfc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CardReader'>;

export default function CardReaderScreen({ navigation }: Props) {
    const { getUserByCardId, setSelectedSourceCard, seedDemoData } = useWalletStore();

    useEffect(() => {
        let isActive = true;
        seedDemoData();
        onNfcTap((cardId) => {
            if (!isActive) return;
            setSelectedSourceCard(cardId);
            const existing = getUserByCardId(cardId);
            if (existing) {
                navigation.replace('Profile', { cardId });
            } else {
                navigation.replace('Register', { cardId });
            }
        });
        return () => {
            isActive = false;
            clearNfcTap();
        };
    }, [getUserByCardId, navigation, seedDemoData, setSelectedSourceCard]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please Tap Your ID Card Here</Text>
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


