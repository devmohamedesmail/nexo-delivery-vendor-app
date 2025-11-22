import React, { createContext, useContext } from 'react';
import { startBackgroundLocation,stopBackgroundLocation } from '@/tasks/locatoinTask';



const LocationContext = createContext({
  startTracking: async () => {},
  stopTracking: async () => {},
});

export const LocationProvider = ({ children }: any) => {

  const startTracking = async () => {
    await startBackgroundLocation();
  };

  const stopTracking = async () => {
    await stopBackgroundLocation();
  };

  return (
    <LocationContext.Provider value={{ startTracking, stopTracking }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useDriverLocation = () => useContext(LocationContext);
