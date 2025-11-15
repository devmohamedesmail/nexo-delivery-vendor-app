import React, { useCallback } from 'react'
import { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, StatusBar, Image, RefreshControl, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '@/context/auth_context'
import { SafeAreaView } from 'react-native-safe-area-context'
import useFetch from '@/hooks/useFetch'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function DriverHomeScreen() {
  const { t, i18n } = useTranslation()
  const { auth } = useContext(AuthContext)
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false)
  const { data: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useFetch(`/users/profile/${auth?.user?.id}`)



  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetchProfile()
    setRefreshing(false)
  }, [refetchProfile])


  return (
    <SafeAreaView className="flex-1 bg-gray-50"

    >
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />






      <View className="flex-row items-center justify-between px-4 py-4 bg-white shadow-sm">
        <View style={{ width: 32 }} />
        <Text className="text-lg font-bold text-gray-800">{t('driver.homeTitle', { defaultValue: 'Driver Home' })}</Text>
        <TouchableOpacity
          onPress={() => router.push('/account')}
          className="p-2 rounded-full bg-primary/10"
          accessibilityLabel={t('account.profile')}
        >
          <Ionicons name="person-circle-outline" size={28} color="#fd4a12" />
        </TouchableOpacity>
      </View>



      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#fd4a12']}
          />
        }

      >
        {profileData?.data?.driver ? (
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


          </View>
        ) : (
          <View>
            <Image
              source={require('../assets/gallery/license.png')}
              style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 50 }}

            />
            <View className='px-10 mt-10'>
              <TouchableOpacity
                onPress={() => router.push('/driver/create')}
                className='bg-primary p-3 py-5 rounded-md'>
                <Text className='text-center text-white'>{t('driver.createProfile')}</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </ScrollView>




    </SafeAreaView>
  )
}
