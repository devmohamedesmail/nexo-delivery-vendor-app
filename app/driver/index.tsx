import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useContext, useState, useCallback } from 'react'
import { AuthContext } from '@/context/auth-provider'
import { useRouter } from 'expo-router'
import { RefreshControl } from 'react-native'
import useFetch from '@/hooks/useFetch'
import Loading from '@/components/ui/Loading'
import NotificationIcon from '@/components/common/notification-icon'
import VehicleInfo from '@/components/driver/VehicleInfo'
import ToggleAvailbility from '@/components/driver/ToggleAvailbility'
import { useDriverLocation } from '@/context/driver-location-provider'
import Button from '@/components/ui/button'

export default function Home() {
  const { t } = useTranslation()
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
        <Text className="text-lg font-bold text-white">{t('common.home')}</Text>



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


        {profileLoading ? (<Loading />) : (
          <>
            {profileData?.data?.driver ? (
              <>



                <VehicleInfo profileData={profileData} />


                <ToggleAvailbility profileData={profileData} refetchProfile={refetchProfile} />

                <View className='px-10'>
                  

                  <Button  title={t('driver.viewOrders')}  onPress={() => router.push('/driver/orders')} />
                  <Button  title={t('account.account')}  bgColor="bg-black"  onPress={() => router.push('/account')} />

        

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
