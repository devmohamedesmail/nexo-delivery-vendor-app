import useFetch from '@/hooks/useFetch'
import React, { useState, useContext } from 'react'
import { Text, View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth_context'
import CustomHeader from '@/components/custom/customheader'
import Select from '@/components/custom/Select'
import Loading from '@/components/custom/Loading'
import Input from '@/components/custom/Input'
import CustomButton from '@/components/custom/Button'
import CustomImagePicker from '@/components/custom/customimagepicker'
import { Toast } from 'toastify-react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

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

interface StoreFormValues {
  place_id: string
  store_type_id: string
  name: string
  logo: string
  banner: string
  address: string
  phone: string
  start_time: string
  end_time: string
  delivery_time: string
  delivery_fee: string
}

export default function Create() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { auth } = useContext(AuthContext)
  const { data: placesData, loading: loadingPlaces, error: errorPlaces } = useFetch('/places')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const isArabic = i18n.language === 'ar'
  
  // Time picker states
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [startTimeDate, setStartTimeDate] = useState(new Date())
  const [endTimeDate, setEndTimeDate] = useState(new Date())

  // Validation schema
  const validationSchema = Yup.object().shape({
    place_id: Yup.string().required(t('store.placeRequired') || 'Place is required'),
    store_type_id: Yup.string().required(t('store.storeTypeRequired') || 'Store type is required'),
    name: Yup.string().required(t('store.nameRequired') || 'Store name is required'),
    address: Yup.string().required(t('store.addressRequired') || 'Address is required'),
    phone: Yup.string().required(t('store.phoneRequired') || 'Phone is required'),
    start_time: Yup.string().required(t('store.startTimeRequired') || 'Start time is required'),
    end_time: Yup.string().required(t('store.endTimeRequired') || 'End time is required'),
    delivery_time: Yup.string().required(t('store.deliveryTimeRequired') || 'Delivery time is required'),
  })

  // Formik setup
  const formik = useFormik<StoreFormValues>({
    initialValues: {
      place_id: '',
      store_type_id: '',
      name: '',
      logo: '',
      banner: '',
      address: '',
      phone: '',
      start_time: '',
      end_time: '',
      delivery_time: '',
      delivery_fee: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)

      try {
        const formData = new FormData()
        
        // Add text fields
        formData.append('owner_user_id', auth.user.id.toString())
        formData.append('store_type_id', values.store_type_id)
        formData.append('name', values.name)
        formData.append('address', values.address)
        formData.append('phone', values.phone)
        formData.append('start_time', values.start_time)
        formData.append('end_time', values.end_time)
        formData.append('delivery_time', values.delivery_time)
        formData.append('delivery_fee', values.delivery_fee || '0')

        // Add images if selected
        if (values.logo) {
          const logoFile = {
            uri: values.logo,
            type: 'image/jpeg',
            name: 'logo.jpg',
          } as any
          formData.append('logo', logoFile)
        }

        if (values.banner) {
          const bannerFile = {
            uri: values.banner,
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
          formik.resetForm()
          router.push('/')
        } else {
          Toast.error(response.data.message || t('store.storeCreationFailed'))
        }

      } catch (error: any) {
        console.error('Store creation error:', error)
        Toast.error(error.response?.data?.message || t('store.storeCreationFailed') || 'Failed to create store')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  // Get the selected place object - Fix: Access data property correctly
  const selectedPlace = placesData?.data?.find((place: Place) => place.id.toString() === formik.values.place_id)

  // Get store types for the selected place
  const availableStoreTypes = selectedPlace?.storeTypes || []

  // Format places for dropdown - Fix: Access data property correctly
  const placeOptions = placesData?.data?.map((place: Place) => ({
    label: place.name,
    value: place.id.toString()
  })) || []

  // Format store types for dropdown
  const storeTypeOptions = availableStoreTypes.map((type: StoreType) => ({
    label: i18n.language === 'ar' ? type.name_ar : type.name_en,
    value: type.id.toString()
  }))

  const handlePlaceSelect = (value: string) => {
    formik.setFieldValue('place_id', value)
    // Reset store type when place changes
    formik.setFieldValue('store_type_id', '')
  }

  // Time picker handlers
  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setStartTimeDate(selectedDate)
      const hours = selectedDate.getHours().toString().padStart(2, '0')
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
      formik.setFieldValue('start_time', `${hours}:${minutes}`)
    }
  }

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setEndTimeDate(selectedDate)
      const hours = selectedDate.getHours().toString().padStart(2, '0')
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
      formik.setFieldValue('end_time', `${hours}:${minutes}`)
    }
  }

  if (loadingPlaces) {
    return <Loading />
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <CustomHeader title={t('store.createStore') || 'Create Store'} />
        
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* Subtitle */}
          <Text className={`text-gray-600 text-center mb-6 `} >
            {t('store.createStoreSubtitle') }
          </Text>

          {/* Form Card */}
          <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            {/* Section 1: Location & Type */}
            <View className="mb-6">
              <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                <Ionicons name="location-outline" size={24} color="#fd4a12" />
                <Text className="text-lg font-semibold text-gray-800 ml-2" >
                  {t('store.locationAndType')}
                </Text>
              </View>
              <View className="h-1 w-20 bg-primary rounded mb-4" />

              {/* Place Selection */}
              <Select
                label={t('store.selectPlace') || 'Select Place'}
                placeholder={t('store.choosePlacePlaceholder') || 'Choose a place'}
                value={formik.values.place_id}
                onSelect={handlePlaceSelect}
                options={placeOptions}
                error={formik.touched.place_id && formik.errors.place_id ? formik.errors.place_id : undefined}
              />

              {/* Store Type Selection - Only show when place is selected */}
              {formik.values.place_id && (
                <Select
                  label={t('store.selectStoreType') || 'Select Store Type'}
                  placeholder={t('store.chooseStoreTypePlaceholder') || 'Choose a store type'}
                  value={formik.values.store_type_id}
                  onSelect={(value: string) => formik.setFieldValue('store_type_id', value)}
                  options={storeTypeOptions}
                  disabled={availableStoreTypes.length === 0}
                  error={formik.touched.store_type_id && formik.errors.store_type_id ? formik.errors.store_type_id : undefined}
                />
              )}

              {/* Show message if no store types available */}
              {formik.values.place_id && availableStoreTypes.length === 0 && (
                <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                  <Text className="text-yellow-800 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
                    {t('store.noStoreTypesAvailable') || 'No store types available for this place'}
                  </Text>
                </View>
              )}
            </View>

            {/* Show form fields only when store type is selected */}
            {formik.values.store_type_id && (
              <>
                {/* Section 2: Store Information */}
                <View className="mb-6">
                  <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                    <Ionicons name="storefront-outline" size={24} color="#fd4a12" />
                    <Text className="text-lg font-semibold text-gray-800 ml-2" >
                      {t('store.storeInformation') || 'Store Information'}
                    </Text>
                  </View>
                  <View className="h-1 w-20 bg-primary rounded mb-4" />

                  {/* Store Name */}
                  <Input
                    label={t('store.storeName') || 'Store Name *'}
                    placeholder={t('store.enterStoreName') || 'Enter store name'}
                    value={formik.values.name}
                    onChangeText={formik.handleChange('name')}
                    keyboardType="default"
                    error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
                  />

                  {/* Address */}
                  <Input
                    label={t('store.storeAddress') || 'Address *'}
                    placeholder={t('store.enterAddress') || 'Enter address'}
                    value={formik.values.address}
                    onChangeText={formik.handleChange('address')}
                    keyboardType="default"
                    error={formik.touched.address && formik.errors.address ? formik.errors.address : undefined}
                  />

                  {/* Phone */}
                  <Input
                    label={t('store.storePhone') || 'Phone *'}
                    placeholder={t('store.enterPhone') || 'Enter phone number'}
                    value={formik.values.phone}
                    onChangeText={formik.handleChange('phone')}
                    keyboardType="phone-pad"
                    error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
                  />
                </View>

                {/* Section 3: Store Images */}
                <View className="mb-6">
                  <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                    <Ionicons name="images-outline" size={24} color="#fd4a12" />
                    <Text className="text-lg font-semibold text-gray-800 ml-2">
                      {t('store.storeImages')}
                    </Text>
                  </View>
                  <View className="h-1 w-20 bg-primary rounded mb-4" />

                  {/* Logo Image */}
                  <CustomImagePicker
                    label={t('store.storeLogo') || 'Store Logo'}
                    placeholder={t('store.selectLogo') || 'Tap to select logo'}
                    value={formik.values.logo}
                    onImageSelect={(uri) => formik.setFieldValue('logo', uri)}
                    aspect={[1, 1]}
                    allowsEditing={true}
                  />

                  {/* Banner Image */}
                  <CustomImagePicker
                    label={t('store.storeBanner') || 'Store Banner'}
                    placeholder={t('store.selectBanner') || 'Tap to select banner'}
                    value={formik.values.banner}
                    onImageSelect={(uri) => formik.setFieldValue('banner', uri)}
                    aspect={[16, 9]}
                    allowsEditing={true}
                  />
                </View>

                {/* Section 4: Operating Hours */}
                <View className="mb-6">
                  <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                    <Ionicons name="time-outline" size={24} color="#fd4a12" />
                    <Text className="text-lg font-semibold text-gray-800 ml-2" >
                      {t('store.operatingHours')}
                    </Text>
                  </View>
                  <View className="h-1 w-20 bg-primary rounded mb-4" />

                  {/* Start Time */}
                  <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-2" style={{ fontFamily: 'Cairo_500Medium' }}>
                      {t('store.startTime')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowStartTimePicker(true)}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-row items-center justify-between"
                    >
                      <Text className={formik.values.start_time ? 'text-gray-900' : 'text-gray-400'}>
                        {formik.values.start_time || t('store.selectStartTime')}
                      </Text>
                      <Ionicons name="time" size={20} color="#fd4a12" />
                    </TouchableOpacity>
                    {formik.touched.start_time && formik.errors.start_time && (
                      <Text className="text-red-500 text-sm mt-1">{formik.errors.start_time}</Text>
                    )}
                  </View>

                  {/* End Time */}
                  <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-2">
                      {t('store.endTime')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowEndTimePicker(true)}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-row items-center justify-between"
                    >
                      <Text className={formik.values.end_time ? 'text-gray-900' : 'text-gray-400'}>
                        {formik.values.end_time || t('store.selectEndTime') }
                      </Text>
                      <Ionicons name="time" size={20} color="#fd4a12" />
                    </TouchableOpacity>
                    {formik.touched.end_time && formik.errors.end_time && (
                      <Text className="text-red-500 text-sm mt-1">{formik.errors.end_time}</Text>
                    )}
                  </View>

                  {/* Time Pickers */}
                  {showStartTimePicker && (
                    <DateTimePicker
                      value={startTimeDate}
                      mode="time"
                      is24Hour={true}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleStartTimeChange}
                    />
                  )}

                  {showEndTimePicker && (
                    <DateTimePicker
                      value={endTimeDate}
                      mode="time"
                      is24Hour={true}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleEndTimeChange}
                    />
                  )}
                </View>

                {/* Section 5: Delivery Details */}
                <View className="mb-6">
                  <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                    <Ionicons name="bicycle-outline" size={24} color="#fd4a12" />
                    <Text className="text-lg font-semibold text-gray-800 ml-2">
                      {t('store.deliveryDetails')}
                    </Text>
                  </View>
                  <View className="h-1 w-20 bg-primary rounded mb-4" />

                  {/* Delivery Time */}
                  <Input
                    label={t('store.deliveryTime') || 'Delivery Time * (minutes)'}
                    placeholder={t('store.enterDeliveryTime')}
                    value={formik.values.delivery_time}
                    onChangeText={formik.handleChange('delivery_time')}
                    keyboardType="numeric"
                    error={formik.touched.delivery_time && formik.errors.delivery_time ? formik.errors.delivery_time : undefined}
                  />

                  {/* Delivery Fee */}
                  <Input
                    label={t('store.deliveryFee') || 'Delivery Fee (optional)'}
                    placeholder={t('store.enterDeliveryFee') || 'Enter delivery fee'}
                    value={formik.values.delivery_fee}
                    onChangeText={formik.handleChange('delivery_fee')}
                    keyboardType="numeric"
                  />
                </View>

                {/* Submit Button */}
                <View className="mt-4">
                  {isSubmitting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      title={t('store.createStoreButton') || 'Create Store'}
                      onPress={formik.handleSubmit}
                    />
                  )}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}