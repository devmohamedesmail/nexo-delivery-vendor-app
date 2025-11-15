import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

interface CustomButtonProps {
  title: string
  onPress: () => void
  icon?: React.ReactNode
  disabled?: boolean
  [key: string]: any
}

export default function CustomButton({ title, onPress, icon, disabled = false, ...props }: CustomButtonProps) {
    return (
        <View className='my-2'>
            <TouchableOpacity 
                onPress={disabled ? undefined : onPress} 
                disabled={disabled}
                {...props}
                className={`p-4 px-10 rounded-lg mt-4 ${
                    disabled 
                        ? 'bg-gray-300' 
                        : 'bg-primary'
                }`}
            >
                <View className='flex-row justify-center items-center space-x-2'>
                    <Text 
                        className={` mx-2 arabic-font ${
                            disabled 
                                ? 'text-gray-500' 
                                : 'text-white'
                        }`}
                        style={{ fontFamily: 'Cairo_600SemiBold' }}
                    >
                        {title}
                    </Text>
                    {icon}
                </View>
            </TouchableOpacity>
        </View>
    )
}
