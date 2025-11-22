import React from 'react'
import { View, Text, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'


export default function VehicleInfo({ profileData }: { profileData: any }) {
    const { t } = useTranslation()
   
    return (
        <View className="mx-4 mt-8 p-6 bg-white rounded-2xl ">
            <View className="flex-row items-center mb-4">
                <Ionicons name="person-circle" size={40} color="#fd4a12" />
                <View className="ml-3">
                    <Text className="text-lg font-bold text-gray-800">{profileData?.data?.name}</Text>
                    <Text className="text-gray-500">{profileData?.data?.identifier}</Text>
                </View>
            </View>

            <View className="flex-row items-center mb-3">
                <Ionicons name="car-sport-outline" size={22} color="#fd4a12" />
                <Text className="ml-2 text-gray-700 font-medium">{t('driver.vehicle_type', { defaultValue: 'Vehicle Type' })}:</Text>
                <Text className="ml-2 text-gray-900">{profileData?.data?.driver.vehicle_type}</Text>
            </View>

            <View className="flex-row items-center mb-3">
                <Ionicons name="pricetag-outline" size={22} color="#fd4a12" />
                <Text className="ml-2 text-gray-700 font-medium">{t('driver.license_plate', { defaultValue: 'License Plate' })}:</Text>
                <Text className="ml-2 text-gray-900">{profileData?.data?.driver.vehicle_license_plate}</Text>
            </View>




            <View className="flex-row items-center mb-3">
                <Ionicons name="color-palette-outline" size={22} color="#fd4a12" />
                <Text className="ml-2 text-gray-700 font-medium">{t('driver.vehicle_color')}:</Text>
                <Text className="ml-2 text-gray-900">{profileData?.data?.driver.vehicle_color}</Text>
            </View>

            <View className="flex-row items-center mb-3">
                <Image 
                  source={{ uri: `${profileData?.data?.driver.image}` }} 
                  className='rounded-full'
                  style={{ width: 100, height: 100 }} />
            </View>


        </View>
    )
}
