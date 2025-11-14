import useFetch from '@/hooks/useFetch'
import React, { useState, useContext } from 'react'
import { Text, View, ScrollView, SafeAreaView, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth_context'
import CustomHeader from '@/components/custom/customheader'
import Select from '@/components/custom/Select'
import Loading from '@/components/custom/Loading'
import Input from '@/components/custom/Input'
import CustomButton from '@/components/custom/custombutton'
import CustomImagePicker from '@/components/custom/customimagepicker'
import { Toast } from 'toastify-react-native'

interface StoreType {
  id: number
  name_en: string
  name_ar: string
  description: string | null
}

interface Place {
  id: number
  name: string
  address: string
  latitude: string
  longitude: string
  createdAt: string
  updatedAt: string
  storeTypes: StoreType[]
}

export default function Create() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { auth } = useContext(AuthContext)
  const { data: placesData, loading: loadingPlaces, error: errorPlaces } = useFetch('/places')
  
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('')
  const [selectedStoreTypeId, setSelectedStoreTypeId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')
  const [logo, setLogo] = useState<string>('')
  const [banner, setBanner] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [deliveryTime, setDeliveryTime] = useState<string>('')
  const [deliveryFee, setDeliveryFee] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Get the selected place object
  const selectedPlace = placesData?.find((place: Place) => place.id.toString() === selectedPlaceId)

  // Get store types for the selected place
  const availableStoreTypes = selectedPlace?.storeTypes || []

  // Format places for dropdown
  const placeOptions = placesData?.map((place: Place) => ({
    label: place.name,
    value: place.id.toString()
  })) || []

  // Format store types for dropdown
  const storeTypeOptions = availableStoreTypes.map((type: StoreType) => ({
    label: i18n.language === 'ar' ? type.name_ar : type.name_en,
    value: type.id.toString()
  }))

  const handlePlaceSelect = (value: string) => {
    setSelectedPlaceId(value)
    // Reset store type when place changes
    setSelectedStoreTypeId('')
  }

  const handleSubmit = async () => {
    // Validation
    if (!storeName || !selectedStoreTypeId || !address || !phone || !startTime || !endTime || !deliveryTime) {
      Toast.error(t('store.fillAllFields') || 'Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Add text fields
      formData.append('owner_user_id', auth.user.id.toString())
      formData.append('store_type_id', selectedStoreTypeId)
      formData.append('name', storeName)
      formData.append('address', address)
      formData.append('phone', phone)
      formData.append('start_time', startTime)
      formData.append('end_time', endTime)
      formData.append('delivery_time', deliveryTime)
      formData.append('delivery_fee', deliveryFee || '0')

      // Add images if selected
      if (logo) {
        const logoFile = {
          uri: logo,
          type: 'image/jpeg',
          name: 'logo.jpg',
        } as any
        formData.append('logo', logoFile)
      }

      if (banner) {
        const bannerFile = {
          uri: banner,
          type: 'image/jpeg',
          name: 'banner.jpg',
        } as any
        formData.append('banner', bannerFile)
      }

      const response = await axios.post(`${config.URL}/stores/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${auth.token}`
        }
      })

      if (response.data.success) {
        Toast.success(t('store.storeCreatedSuccess') || 'Store created successfully!')
        router.back()
      } else {
        Toast.error(response.data.message || t('store.storeCreationFailed'))
      }

    } catch (error: any) {
      console.error('Store creation error:', error)
      Toast.error(error.response?.data?.message || t('store.storeCreationFailed') || 'Failed to create store')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingPlaces) {
    return <Loading />
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CustomHeader title={t('store.createStore') || 'Create Store'} />
      
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Place Selection */}
        <Select
          label={t('store.selectPlace') || 'Select Place'}
          placeholder={t('store.choosePlacePlaceholder') || 'Choose a place'}
          value={selectedPlaceId}
          onSelect={handlePlaceSelect}
          options={placeOptions}
        />

        {/* Store Type Selection - Only show when place is selected */}
        {selectedPlaceId && (
          <Select
            label={t('store.selectStoreType') || 'Select Store Type'}
            placeholder={t('store.chooseStoreTypePlaceholder') || 'Choose a store type'}
            value={selectedStoreTypeId}
            onSelect={setSelectedStoreTypeId}
            options={storeTypeOptions}
            disabled={availableStoreTypes.length === 0}
          />
        )}

        {/* Show message if no store types available */}
        {selectedPlaceId && availableStoreTypes.length === 0 && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <Text className="text-yellow-800 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
              {t('store.noStoreTypesAvailable') || 'No store types available for this place'}
            </Text>
          </View>
        )}

        {/* Show form fields only when store type is selected */}
        {selectedStoreTypeId && (
          <>
            {/* Store Name */}
            <Input
              label={t('store.storeName') || 'Store Name *'}
              placeholder={t('store.enterStoreName') || 'Enter store name'}
              value={storeName}
              onChangeText={setStoreName}
              keyboardType="default"
            />

            {/* Logo Image */}
            <CustomImagePicker
              label={t('store.storeLogo') || 'Store Logo'}
              placeholder={t('store.selectLogo') || 'Tap to select logo'}
              value={logo}
              onImageSelect={setLogo}
              aspect={[1, 1]}
              allowsEditing={true}
            />

            {/* Banner Image */}
            <CustomImagePicker
              label={t('store.storeBanner') || 'Store Banner'}
              placeholder={t('store.selectBanner') || 'Tap to select banner'}
              value={banner}
              onImageSelect={setBanner}
              aspect={[16, 9]}
              allowsEditing={true}
            />

            {/* Address */}
            <Input
              label={t('store.storeAddress') || 'Address *'}
              placeholder={t('store.enterAddress') || 'Enter address'}
              value={address}
              onChangeText={setAddress}
              keyboardType="default"
            />

            {/* Phone */}
            <Input
              label={t('store.storePhone') || 'Phone *'}
              placeholder={t('store.enterPhone') || 'Enter phone number'}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            {/* Start Time */}
            <Input
              label={t('store.startTime') || 'Start Time * (e.g., 09:00)'}
              placeholder={t('store.enterStartTime') || 'Enter start time'}
              value={startTime}
              onChangeText={setStartTime}
              keyboardType="default"
            />

            {/* End Time */}
            <Input
              label={t('store.endTime') || 'End Time * (e.g., 22:00)'}
              placeholder={t('store.enterEndTime') || 'Enter end time'}
              value={endTime}
              onChangeText={setEndTime}
              keyboardType="default"
            />

            {/* Delivery Time */}
            <Input
              label={t('store.deliveryTime') || 'Delivery Time * (minutes)'}
              placeholder={t('store.enterDeliveryTime') || 'Enter delivery time'}
              value={deliveryTime}
              onChangeText={setDeliveryTime}
              keyboardType="numeric"
            />

            {/* Delivery Fee */}
            <Input
              label={t('store.deliveryFee') || 'Delivery Fee (optional)'}
              placeholder={t('store.enterDeliveryFee') || 'Enter delivery fee'}
              value={deliveryFee}
              onChangeText={setDeliveryFee}
              keyboardType="numeric"
            />

            {/* Submit Button */}
            <View className="mb-8 mt-4">
              <CustomButton
                title={isSubmitting ? t('store.creating') || 'Creating...' : t('store.createStoreButton') || 'Create Store'}
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

 