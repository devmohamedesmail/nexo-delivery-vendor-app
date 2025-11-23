import Colors from '@/constants/Colors'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'

export default function Loading() {
  const {t}=useTranslation();
  return (
    <View className='h-96 flex justify-center items-center '>
      <ActivityIndicator size="large" color={Colors.light.tabIconSelected} />
      <Text>{t('common.loading')}</Text>
    </View>
  )
}
