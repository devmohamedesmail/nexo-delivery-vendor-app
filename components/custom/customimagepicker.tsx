import React, { useState } from 'react'
import { View, Text, Alert, TouchableOpacity, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

interface CustomImagePickerProps {
  label?: string
  placeholder?: string
  changeText?: string
  value?: string
  onImageSelect: (imageUri: string) => void
  error?: string
  touched?: boolean
  aspect?: [number, number]
  quality?: number
  allowsEditing?: boolean
}

export default function CustomImagePicker({
  label = "Image",
  placeholder = "Tap to select image",
  // changeText = "Tap to change image",
  value,
  onImageSelect,
  error,
  touched,
  aspect = [1, 1],
  quality = 1,
  allowsEditing = false
}: CustomImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(value)
  const { t , i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!')
        return
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing,
        aspect,
        quality,
      })

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri
        setSelectedImage(imageUri)
        onImageSelect(imageUri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const pickImageFromCamera = async () => {
    try {
      // Request camera permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!')
        return
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect,
        quality,
      })

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri
        setSelectedImage(imageUri)
        onImageSelect(imageUri)
      }
    } catch (error) {
      console.error('Error taking photo:', error)
      Alert.alert('Error', 'Failed to take photo')
    }
  }

  const showImageOptions = () => {
    Alert.alert(
    
      t('common.selectImage'),
      t('common.chooseImageSource'),
      [
        { text: t('common.camera'), onPress: pickImageFromCamera },
        { text: t('common.gallery'), onPress: pickImage },
        { text: t('common.cancel'), style: 'cancel' }
      ]
    )
  }

  // Use value prop if provided, otherwise use internal state
  const displayImage = value || selectedImage

  return (
    <View className="mb-4">
      <Text
        className={`text-gray-700 text-base font-medium mb-2 ${isArabic ? 'text-right' : 'text-left'}`}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={showImageOptions}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center min-h-[120px]"
      >
        {displayImage ? (
          <View className="items-center">
            <Image
              source={{ uri: displayImage }}
              className="w-20 h-20 rounded-lg mb-2"
              resizeMode="cover"
            />
            {/* <Text
              className="text-blue-600 text-sm"
              
            >
              {changeText} 
            </Text> */}
          </View>
        ) : (
          <View className="items-center">
            <Ionicons name="camera" size={32} color="#9CA3AF" />
            <Text
              className={`text-gray-500 mt-2 ${isArabic ? 'text-right' : 'text-center'}`}

            >
              {placeholder}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {touched && error && (
        <Text
          className="text-red-500 mt-1 text-sm"
          style={{ fontFamily: 'Cairo_400Regular' }}
        >
          {error}
        </Text>
      )}
    </View>
  )
}
