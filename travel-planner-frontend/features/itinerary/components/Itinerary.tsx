"use client";

import { useSharedItinerary } from "../hooks/useSharedItinerary";
import { useState } from "react";

export function Itinerary({ tripId }: { tripId: string }) {
  const { itinerary, addDestination } = useSharedItinerary(tripId);
  const [newDestination, setNewDestination] = useState("");

  const handleAddDestination = () => {
    if (newDestination.trim() !== "") {
      addDestination({ name: newDestination });
      setNewDestination("");
    }
  };

  return (
    <div>
      <h2>Itinerary for Trip {tripId}</h2>
      <ul>
        {itinerary.map((dest, index) => (
          <li key={index}>{dest.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newDestination}
        onChange={(e) => setNewDestination(e.target.value)}
        placeholder="New destination"
      />
      <button onClick={handleAddDestination}>Add Destination</button>
    </div>
  );
}
