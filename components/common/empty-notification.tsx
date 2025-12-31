import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

export default function EmptyNotification() {
    const { t } = useTranslation()
    return (
        <View className="flex-1 justify-center items-center px-8 py-20">
            <View className="bg-gray-100 rounded-full p-8 mb-6">
                <Ionicons name="notifications-outline" size={48} color="#9CA3AF" />
            </View>

            <Text
                className="text-xl font-bold text-gray-800 mb-3 text-center"
                style={{ fontFamily: 'Cairo_700Bold' }}
            >
                {t('notifications.noNotifications')}
            </Text>

            <Text
                className="text-gray-500 text-center text-base leading-6"
            >
                {t('notifications.noNotificationsDesc')}
            </Text>
        </View>
    )
}
