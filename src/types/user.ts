export type Gender = 'Male' | 'Female' | 'Other';

export type UserProfile = {
    cardId: string;
    fullName: string;
    email: string;
    dateOfBirth: string; // ISO string YYYY-MM-DD
    phoneNumber: string;
    gender: Gender;
    registerDate: string; // ISO datetime string
    balance: number;
    pin: string; // simple numeric string
};


