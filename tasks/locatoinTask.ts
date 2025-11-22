import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import axios from 'axios';
import { config } from '@/constants/config';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
    if (error) {
        console.error('Location Task Error:', error);
        return;
    }

    if (data) {
        const { locations } = data;
        const location = locations[0];

        if (location) {
            const { latitude, longitude } = location.coords;

            try {
                const response = await axios.post(
                    `${config.URL}/driver-locations/update-location`,
                    {
                        driver_id: 3,
                        latitude: latitude,
                        longitude: longitude,
                    }
                );

                console.log('✅ Location sent:', latitude, longitude);
            } catch (err) {
                console.error('❌ Failed to send location', err);
            }
        }
    }
});

export const startBackgroundLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const bgStatus = await Location.requestBackgroundPermissionsAsync();

    if (status !== 'granted' || bgStatus.status !== 'granted') {
        throw new Error('لم يتم السماح بالوصول للموقع');
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,       // كل 5 ثواني
        distanceInterval: 0,      // حتى لو لم يتحرك
        showsBackgroundLocationIndicator: true,
        foregroundService: {
            notificationTitle: 'توصيلة',
            notificationBody: 'يتم تتبع موقع السائق حالياً',
        },
    });
};

export const stopBackgroundLocation = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
};
