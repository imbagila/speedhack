import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useWalletStore } from '../store/useWalletStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ route, navigation }: Props) {
    const { cardId } = route.params;
    const user = useWalletStore((s) => s.usersByCardId[cardId]);

    if (!user) {
        return (
            <View style={styles.container}> 
                <Text>User not found</Text>
                <Pressable style={styles.link} onPress={() => navigation.replace('CardReader')}>
                    <Text style={styles.linkText}>Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.item}>Balance: {user.balance.toLocaleString()}</Text>
            <Text style={styles.item}>Date of Birth: {user.dateOfBirth}</Text>
            <Text style={styles.item}>Register Date: {new Date(user.registerDate).toLocaleString()}</Text>
            <Text style={styles.item}>Email: {user.email}</Text>
            <Text style={styles.item}>Gender: {user.gender}</Text>
            <Text style={styles.item}>Phone: {user.phoneNumber}</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('DestinationReader')}>
                <Text style={styles.buttonText}>Transfer Fund</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 12 },
    name: { fontSize: 22, fontWeight: '700', marginTop: 12 },
    item: { fontSize: 16 },
    button: { backgroundColor: '#4B7BE5', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 24 },
    buttonText: { color: 'white', fontWeight: '700' },
    link: { paddingVertical: 8 },
    linkText: { color: '#4B7BE5' },
});


