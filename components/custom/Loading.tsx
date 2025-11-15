import React from 'react'
import { View, ActivityIndicator } from 'react-native'

interface CustomLoadingProps {
  color?: string
}

export default function Loading({ color = '#fd4a12' }: CustomLoadingProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color={color} />
    </View>
  )
}
