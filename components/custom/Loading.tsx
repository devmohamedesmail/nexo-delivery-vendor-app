import React from 'react'
import { View, ActivityIndicator } from 'react-native'

interface CustomLoadingProps {
  color?: string
}

export default function Loading({ color = '#3B82F6' }: CustomLoadingProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={color} />
    </View>
  )
}
