import React, { useEffect } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useContext, useState, useCallback } from 'react'
import { AuthContext } from '@/context/auth_context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { RefreshControl } from 'react-native'
import useFetch from '@/hooks/useFetch'
import Loading from '@/components/common/Loading'
import NotificationIcon from '@/components/common/NotificationIcon'
import VehicleInfo from '@/components/driver/VehicleInfo'
import ToggleAvailbility from '@/components/driver/ToggleAvailbility'
import { useDriverLocation } from '@/context/DriverLocationContext'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { auth } = useContext(AuthContext)
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false)
  const { data: profileData, refetch: refetchProfile } = useFetch(`/users/profile/${auth?.user?.id}`)
  const { loading: profileLoading, } = useFetch(`/users/profile/${auth?.user?.id}`)
  const { startTracking, stopTracking } = useDriverLocation();

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetchProfile()
    setRefreshing(false)
  }, [refetchProfile])



  // useEffect(() => {
  //   startTracking();
  // }, [])


  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar barStyle="light-content" translucent={true} />


      <View className="flex-row items-center justify-between px-4 py-6 pt-20 bg-black/90 shadow-sm">
        <NotificationIcon />
        <Text className="text-lg font-bold text-white">{t('driver.homeTitle')}</Text>


        <TouchableOpacity
          onPress={() => router.push('/account')}
          className="p-2 rounded-full bg-white"
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


        {profileLoading ? (<View ><Loading message={t('common.loading')} /></View>) : (
          <>
            {profileData?.data?.driver ? (
              <>



                <VehicleInfo profileData={profileData} />


                <ToggleAvailbility profileData={profileData} refetchProfile={refetchProfile} />

                <View>
                  <TouchableOpacity
                    onPress={() => router.push('/driver/orders')}
                    className='bg-primary m-4 p-4 rounded-md mt-6'
                  >
                    <Text className='text-center text-white font-bold'>{t('driver.viewOrders')}</Text>
                  </TouchableOpacity>
                </View>

              </>
            ) : (
              <View>
                <Image
                  source={require('../../assets/gallery/license.png')}
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



          </>)}






      </ScrollView>

    </SafeAreaView>
  )
}
