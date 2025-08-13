import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminPin'>;

export default function AdminPinScreen({ navigation }: Props) {
    const [pin, setPin] = useState('');
    const ok = useMemo(() => pin.length >= 4, [pin]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Admin PIN</Text>
            <TextInput
                style={styles.input}
                placeholder="PIN"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                secureTextEntry
                value={pin}
                onChangeText={setPin}
            />
            <Pressable
                disabled={!ok}
                style={[styles.button, !ok && styles.buttonDisabled]}
                onPress={() => {
                    if (pin === '123456') {
                        navigation.replace('AdminTopup');
                    }
                }}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minWidth: 240, color: '#111', textAlign: 'center' },
    button: { backgroundColor: '#4B7BE5', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8, minWidth: 200 },
    buttonDisabled: { backgroundColor: '#a7b7de' },
    buttonText: { color: 'white', fontWeight: '700' },
});


