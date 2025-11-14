import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';




interface CustomInputProps {
  label?: string
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  type?: 'text' | 'email' | 'password' | 'phone'
  error?: string
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad',


}

export default function Input({ label, placeholder, value, onChangeText, keyboardType, error, type }: CustomInputProps) {
  const { t, i18n } = useTranslation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const isPassword = type === 'password'

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <View className='mb-3 '>
      <Text
        className={`mb-2  ${i18n.language === "ar" ? 'text-right' : 'text-left'}`}>{label}
      </Text>

      <View className={`flex-row items-center border border-gray-500 rounded-md px-2 ${inputFocused ? 'bg-gray-100 border-primary' : ''} ${i18n.language === "ar" ? 'flex-row-reverse' : ''} `}>
        <TextInput
          className={`  ${i18n.language === "ar" ? 'text-right' : ''}  border-gray-300 p-2 rounded-md  flex-1 focus:border-primary py-4  focus:outline-none`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}


        />
        {isPassword && (
          <TouchableOpacity className={` text-gray-400`} onPress={togglePasswordVisibility}>
            <Text>{isPasswordVisible ? <Entypo name="eye-with-line" size={24} color="black" /> : <Entypo name="eye" size={24} color="black" />}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className='text-red-500 mt-1'>{error}</Text>}
    </View>
  )
}
