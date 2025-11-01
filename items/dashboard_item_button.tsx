import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, Text } from 'react-native'



export default function DashboardItemButton({ onPress, icon, title }: any) {

const {t, i18n}= useTranslation();
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm items-center w-1/2">
            {icon}
            <Text className={`text-gray-800 mt-2 text-center font-medium ${i18n.language === 'ar' ? 'arabic-font' : ''}`}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}
