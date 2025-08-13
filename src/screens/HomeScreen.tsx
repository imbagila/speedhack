import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Pressable style={styles.buttonPrimary} onPress={() => navigation.navigate('CardReader')}>
                <Text style={styles.buttonText}>Start</Text>
            </Pressable>
            <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate('AdminPin')}>
                <Text style={styles.buttonText}>Admin</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
    buttonPrimary: { backgroundColor: '#4B7BE5', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, minWidth: 200, alignItems: 'center' },
    buttonSecondary: { backgroundColor: '#0E9F6E', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, minWidth: 200, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: '700' },
});


