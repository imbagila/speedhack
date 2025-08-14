import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterSuccess'>;

export default function RegisterSuccessScreen({ route, navigation }: Props) {
    const { cardId } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Register Success</Text>
            <Text>Card: {cardId}</Text>
            <Pressable style={styles.button} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] as any })}>
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


