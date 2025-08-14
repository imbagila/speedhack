import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/speedhack.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Civil Card Payment</Text>
            <Pressable style={styles.buttonPrimary} onPress={() => navigation.navigate('CardReader')}>
                <Text style={styles.buttonText}>Do Payment</Text>
            </Pressable>
            <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate('AdminPin')}>
                <Text style={styles.buttonText}>Force Topup</Text>
            </Pressable>
            <Pressable style={styles.buttonTertiary} onPress={() => navigation.navigate('RegisterPin')}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
    logo: { width: 200, height: 200, marginBottom: 8 },
    buttonPrimary: { backgroundColor: '#4B7BE5', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, minWidth: 200, alignItems: 'center' },
    buttonSecondary: { backgroundColor: '#0E9F6E', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, minWidth: 200, alignItems: 'center' },
    buttonTertiary: { backgroundColor: '#6B7280', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, minWidth: 200, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: '700' },
});


