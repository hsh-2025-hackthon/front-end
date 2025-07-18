import apiClient from '../lib/apiClient';

export const getTrips = () => {
  return apiClient('/trips', 'GET');
};

export const createTrip = (data: { title: string; description: string; startDate: string; endDate: string }) => {
  return apiClient('/trips', 'POST', data);
};

export const getTrip = (tripId: string) => {
  return apiClient(`/trips/${tripId}`, 'GET');
};

export const updateTrip = (tripId: string, data: any) => {
  return apiClient(`/trips/${tripId}`, 'PUT', data);
};

export const deleteTrip = (tripId: string) => {
  return apiClient(`/trips/${tripId}`, 'DELETE');
};

export const addDestination = (tripId: string, data: any) => {
  return apiClient(`/trips/${tripId}/destinations`, 'POST', data);
};

export const updateDestination = (tripId: string, destinationId: string, data: any) => {
  return apiClient(`/trips/${tripId}/destinations/${destinationId}`, 'PUT', data);
};

export const deleteDestination = (tripId: string, destinationId: string) => {
  return apiClient(`/trips/${tripId}/destinations/${destinationId}`, 'DELETE');
};

export const addCollaborator = (tripId: string, data: any) => {
  return apiClient(`/trips/${tripId}/collaborators`, 'POST', data);
};

export const removeCollaborator = (tripId: string, userId: string) => {
  return apiClient(`/trips/${tripId}/collaborators/${userId}`, 'DELETE');
};

export const generateItinerary = (data: any) => {
  return apiClient('/ai/generate-itinerary', 'POST', data);
};
