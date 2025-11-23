import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { View } from 'react-native'

export default function Skeleton(
    { w = 44, h = 12, rounded = 'md' }: any
) {
    return (
        <View className={` mb-4 flex items-end justify-center my-1 mx-2`} style={{
            width: w,
            height: h,
            borderRadius: rounded === 'full' ? h / 2 : 8, // Assuming 'md' corresponds to 8px radius
        }}>
           
            <LinearGradient
                colors={['#e5e5e5', '#dee2e6', '#e5e5e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: rounded === 'full' ? h / 2 : 8,
                }}
            >
            </LinearGradient>
        </View>
    )
}
