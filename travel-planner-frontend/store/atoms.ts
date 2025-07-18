import { atom } from 'jotai';
import { AccountInfo } from '@azure/msal-browser';

export const userAtom = atom<AccountInfo | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
