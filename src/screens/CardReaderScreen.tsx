import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useWalletStore } from '../store/useWalletStore';
import { onNfcTap, clearNfcTap } from '../utils/nfc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CardReader'>;

export default function CardReaderScreen({ navigation }: Props) {
    const { getUserByCardId, setSelectedSourceCard, refreshUserFromRemote } = useWalletStore();

    useEffect(() => {
        let isActive = true;
        onNfcTap(async (cardId) => {
            if (!isActive) return;
            setSelectedSourceCard(cardId);
            let existing = await refreshUserFromRemote(cardId);
            if (existing) {
                navigation.replace('Profile', { cardId });
            } else {
                Alert.alert('Card not registered', 'This card is not registered yet.');
            }
        });
        return () => {
            isActive = false;
            clearNfcTap();
        };
    }, [getUserByCardId, navigation, setSelectedSourceCard, refreshUserFromRemote]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Please Tap Your ID Card Here</Text>
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


