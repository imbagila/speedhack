import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useWalletStore } from '../store/useWalletStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminTopup'>;

export default function AdminTopupScreen({ navigation }: Props) {
    const [amount, setAmount] = useState('');
    const selectedCardId = useWalletStore((s) => s.selectedDestinationCardId);
    const topup = useWalletStore((s) => s.topup);

    const isValid = useMemo(() => Number(amount) > 0 && !!selectedCardId, [amount, selectedCardId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Force Topup</Text>
            <TextInput style={styles.input} placeholder="Topup amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <Pressable
                disabled={!isValid}
                style={[styles.button, !isValid && styles.buttonDisabled]}
                onPress={() => {
                    if (!selectedCardId) return;
                    topup(selectedCardId, Number(amount));
                    navigation.replace('AdminTopupSuccess');
                }}
            >
                <Text style={styles.buttonText}>Force Topup</Text>
            </Pressable>
            {!selectedCardId && <Text style={styles.hint}>Tap a card first in Admin Card Reader</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 12, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minWidth: 240 },
    button: { backgroundColor: '#0E9F6E', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12, minWidth: 240 },
    buttonDisabled: { backgroundColor: '#a7dacb' },
    buttonText: { color: 'white', fontWeight: '700' },
    hint: { color: '#666', marginTop: 8 },
});


