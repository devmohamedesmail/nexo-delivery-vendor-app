import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import NotificationIcon from '../common/notification-icon'

export default function Header({ title }: { title?: string }) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <View className="bg-black px-6 py-4 shadow-sm pt-20 ">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-gray-200 rounded-full"
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>

        <Text
          className="text-xl font-bold text-white"
        >
          {title}
        </Text>

        <NotificationIcon />
      </View>
    </View>
  )
}
