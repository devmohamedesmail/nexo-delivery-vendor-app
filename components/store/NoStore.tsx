import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function NoStore() {
  const { t } = useTranslation()
  const router = useRouter()

  const handleCreateStore = () => {
    router.push('/stores/create')
  }

  return (
    <View className="flex-1 bg-background justify-center items-center px-6">
      {/* Icon Container */}
      <View className="mb-8">
        <View className="w-32 h-32 bg-primary/10 rounded-full justify-center items-center">
          <Ionicons name="storefront-outline" size={64} color="#fd4a12" />
        </View>
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-text text-center mb-4" style={{ fontFamily: 'Cairo_700Bold' }}>
        {t('store.noStoreTitle')}
      </Text>

      {/* Message */}
      <Text className="text-base text-gray-600 text-center mb-8 px-4 leading-6" style={{ fontFamily: 'Cairo_400Regular' }}>
        {t('store.noStoreMessage')}
      </Text>

      {/* Create Store Button */}
      <TouchableOpacity
        onPress={handleCreateStore}
        className="bg-primary rounded-xl px-8 py-4 flex-row items-center shadow-lg"
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text className="text-white text-lg font-semibold ml-2" style={{ fontFamily: 'Cairo_600SemiBold' }}>
          {t('store.createStoreButton')}
        </Text>
      </TouchableOpacity>

      {/* Additional Info */}
      <View className="mt-8 bg-white rounded-xl p-4 shadow-sm w-full">
        <View className="flex-row items-start mb-3">
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text className="text-gray-700 ml-2 flex-1 text-sm" style={{ fontFamily: 'Cairo_400Regular' }}>
            {t('store.manageMenuOrders')}
          </Text>
        </View>
        <View className="flex-row items-start mb-3">
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text className="text-gray-700 ml-2 flex-1 text-sm" style={{ fontFamily: 'Cairo_400Regular' }}>
            {t('store.trackPerformance')}
          </Text>
        </View>
        <View className="flex-row items-start">
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text className="text-gray-700 ml-2 flex-1 text-sm" style={{ fontFamily: 'Cairo_400Regular' }}>
            {t('store.reachCustomers')}
          </Text>
        </View>
      </View>
    </View>
  )
}