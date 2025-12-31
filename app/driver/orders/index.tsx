import React from 'react'
import { Text, View, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/auth-provider'
import useFetch from '@/hooks/useFetch'
import Header from '@/components/ui/Header'
import Loading from '@/components/ui/Loading'
import { config } from '@/constants/config'
import NoTrips from '@/components/driver/NoTrips'

export default function Orders() {
  const { t } = useTranslation()
  const { auth } = useAuth()
  const { data: profileData } = useFetch(`/users/profile/${auth?.user?.id}`)
  const { data: driverTrips } = useFetch(`/trips/driver/${profileData?.data?.driver?.id}`)
  const { loading: tripsLoading } = useFetch(`/trips/driver/${profileData?.data?.driver?.id}`)

  // if (tripsLoading) {
  //   return (
  //     <View className='flex-1'>
  //       <Loading />
  //     </View>
  //   )
  // }




  const renderTrip = ({ item }: any) => (
    <View className="bg-white m-3 p-4 rounded-xl shadow">
      {/* Locations */}
      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-gray-400 text-sm">{t('driverOrders.from')}</Text>
          <Text className="text-black font-semibold">{item.start_location}</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 text-sm">{t('driverOrders.to')}</Text>
          <Text className="text-black font-semibold">{item.end_location}</Text>
        </View>
      </View>

      {/* Fare and Status */}
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-green-600 font-bold">{item.fare} {config.CURRENCY}</Text>
        <View className={`px-3 py-1 rounded-full ${item.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
          <Text className={`${item.status === 'completed' ? 'text-green-700' : 'text-yellow-700'} text-sm font-semibold`}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Payment */}
      <View className="mt-2 flex-row justify-between items-center">
        <Text className="text-gray-500 text-sm">{t('driverOrders.payment')}: {item.payment_method}</Text>
        <Text className={`text-sm font-semibold ${item.payment_status === 'pending' ? 'text-red-500' : 'text-green-500'}`}>
          {item.payment_status.toUpperCase()}
        </Text>
      </View>

      {/* User Info */}
      <View className="mt-2 border-t border-gray-100 pt-2">
        <Text className="text-gray-400 text-sm">{t('driverOrders.rider')}</Text>
        <Text className="text-black font-medium">{item.user.name}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView className='flex-1' edges={["bottom"]}>
      <Header title={t('driverOrders.title')} />


      {tripsLoading ? (<Loading />) : (<>

        {driverTrips?.trips ? (<>

          <FlatList
            data={driverTrips?.trips || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTrip}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<NoTrips />}
          />


        </>) : (<></>)}

      </>)}







    </SafeAreaView>
  )
}
