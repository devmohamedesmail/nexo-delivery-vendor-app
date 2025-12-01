import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

import { DimensionValue } from 'react-native'

type SkeletonProps = {
  width?: DimensionValue
  height?: DimensionValue
  rounded?: number
  className?: string
}

export default function Skeleton({
  width = '100%',
  height = 20,
  rounded = 8,
  className = '',
}: SkeletonProps) {
  const translateX = useSharedValue(-1)

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [-1, 1],
            [-200, 200]
          ),
        },
      ],
    }
  })

  return (
    <View
      style={{ width: width as DimensionValue, height: height as DimensionValue, borderRadius: rounded, overflow: 'hidden' }}
      className={`bg-gray-200 dark:bg-gray-700 ${className}`}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            height: '100%',
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>
    </View>
  )
}
