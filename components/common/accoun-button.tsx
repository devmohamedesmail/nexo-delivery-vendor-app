import React from 'react'
import { TouchableOpacity, View, Text, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import LanguageSwitcher from './language-switcher'


export default function AccountButton({item}:any) {

    const isDestructive = item.id === 'delete_account'
    const isLogout = item.id === 'logout'

  return (
     <TouchableOpacity
        key={item.id}
        onPress={item.type !== 'toggle' ? item.action : undefined}
        className="bg-white px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
        activeOpacity={0.7}
      >
        <View className=" flex-row items-center flex-1 ">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              isDestructive ? 'bg-red-50' : isLogout ? 'bg-orange-50' : 'bg-primary/10'
            }`}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={isDestructive ? '#EF4444' : isLogout ? '#F97316' : '#fd4a12'}
            />
          </View>

          <View className="flex-1">
            <Text
              className={`font-semibold ${isDestructive ? 'text-red-600' : isLogout ? 'text-orange-600' : 'text-gray-800'
                }`}
              
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text
                className="text-gray-500 text-sm mt-1"
                
              >
                {item.subtitle}
              </Text>
            )}
          </View>
        </View>

        <View className="ml-3">
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.action}
              trackColor={{ false: '#E5E7EB', true: '#fd4a12' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          )}

          {item.type === 'language' && (
            <LanguageSwitcher />
          )}

          {(item.type === 'navigation' || item.type === 'action') && (
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>
  )
}
