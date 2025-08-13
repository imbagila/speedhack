import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useWalletStore, Gender } from '../store/useWalletStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ route, navigation }: Props) {
    const { cardId } = route.params;
    const { registerUser } = useWalletStore();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pin, setPin] = useState('');
    const [pinConfirm, setPinConfirm] = useState('');
    const [gender, setGender] = useState<Gender>('Male');

    const isValid = useMemo(() => {
        return (
            fullName.trim() !== '' &&
            email.trim() !== '' &&
            dateOfBirth.trim() !== '' &&
            phoneNumber.trim() !== '' &&
            pin.length >= 4 &&
            pin === pinConfirm
        );
    }, [dateOfBirth, email, fullName, phoneNumber, pin, pinConfirm]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Register</Text>
            <Text style={styles.sub}>Card: {cardId}</Text>
            <TextInput style={styles.input} placeholder="Fullname" value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dateOfBirth} onChangeText={setDateOfBirth} />
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
            <View style={styles.genderRow}>
                <Pressable onPress={() => setGender('Male')} style={[styles.checkbox, gender === 'Male' && styles.checkboxActive]}>
                    <Text style={styles.checkboxText}>Male</Text>
                </Pressable>
                <Pressable onPress={() => setGender('Female')} style={[styles.checkbox, gender === 'Female' && styles.checkboxActive]}>
                    <Text style={styles.checkboxText}>Female</Text>
                </Pressable>
                <Pressable onPress={() => setGender('Other')} style={[styles.checkbox, gender === 'Other' && styles.checkboxActive]}>
                    <Text style={styles.checkboxText}>Other</Text>
                </Pressable>
            </View>
            <TextInput style={styles.input} placeholder="PIN" value={pin} onChangeText={setPin} secureTextEntry keyboardType="number-pad" />
            <TextInput style={styles.input} placeholder="PIN Confirmation" value={pinConfirm} onChangeText={setPinConfirm} secureTextEntry keyboardType="number-pad" />
            <Pressable
                disabled={!isValid}
                style={[styles.button, !isValid && styles.buttonDisabled]}
                onPress={() => {
                    registerUser(cardId, {
                        fullName,
                        email,
                        dateOfBirth,
                        phoneNumber,
                        gender,
                        pin,
                    });
                    navigation.replace('Profile', { cardId });
                }}
            >
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 12 },
    header: { fontSize: 22, fontWeight: '700', marginTop: 12 },
    sub: { color: '#666' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
    genderRow: { flexDirection: 'row', gap: 8, marginVertical: 4 },
    checkbox: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
    checkboxActive: { backgroundColor: '#4B7BE5', borderColor: '#4B7BE5' },
    checkboxText: { color: 'white' },
    button: { backgroundColor: '#0E9F6E', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
    buttonDisabled: { backgroundColor: '#a7dacb' },
    buttonText: { color: 'white', fontWeight: '700' },
});


