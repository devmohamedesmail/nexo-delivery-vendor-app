import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { AuthContext } from '@/context/auth_context'
import { useContext } from 'react'
import { useRouter } from 'expo-router'
import NoStore from './store/NoStore'



export default function RestaurantHomeScreen() {
  const { t } = useTranslation()
  const { auth } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const [description, setDescription] = useState('')

  return (
    <View className="flex-1 bg-gray-50 pt-10">
      {auth && auth.user.store ? (<>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

        {/* Header */}
        <View className="bg-white px-6 py-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <View>
              <Text
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: 'Cairo_700Bold' }}
              >
                {auth.user?.restaurantName || t('myRestaurant')}
              </Text>
              <Text
                className="text-gray-600"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                {t('restaurantDashboard')}
              </Text>
            </View>
            <LanguageSwitcher />
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between">
            <View className="bg-blue-500 rounded-xl p-4 flex-1 mr-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className="text-white text-sm opacity-80"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                  >
                    {t('todaysOrders')}
                  </Text>
                  <Text
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: 'Cairo_700Bold' }}
                  >
                    24
                  </Text>
                </View>
                <Ionicons name="receipt-outline" size={24} color="white" />
              </View>
            </View>

            <View className="bg-green-500 rounded-xl p-4 flex-1 ml-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className="text-white text-sm opacity-80"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                  >
                    {t('revenue')}
                  </Text>
                  <Text
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: 'Cairo_700Bold' }}
                  >
                    $567
                  </Text>
                </View>
                <Ionicons name="trending-up" size={24} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* Navigation Cards */}
        <ScrollView className="flex-1 px-6">
          {/* Orders Management */}
          <TouchableOpacity
            onPress={() => router.push('/restaurant/orders')}
            className="bg-white rounded-xl shadow-sm p-5 mb-4"
          >
            <View className="flex-row items-center">
              <View className="bg-orange-100 p-3 rounded-full mr-4">
                <MaterialIcons name="restaurant-menu" size={24} color="#EA580C" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-gray-800"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('manageOrders')}
                </Text>
                <Text
                  className="text-gray-600 text-sm mt-1"
                  style={{ fontFamily: 'Cairo_400Regular' }}
                >
                  {t('viewAndProcessOrders')}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center mr-2">
                  <Text className="text-white text-xs font-bold">3</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </View>
          </TouchableOpacity>




          {/* Menu Management */}
          <TouchableOpacity
            onPress={() => router.push('/restaurant/menu')}
            className="bg-white rounded-xl shadow-sm p-5 mb-4"
          >
            <View className="flex-row items-center">
              <View className="bg-green-100 p-3 rounded-full mr-4">
                <Ionicons name="menu" size={24} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-gray-800"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('menuManagement')}
                </Text>
                <Text
                  className="text-gray-600 text-sm mt-1"
                  style={{ fontFamily: 'Cairo_400Regular' }}
                >
                  {t('editMenuAndPrices')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Add New Meal */}
          <TouchableOpacity
            onPress={() => router.push('/restaurant/meal')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 mb-4"
          >
            <View className="flex-row items-center">
              <View className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                <Ionicons name="add-circle" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('addNewMeal')}
                </Text>
                <Text
                  className="text-white text-sm mt-1 opacity-90"
                  style={{ fontFamily: 'Cairo_400Regular' }}
                >
                  {t('createDeliciousDish')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          {/* Restaurant Info */}
          <TouchableOpacity
            onPress={() => Alert.alert(t('comingSoon'), t('restaurantInfoComingSoon'))}
            className="bg-white rounded-xl shadow-sm p-5 mb-4"
          >
            <View className="flex-row items-center">
              <View className="bg-blue-100 p-3 rounded-full mr-4">
                <Ionicons name="storefront" size={24} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-gray-800"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('restaurantInfo')}
                </Text>
                <Text
                  className="text-gray-600 text-sm mt-1"
                  style={{ fontFamily: 'Cairo_400Regular' }}
                >
                  {t('updateRestaurantDetails')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Analytics */}
          <TouchableOpacity
            onPress={() => Alert.alert(t('comingSoon'), t('analyticsComingSoon'))}
            className="bg-white rounded-xl shadow-sm p-5 mb-4"
          >
            <View className="flex-row items-center">
              <View className="bg-purple-100 p-3 rounded-full mr-4">
                <Ionicons name="analytics" size={24} color="#7C3AED" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-gray-800"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('analytics')}
                </Text>
                <Text
                  className="text-gray-600 text-sm mt-1"
                  style={{ fontFamily: 'Cairo_400Regular' }}
                >
                  {t('viewSalesAndReports')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            onPress={() => router.push('/account')}
            className="bg-white rounded-xl shadow-sm p-5 mb-6"
          >
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-3 rounded-full mr-4">
                <Ionicons name="settings" size={24} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-gray-800"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('settings')}
                </Text>
                <Text
                  className="text-gray-600 text-sm mt-1"
                  style={{ fontFamily: 'Cairo_400Regular' }}
                >
                  {t('appPreferencesAndAccount')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </>) : (
        <NoStore />
      )}

    </View>
  )
}
