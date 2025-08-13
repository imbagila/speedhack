import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardReaderScreen from './src/screens/CardReaderScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DestinationReaderScreen from './src/screens/DestinationReaderScreen';
import TransferDetailScreen from './src/screens/TransferDetailScreen';
import TransferSuccessScreen from './src/screens/TransferSuccessScreen';
import AdminTopupScreen from './src/screens/AdminTopupScreen';
import AdminCardReaderScreen from './src/screens/AdminCardReaderScreen';
import AdminTopupSuccessScreen from './src/screens/AdminTopupSuccessScreen';
import { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import AdminPinScreen from './src/screens/AdminPinScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
                <Stack.Screen name="CardReader" component={CardReaderScreen} options={{ title: 'Card Reader' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
                <Stack.Screen name="DestinationReader" component={DestinationReaderScreen} options={{ title: 'Destination Reader' }} />
                <Stack.Screen name="TransferDetail" component={TransferDetailScreen} options={{ title: 'Transfer Detail' }} />
                <Stack.Screen name="TransferSuccess" component={TransferSuccessScreen} options={{ title: 'Success' }} />
                <Stack.Screen name="AdminTopup" component={AdminTopupScreen} options={{ title: 'Force Topup' }} />
                <Stack.Screen name="AdminPin" component={AdminPinScreen} options={{ title: 'Admin PIN' }} />
                <Stack.Screen name="AdminCardReader" component={AdminCardReaderScreen} options={{ title: 'Admin Card Reader' }} />
                <Stack.Screen name="AdminTopupSuccess" component={AdminTopupSuccessScreen} options={{ title: 'Topup Success' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
