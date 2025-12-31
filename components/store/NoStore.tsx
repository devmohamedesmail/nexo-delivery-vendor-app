import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Button from '../ui/button'

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
      <Text className="text-2xl font-bold text-text text-center mb-4">
        {t('store.noStoreTitle')}
      </Text>

      {/* Message */}
      <Text className="text-base text-gray-600 text-center mb-8 px-4 leading-6">
        {t('store.noStoreMessage')}
      </Text>

      {/* Create Store Button */}



      <View className='flex flex-row justify-between  space-x-4 p-2 w-full gap-5'>



        <TouchableOpacity
          onPress={handleCreateStore}
          className="bg-primary rounded-xl px-8 py-4 flex-row items-center shadow-lg flex-1 w-1/2"
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="text-white text-lg font-semibold ml-2" >
            {t('store.createStoreButton')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/account')}
          className="bg-black rounded-xl px-8 py-4 flex-row items-center shadow-lg w-1/2"
          activeOpacity={0.8}
        >
          <FontAwesome name="user-o" size={24} color="white" />

          <Text className="text-white text-lg font-semibold ml-2" >
            {t('account.account')}
          </Text>
        </TouchableOpacity>
      </View>



    </View>
  )
}