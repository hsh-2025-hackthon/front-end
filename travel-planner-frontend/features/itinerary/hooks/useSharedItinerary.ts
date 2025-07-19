import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebPubSubProvider } from '../../../services/WebPubSubProvider';
import { useAtom } from 'jotai';
import { itineraryAtom } from '../state';

export function useSharedItinerary(tripId: string) {
  const [itinerary, setItinerary] = useAtom(itineraryAtom);
  const [ydoc] = useState(new Y.Doc());

  useEffect(() => {
    // This connection string should be fetched from a secure endpoint
    const connectionString = process.env.NEXT_PUBLIC_WEBPUBSUB_CONNECTION_STRING || 'YOUR_WEBPUBSUB_CONNECTION_STRING';
    const provider = new WebPubSubProvider(
      connectionString,
      'collaborationHub',
      ydoc
    );

    const yItinerary = ydoc.getArray<any>('itinerary');

    const updateItinerary = () => {
      setItinerary(yItinerary.toJSON());
    };

    yItinerary.observe(updateItinerary);

    provider.connect();

    return () => {
      provider.disconnect();
      yItinerary.unobserve(updateItinerary);
    };
  }, [tripId, ydoc, setItinerary]);

  const addDestination = (destination: any) => {
    const yItinerary = ydoc.getArray<any>('itinerary');
    yItinerary.push([destination]);
  };

  return { itinerary, addDestination };
}
