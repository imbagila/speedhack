import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useWalletStore } from '../store/useWalletStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminTopupSuccess'>;

export default function AdminTopupSuccessScreen({ navigation }: Props) {
    const lastTopup = useWalletStore((s) => s.lastTopup);

    if (!lastTopup) {
        return (
            <View style={styles.container}><Text>No topup data</Text></View>
        );
    }

    const { userSnapshot, amount } = lastTopup;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Topup Success</Text>
            <Text>Full name: {userSnapshot.fullName}</Text>
            <Text>Email: {userSnapshot.email}</Text>
            <Text>Gender: {userSnapshot.gender}</Text>
            <Text>Phone: {userSnapshot.phoneNumber}</Text>
            <Text>Topup amount: {amount.toLocaleString()}</Text>
            <Pressable style={styles.button} onPress={() => navigation.replace('AdminCardReader')}>
                <Text style={styles.buttonText}>OK</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 12 },
    header: { fontSize: 22, fontWeight: '700', marginTop: 12 },
    button: { backgroundColor: '#4B7BE5', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 24 },
    buttonText: { color: 'white', fontWeight: '700' },
});


