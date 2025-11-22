import * as Location from 'expo-location';
import axios from 'axios';


const GOOGLE_API_KEY = "AIzaSyCWrI-BwVYZE6D7wzFCVeEuaKr6VR-6FGI";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface MyLocationResult {
  coords: LocationCoords;
  address: string;
}


export const getMyLocation = async (): Promise<MyLocationResult> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Fetch address using Google Maps Geocoding API
    const addressResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
    );

    const address = addressResponse.data.results[0]?.formatted_address || 'Unknown address';

    return {
      coords: { latitude, longitude },
      address,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error in location');
  }
};