import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';


export default function ErrorMessage() {
    const [refreshing, setRefreshing] = useState(false);
    const {t}=useTranslation();

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <View className="flex-1 items-center justify-center px-8">
            <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-4">
                <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
            </View>
            <Text className="text-gray-900 text-xl font-bold mb-2" style={{ fontFamily: 'Cairo_700Bold' }}>
             
                {t('common.failed_load')}
            </Text>
            <Text className="text-gray-500 text-center leading-6" style={{ fontFamily: 'Cairo_400Regular' }}>
                
                {t('common.check_connection')}
            </Text>
            <TouchableOpacity
                onPress={onRefresh}
                className="bg-gray-900 px-6 py-3 rounded-xl mt-4"
            >
                <Text className="text-white font-semibold" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                  
                    {t('common.try_again')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
