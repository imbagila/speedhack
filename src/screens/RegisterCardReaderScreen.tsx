import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { onNfcTap, clearNfcTap } from '../utils/nfc';
import { useWalletStore } from '../store/useWalletStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterCardReader'>;

export default function RegisterCardReaderScreen({ navigation }: Props) {
    const { refreshUserFromRemote, usersByCardId } = useWalletStore();

    useEffect(() => {
        onNfcTap(async (cardId) => {
            let existing = usersByCardId[cardId];
            existing = await refreshUserFromRemote(cardId);
            if (existing) {
                navigation.replace('RegisterAlreadyRegistered', { cardId });
            } else {
                navigation.replace('Register', { cardId });
            }
        });
        return () => clearNfcTap();
    }, [refreshUserFromRemote, navigation, usersByCardId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scan a card to register</Text>
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


