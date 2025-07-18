import { atom } from 'jotai';

// This will eventually be replaced by the Y.js document
export const itineraryAtom = atom<any[]>([]);

export const collaboratorsAtom = atom<any[]>([]);

export const addDestinationAtom = atom(
  null,
  (get, set, destination) => {
    const currentItinerary = get(itineraryAtom);
    const newItinerary = [...currentItinerary, { ...destination, id: Date.now() }];
    set(itineraryAtom, newItinerary);
  }
);
