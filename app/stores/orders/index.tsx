import useFetch from '@/hooks/useFetch'
import React, { useContext, useState, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, FlatList, StatusBar } from 'react-native'
import { AuthContext } from '@/context/auth_context'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import OrderItem from '@/components/store/OrderItem'
import Loading from '@/components/common/Loading'
import { useRouter } from 'expo-router'
import NoOrdersFound from '@/components/store/NoOrdersFound'
import { SafeAreaView } from 'react-native-safe-area-context'


type OrderStatus = 'all' | 'pending' | 'accepted' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  order: string;
  status: string;
  total_price: string;
  delivery_address: string;
  placed_at: string;
  delivered_at: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  restaurant: Restaurant;
}
export default function Orders() {
  const { t } = useTranslation()
  const { auth } = useContext(AuthContext)
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useFetch(`/users/profile/${auth?.user?.id}`)
  const {
    data,
    loading,
    error,
    refetch: refetchOrders,
  } = useFetch(`/orders/store/${profileData?.data?.store?.id}`)
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const router = useRouter()

  const orders = data?.data || []

  const tabs: { key: OrderStatus; label: string; count?: number }[] = [
    { key: 'all', label: t('orders.all') },
    { key: 'pending', label: t('orders.pending') },
    { key: 'accepted', label: t('orders.accepted') },
    { key: 'preparing', label: t('orders.preparing') },
    { key: 'on_the_way', label: t('orders.onTheWay') },
    { key: 'delivered', label: t('orders.delivered') },
    { key: 'cancelled', label: t('orders.cancelled') },
  ];

  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    if (activeTab === 'all') return orders;
    return orders.filter((order: Order) => order.status === activeTab);
  }, [orders, activeTab]);

  const getStatusCounts = (status: OrderStatus) => {
    if (!orders || orders.length === 0) return 0;
    if (status === 'all') return orders.length;
    return orders.filter((order: Order) => order.status === status).length;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar  />


      <View className='flex flex-row justify-between items-center pt-16 pb-5 px-5 bg-black/90'>
        <TouchableOpacity onPress={() => router.back()} className='bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center'>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className='font-bold text-2xl text-white'>{t('orders.title')}</Text>
      </View>

      {loading ? (
        
        <View className='flex-1'>
            <Loading />
        </View>
        ) : (
        <>


          {/* Header */}
          <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-100">


            {/* Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row -mx-4 px-4"
            >
              {tabs.map((tab) => {
                const count = getStatusCounts(tab.key);
                const isActive = activeTab === tab.key;

                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    className={`mr-2 px-4 py-2 rounded-full border ${isActive
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-200'
                      }`}
                  >
                    <View className="flex-row items-center">
                      <Text className={`font-semibold  ${isActive ? 'text-white' : 'text-black'
                        }`}>
                        {tab.label}
                      </Text>
                      {count > 0 && (
                        <View className={`ml-2 px-2 py-0.5 rounded-full ${isActive ? 'bg-secondary' : 'bg-gray-100'
                          }`}>
                          <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-600'
                            }`}>
                            {count}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <NoOrdersFound />
          ) : (
            <FlatList
              data={Array.isArray(filteredOrders) ? filteredOrders : []}
              renderItem={({ item }) => item && <OrderItem item={item} refetchOrders={refetchOrders} />}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )}



        </>)}
    </SafeAreaView>
  )
}