import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import axios from 'axios'
import { Toast } from 'toastify-react-native'
import { useTranslation } from 'react-i18next'
import { config } from '@/constants/config'
import Loading from '../common/Loading'

export default function ToggleAvailbility({ profileData, refetchProfile }: { profileData: any, refetchProfile: any }) {

    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);


    const toggle_availablity = async () => {
        try {
            setLoading(true);
            const res = await axios.patch(`${config.URL}/drivers/${profileData?.data?.driver?.id}/toggle-availability`);
            await refetchProfile();

        } catch (error) {

            Toast.show({
                type: 'error',
                text1: t('common.error_happened'),
            })
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>

            {loading ? (
                <Loading />
            ) : (
                <TouchableOpacity onPress={toggle_availablity}>
                    <View className={`mx-4 mt-6 p-4 rounded-2xl items-center ${profileData?.data?.driver?.is_available ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Text className={`text-lg font-semibold ${profileData?.data?.driver?.is_available ? 'text-green-800' : 'text-red-800'}`}>
                            {profileData?.data?.driver?.is_available ? t('driver.available') : t('driver.unavailable')}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    )
}
