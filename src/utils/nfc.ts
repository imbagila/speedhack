// Simple NFC mock for demo purposes
// In a real app, replace with expo-nfc or native module integration

type Listener = (cardId: string) => void;

let activeListener: Listener | null = null;

export function onNfcTap(listener: Listener) {
    activeListener = listener;
}

export function clearNfcTap() {
    activeListener = null;
}

export function simulateTap(cardId: string) {
    if (activeListener) activeListener(cardId);
}


