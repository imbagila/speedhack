import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useWalletStore } from '../store/useWalletStore';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferDetail'>;

export default function TransferDetailScreen({ route, navigation }: Props) {
    const { destinationCardId } = route.params;
    const destination = useWalletStore((s) => s.usersByCardId[destinationCardId]);
    const sourceCardId = useWalletStore((s) => s.selectedSourceCardId);
    const transfer = useWalletStore((s) => s.transfer);

    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');

    const isValid = useMemo(() => {
        const amt = Number(amount);
        return destination && sourceCardId && amt > 0 && pin.length >= 4;
    }, [amount, destination, pin, sourceCardId]);

    if (!destination) {
        return (
            <View style={styles.container}><Text>Destination not found</Text></View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{destination.fullName}</Text>
            <Text>Email: {destination.email}</Text>
            <Text>Gender: {destination.gender}</Text>
            <Text>Phone: {destination.phoneNumber}</Text>

            <TextInput style={styles.input} placeholder="Amount to be Transfered" placeholderTextColor="#999" keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <TextInput style={styles.input} placeholder="PIN Transaction" placeholderTextColor="#999" secureTextEntry keyboardType="number-pad" value={pin} onChangeText={setPin} />

            <Pressable
                disabled={!isValid}
                style={[styles.button, !isValid && styles.buttonDisabled]}
                onPress={() => {
                    if (!sourceCardId) return;
                    const ok = transfer(sourceCardId, destinationCardId, Number(amount), pin);
                    if (ok) {
                        navigation.replace('TransferSuccess');
                    }
                }}
            >
                <Text style={styles.buttonText}>Transfer Fund</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 12 },
    header: { fontSize: 22, fontWeight: '700', marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#111' },
    button: { backgroundColor: '#0E9F6E', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
    buttonDisabled: { backgroundColor: '#a7dacb' },
    buttonText: { color: 'white', fontWeight: '700' },
});


