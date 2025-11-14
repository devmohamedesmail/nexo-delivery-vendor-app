import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Toast } from 'toastify-react-native'
import CustomLoading from '@/components/custom/Loading'
import useFetch from '@/hooks/useFetch'
import OrderItem from '@/items/order_item'
import NotificationIcon from '@/components/NotificationIcon'

interface OrderItem {
  id: number
  meal_name: string
  quantity: number
  price: string
}

interface Order {
  id: number
  customer_name: string
  customer_phone: string
  total_amount: string
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  delivery_address: string
  order_date: string
  items: OrderItem[]
}

export default function Orders() {
  const { t } = useTranslation()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all')
  const {data,loading ,error} = useFetch('/orders/restaurant/72');


  // const filteredOrders = data.filter(order => {
  //   switch (activeTab) {
  //     case 'pending': return order.status === 'pending'
  //     case 'active': return ['accepted', 'preparing', 'ready'].includes(order.status)
  //     case 'completed': return ['completed', 'cancelled'].includes(order.status)
  //     default: return true
  //   }
  // })

  const onRefresh = () => {
    setRefreshing(true)
    // fetchOrders()
  }

 

  if (loading) {
    return (
      <CustomLoading 
         
          size="large" 
          text={t('loading_orders')} 
        />
    )
  }

 

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Enhanced Header */}
      <View className="bg-white shadow-lg border-b border-gray-100" style={{ paddingTop: 50 }}>
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          
          <View className="flex-1 mx-4">
            <Text
              className="text-xl font-bold text-gray-800 text-center"
              style={{ fontFamily: 'Cairo_700Bold' }}
            >
              {t('orders.orders')}
            </Text>
            <Text
              className="text-sm text-gray-500 text-center mt-1"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
             
              {t('orders.manage_incoming_orders')}
            </Text>
          </View>
          
          <NotificationIcon />
        </View>

        {/* Stats Bar */}
        <View className="px-6 pb-4">
          <View className="flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Cairo_700Bold' }}>
                {/* {orders.filter(o => o.status === 'pending').length} */}
              </Text>
              <Text className="text-blue-600 text-xs" style={{ fontFamily: 'Cairo_400Regular' }}>
                Pending
              </Text>
            </View>
            <View className="w-px h-8 bg-blue-200" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Cairo_700Bold' }}>
                {/* {orders.filter(o => ['accepted', 'preparing', 'ready'].includes(o.status)).length} */}
              </Text>
              <Text className="text-orange-600 text-xs" style={{ fontFamily: 'Cairo_400Regular' }}>
                Active
              </Text>
            </View>
            <View className="w-px h-8 bg-blue-200" />
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Cairo_700Bold' }}>
                {/* {orders.filter(o => o.status === 'completed').length} */}
              </Text>
              <Text className="text-green-600 text-xs" style={{ fontFamily: 'Cairo_400Regular' }}>
                Completed
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Enhanced Tabs */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            {(['all', 'pending', 'active', 'completed'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl ${
                  activeTab === tab 
                    ? 'bg-blue-600 shadow-lg' 
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name={
                      tab === 'all' ? 'list-outline' :
                      tab === 'pending' ? 'time-outline' :
                      tab === 'active' ? 'flash-outline' :
                      'checkmark-circle-outline'
                    } 
                    size={16} 
                    color={activeTab === tab ? 'white' : '#6B7280'} 
                  />
                  <Text
                    className={`font-semibold ml-2 ${
                      activeTab === tab ? 'text-white' : 'text-gray-600'
                    }`}
                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                  >
                    {t(tab)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {data && data.length > 0 ? (<>
        
        {data.map((order: Order) => (<>
        
        <OrderItem key={order.id} order={order} />
        </>))}
        
        
        </>):(<></>)}
       
      </ScrollView>
    </View>
  )
}
