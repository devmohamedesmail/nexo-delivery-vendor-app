import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { Toast } from 'toastify-react-native'
import MenuItem from '@/items/mealitem'
import CustomLoading from '@/components/custom/Loading'
import CustomHeader from '@/components/custom/customheader'
import useFetch from '@/hooks/useFetch'

interface MenuItem {
  id: number
  restaurant_id: number
  title: string
  description: string
  price: string
  image: string
  createdAt: string
  updatedAt: string
}

export default function Menu() {
  const { t } = useTranslation()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const {data , loading , error} = useFetch('/menu/restaurant/72');
 

  const onRefresh = () => {
    setRefreshing(true)
    
  }

  if (loading) {
    return (

      <CustomLoading
        variant="pulse"
        overlay={true}
        text="Processing your order..."
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
              {t('resturant.menu')}
            </Text>
            <Text
              className="text-sm text-gray-500 text-center mt-1"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
             
              {t('resturant.manage_your_menu_items')}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => router.push('/restaurant/meal')}
            className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-md"
          >
            <Ionicons name="add" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data && data.length === 0 ? (
          /* Empty State */
          <View className="flex-1 justify-center items-center px-6" style={{ minHeight: 400 }}>
            <View className="bg-white rounded-3xl p-8 items-center shadow-sm w-full max-w-sm">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
                <Ionicons name="restaurant" size={40} color="#3B82F6" />
              </View>
              
              <Text
                className="text-gray-800 text-xl font-bold mb-3 text-center"
                style={{ fontFamily: 'Cairo_700Bold' }}
              >
                {t('no_menu_items_yet')}
              </Text>
              
              <Text
                className="text-gray-500 text-center mb-8 leading-6"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                {t('start_building_menu')}
              </Text>
              
              <TouchableOpacity
                onPress={() => router.push('/restaurant/meal')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 rounded-xl shadow-lg w-full"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="add-circle" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text
                    className="text-white font-bold text-base"
                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                  >
                    {t('add_first_meal')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Menu Items List */
          <View className="px-6 py-6">
            {/* Stats Card */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: 'Cairo_700Bold' }}
                  >
                    {data.length}
                  </Text>
                  <Text
                    className="text-gray-500 mt-1"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                  >
                    {t('resturant.menu_items')}
                  </Text>
                </View>
                
                <View className="flex-row items-center bg-green-100 px-3 py-2 rounded-full">
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text
                    className="text-green-700 font-medium ml-1"
                    style={{ fontFamily: 'Cairo_500Medium' }}
                  >
                    Active
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row mb-6 space-x-3">
              <TouchableOpacity
                onPress={() => router.push('/restaurant/meal')}
                className="flex-1 bg-primary py-4 rounded-xl shadow-sm"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="add" size={20} color="white" />
                  <Text
                    className="text-white font-semibold ml-2"
                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                  >
                    {t('resturant.add_menu_item')}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity className="bg-white border border-gray-200 py-4 px-6 rounded-xl shadow-sm">
                <Ionicons name="filter" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Menu Items Grid */}
            <View className="space-y-4">
              {data.map((item: any, index: number) => (
                <View key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <MenuItem item={item} />
                </View>
              ))}
            </View>

            {/* Add More Button */}
            <TouchableOpacity
              onPress={() => router.push('/restaurant/meal')}
              className="bg-gray-100 border-2 border-dashed border-gray-300 py-6 rounded-2xl items-center mt-6"
            >
              <Ionicons name="add-circle-outline" size={32} color="#9CA3AF" />
              <Text
                className="text-gray-500 font-medium mt-2"
                style={{ fontFamily: 'Cairo_500Medium' }}
              >
                {t('resturant.add_menu_item')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
