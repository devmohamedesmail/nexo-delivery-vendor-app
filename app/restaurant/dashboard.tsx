import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { AuthContext } from '@/context/auth_context'
import DashboardItemButton from '@/items/dashboard_item_button'
import NotificationIcon from '@/components/NotificationIcon'


export default function dashboard() {
    const { t } = useTranslation()
    const router = useRouter()
    const { auth } = useContext(AuthContext)

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View className="bg-white px-6 py-4 shadow-sm pt-20">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Cairo_700Bold' }}>

                            {t('resturant.restaurantDashboard')}
                        </Text>
                        <Text className="text-gray-600" style={{ fontFamily: 'Cairo_400Regular' }}>
                            {t('resturant.manageYourRestaurant')}
                        </Text>
                    </View>
                    <NotificationIcon />
                </View>

            </View>

            <ScrollView className="flex-1 px-6 py-4">


                <View className='flex items-center my-3'>
                    <Image
                        source={{ uri: auth?.user?.restaurant?.image }}
                        className="w-44 h-44 rounded-lg"
                        resizeMode="cover"
                    />
                    <Text className='text-4xl'>{auth?.user?.restaurant?.name}</Text>
                </View>


                <View>
                    <View className="flex-row justify-between mb-6">
                        <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm">
                            <View className="flex-row items-center justify-between mb-2">
                                <Ionicons name="receipt" size={24} color="#10B981" />
                                <Text className="text-2xl font-bold text-gray-800">24</Text>
                            </View>
                            <Text className="text-gray-600 text-sm">
                                {t('resturant.todayOrders')}
                            </Text>
                        </View>
                        <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm">
                            <View className="flex-row items-center justify-between mb-2">
                                <Ionicons name="cash" size={24} color="#F59E0B" />
                                <Text className="text-2xl font-bold text-gray-800">$485</Text>
                            </View>
                            <Text className="text-gray-600 text-sm">
                                {t('resturant.todayRevenue')}
                            </Text>
                        </View>
                    </View>
                </View>



                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">{t('resturant.quickActions')}</Text>
                    <View className="flex-row justify-between flex-wrap">



                        <DashboardItemButton
                            onPress={() => router.push('/restaurant/meal')}
                            icon={<Ionicons name="add-circle" size={32} color="#3B82F6" />}
                            title={t('resturant.addMenuItem')}

                        />


                        <DashboardItemButton
                            onPress={() => router.push('/restaurant/menu')}
                            icon={<Ionicons name="restaurant" size={32} color="#EF4444" />}
                            title={t('resturant.menu')}
                        />


                        <DashboardItemButton
                            onPress={() => router.push('/restaurant/orders')}
                            icon={<Ionicons name="list" size={32} color="#10B981" />}
                            title={t('resturant.viewOrders')}
                        />


                        <DashboardItemButton
                            onPress={() => router.push('/setting')}
                            icon={<Ionicons name="settings" size={32} color="#8B5CF6" />}
                            title={t('resturant.settings')}
                        />

                    </View>
                </View>

                {/* Recent Orders */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">{t('resturant.recentOrders')}</Text>
                    <View className="bg-white rounded-xl shadow-sm">
                        {[1, 2, 3].map((item, index) => (
                            <View key={index} className={`p-4 ${index < 2 ? 'border-b border-gray-100' : ''}`}>
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-800">Order #12{item + 34}</Text>
                                        <Text className="text-gray-600 text-sm">2 items • $25.50</Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full ${item === 1 ? 'bg-orange-100' : item === 2 ? 'bg-green-100' : 'bg-blue-100'}`}>
                                        <Text className={`text-sm font-medium ${item === 1 ? 'text-orange-600' : item === 2 ? 'text-green-600' : 'text-blue-600'}`}>
                                            {item === 1 ? 'Preparing' : item === 2 ? 'Ready' : 'New'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
