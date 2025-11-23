import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'



export default function NoProductsFound() {
    const { t } = useTranslation()
    return (
        <View className="items-center justify-center py-20">
            <Ionicons name="cube-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-lg" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                {t('products.no_products')}
            </Text>
            <Text className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                {t('products.add_first_product')}
            </Text>
        </View>
    )
}
