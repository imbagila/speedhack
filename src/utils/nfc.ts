import NfcManager, { NfcEvents, Ndef, NdefRecord, TagEvent } from 'react-native-nfc-manager';

// Initialize NFC manager
let isInitialized = false;
async function ensureInit() {
    if (isInitialized) return true;
    try {
        await NfcManager.start();
        isInitialized = true;
        return true;
    } catch (e) {
        return false;
    }
}

type Listener = (cardId: string) => void;
let activeListener: Listener | null = null;

export async function onNfcTap(listener: Listener) {
    const ok = await ensureInit();
    if (!ok) return;
    activeListener = listener;
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
        const id = extractCardId(tag);
        if (id && activeListener) {
            activeListener(id);
        }
        // On Android, we must notify the system we are done so it stops the vibration/beep
        NfcManager.unregisterTagEvent().catch(() => {});
    });
    try {
        await NfcManager.registerTagEvent();
    } catch {}
}

export function clearNfcTap() {
    activeListener = null;
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null as any);
    NfcManager.unregisterTagEvent().catch(() => {});
}

function extractCardId(tag: TagEvent): string | null {
    // Prefer tag.id (Android). On iOS, we might read from NDEF payload
    if (tag.id) return tag.id;
    const ndef = tag.ndefMessage as unknown as NdefRecord[] | undefined;
    if (ndef && ndef.length > 0) {
        try {
            const raw = (ndef[0] as any).payload;
            let payload: Uint8Array | null = null;
            if (raw instanceof Uint8Array) {
                payload = raw;
            } else if (Array.isArray(raw)) {
                payload = Uint8Array.from(raw as number[]);
            } else if (raw && typeof raw === 'object' && Array.isArray((raw as any).data)) {
                payload = Uint8Array.from((raw as any).data as number[]);
            }
            const text = payload ? Ndef.text.decodePayload(payload) : '';
            if (text) return text;
        } catch {}
    }
    return null;
}


