import { create } from 'zustand';
import { produce } from 'immer';
import { saveUserProfile, updateUserAmount, getUserProfile, subscribeUserProfile } from '../utils';
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
    subscriptionsByCardId: Partial<Record<string, () => void>>;
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
    subscribeToUser: (cardId: string) => void;
    unsubscribeFromUser: (cardId: string) => void;
    refreshUserFromRemote: (cardId: string) => Promise<UserProfile | null>;
};

export const useWalletStore = create<WalletState>((set, get) => ({
    usersByCardId: {},
    subscriptionsByCardId: {},
    selectedSourceCardId: null,
    selectedDestinationCardId: null,
    lastTransfer: null,
    lastTopup: null,
    pendingTopupAmount: null,
    seedDemoData: async () => {},
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
        // allow negative balances per request
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
    subscribeToUser: (cardId) => {
        const current = get().subscriptionsByCardId[cardId];
        if (current) return;
        const unsub = subscribeUserProfile(cardId, (u) => {
            set(
                produce<WalletState>((draft) => {
                    if (u) {
                        draft.usersByCardId[cardId] = u;
                    } else {
                        delete draft.usersByCardId[cardId];
                    }
                })
            );
        });
        set(
            produce<WalletState>((draft) => {
                draft.subscriptionsByCardId[cardId] = unsub;
            })
        );
    },
    unsubscribeFromUser: (cardId) => {
        const current = get().subscriptionsByCardId[cardId];
        if (current) {
            current();
            set(
                produce<WalletState>((draft) => {
                    delete draft.subscriptionsByCardId[cardId];
                })
            );
        }
    },
    refreshUserFromRemote: async (cardId) => {
        try {
            const remote = await getUserProfile(cardId);
            set(
                produce<WalletState>((draft) => {
                    if (remote) {
                        draft.usersByCardId[cardId] = remote;
                    } else {
                        delete draft.usersByCardId[cardId];
                    }
                })
            );
            return remote ?? null;
        } catch {
            return null;
        }
    },
}));


