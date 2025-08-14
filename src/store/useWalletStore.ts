import { create } from 'zustand';
import { produce } from 'immer';
import { saveUserProfile, updateUserAmount, getUserProfile } from '../utils';
import type { UserProfile, Gender } from '../types/user';


type LastTransfer = {
    sourceCardId: string;
    destinationCardId: string;
    amount: number;
    destinationSnapshot: Pick<UserProfile, 'fullName' | 'email' | 'gender' | 'phoneNumber'>;
};

type LastTopup = {
    cardId: string;
    amount: number;
    userSnapshot: Pick<UserProfile, 'fullName' | 'email' | 'gender' | 'phoneNumber'>;
};

type WalletState = {
    usersByCardId: Record<string, UserProfile>;
    selectedSourceCardId: string | null;
    selectedDestinationCardId: string | null;
    lastTransfer: LastTransfer | null;
    lastTopup: LastTopup | null;
    pendingTopupAmount: number | null;
    // actions
    seedDemoData: () => Promise<void>;
    getUserByCardId: (cardId: string) => UserProfile | undefined;
    setSelectedSourceCard: (cardId: string | null) => void;
    setSelectedDestinationCard: (cardId: string | null) => void;
    setPendingTopupAmount: (amount: number | null) => void;
    registerUser: (cardId: string, profile: Omit<UserProfile, 'cardId' | 'registerDate' | 'balance'>) => Promise<UserProfile>;
    topup: (cardId: string, amount: number) => Promise<UserProfile | undefined>;
    transfer: (sourceCardId: string, destinationCardId: string, amount: number, pin: string) => Promise<boolean>;
    // firestore sync
    loadUserFromRemote: (cardId: string) => Promise<UserProfile | undefined>;
};

export const useWalletStore = create<WalletState>((set, get) => ({
    usersByCardId: {},
    selectedSourceCardId: null,
    selectedDestinationCardId: null,
    lastTransfer: null,
    lastTopup: null,
    pendingTopupAmount: null,
    seedDemoData: async () => {
        const existing = get().usersByCardId;
        if (Object.keys(existing).length > 0) return;
        const now = new Date().toISOString();
        const destination: UserProfile = {
            cardId: 'CARD_2',
            fullName: 'Destination User',
            email: 'dest@example.com',
            dateOfBirth: '1990-01-01',
            phoneNumber: '+620000000002',
            gender: 'Female',
            registerDate: now,
            balance: 250000,
            pin: '123456',
        };
        set({ usersByCardId: { [destination.cardId]: destination } });
        try {
            await saveUserProfile(destination);
        } catch {}
    },
    getUserByCardId: (cardId) => get().usersByCardId[cardId],
    setSelectedSourceCard: (cardId) => set({ selectedSourceCardId: cardId }),
    setSelectedDestinationCard: (cardId) => set({ selectedDestinationCardId: cardId }),
    setPendingTopupAmount: (amount) => set({ pendingTopupAmount: amount }),
    registerUser: async (cardId, profile) => {
        const now = new Date().toISOString();
        const user: UserProfile = {
            cardId,
            fullName: profile.fullName,
            email: profile.email,
            dateOfBirth: profile.dateOfBirth,
            phoneNumber: profile.phoneNumber,
            gender: profile.gender,
            registerDate: now,
            balance: 0,
            pin: profile.pin,
        };
        // persist to firestore
        try {
            await saveUserProfile(user);
        } catch {}
        set(
            produce<WalletState>((draft) => {
                draft.usersByCardId[cardId] = user;
                draft.selectedSourceCardId = cardId;
            })
        );
        return user;
    },
    topup: async (cardId, amount) => {
        if (amount <= 0) return undefined;
        const user = get().usersByCardId[cardId];
        if (!user) return undefined;
        set(
            produce<WalletState>((draft) => {
                draft.usersByCardId[cardId].balance += amount;
                draft.lastTopup = {
                    cardId,
                    amount,
                    userSnapshot: {
                        fullName: user.fullName,
                        email: user.email,
                        gender: user.gender,
                        phoneNumber: user.phoneNumber,
                    },
                };
            })
        );
        const updated = { ...user, balance: user.balance + amount };
        try {
            await updateUserAmount(cardId, updated.balance);
        } catch {}
        return updated;
    },
    transfer: async (sourceCardId, destinationCardId, amount, pin) => {
        const source = get().usersByCardId[sourceCardId];
        const dest = get().usersByCardId[destinationCardId];
        if (!source || !dest) return false;
        if (pin !== source.pin) return false;
        if (amount <= 0) return false;
        if (source.balance < amount) return false;
        set(
            produce<WalletState>((draft) => {
                draft.usersByCardId[sourceCardId].balance -= amount;
                draft.usersByCardId[destinationCardId].balance += amount;
                draft.lastTransfer = {
                    sourceCardId,
                    destinationCardId,
                    amount,
                    destinationSnapshot: {
                        fullName: dest.fullName,
                        email: dest.email,
                        gender: dest.gender,
                        phoneNumber: dest.phoneNumber,
                    },
                };
            })
        );
        try {
            await Promise.all([
                updateUserAmount(sourceCardId, source.balance - amount),
                updateUserAmount(destinationCardId, dest.balance + amount),
            ]);
        } catch {}
        return true;
    },
    loadUserFromRemote: async (cardId) => {
        try {
            const remote = await getUserProfile(cardId);
            if (remote) {
                set(
                    produce<WalletState>((draft) => {
                        draft.usersByCardId[cardId] = remote;
                    })
                );
            }
            return remote ?? undefined;
        } catch {
            return undefined;
        }
    },
}));


