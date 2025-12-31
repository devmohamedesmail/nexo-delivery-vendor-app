import Header from '@/components/ui/Header'
import Layout from '@/components/ui/Layout'
import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth-provider'
import Input from '@/components/ui/Input'
import CustomButton from '@/components/ui/button'
import CustomImagePicker from '@/components/ui/customimagepicker'
import { Toast } from 'toastify-react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import Loading from '@/components/ui/Loading'

interface StoreFormValues {
  name: string
  logo: string
  banner: string
  address: string
  phone: string
  start_time: string
  end_time: string
}

export default function Update() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { auth } = useContext(AuthContext)
  const { data } = useLocalSearchParams()
  const storeData = data ? JSON.parse(data as string) : null
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const isArabic = i18n.language === 'ar'
  
  // Initialize time dates from store data
  const parseTime = (timeString: string) => {
    if (!timeString) return new Date()
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return date
  }

  // Time picker states
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [startTimeDate, setStartTimeDate] = useState(
    storeData?.start_time ? parseTime(storeData.start_time) : new Date()
  )
  const [endTimeDate, setEndTimeDate] = useState(
    storeData?.end_time ? parseTime(storeData.end_time) : new Date()
  )

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('store.nameRequired')),
    address: Yup.string().required(t('store.addressRequired') || 'Address is required'),
    phone: Yup.string().required(t('store.phoneRequired')),
    start_time: Yup.string().required(t('store.startTimeRequired') || 'Start time is required'),
    end_time: Yup.string().required(t('store.endTimeRequired') || 'End time is required'),
  })

  // Formik setup
  const formik = useFormik<StoreFormValues>({
    initialValues: {
      name: storeData?.name || '',
      logo: storeData?.logo || '',
      banner: storeData?.banner || '',
      address: storeData?.address || '',
      phone: storeData?.phone || '',
      start_time: storeData?.start_time || '',
      end_time: storeData?.end_time || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)

      try {
        const formData = new FormData()
        
        // Append required fields (ensure they're not empty)
        if (!values.name || !values.address || !values.phone) {
          Toast.show({
            type: 'error',
            text1: t('store.fillAllRequiredFields') || 'Please fill all required fields',
            position: 'bottom',
            visibilityTime: 2000,
          })
          setIsSubmitting(false)
          return
        }

        formData.append('name', values.name)
        formData.append('address', values.address)
        formData.append('phone', values.phone)
        
        // Only append times if they exist
        if (values.start_time) {
          formData.append('start_time', values.start_time)
        }
        if (values.end_time) {
          formData.append('end_time', values.end_time)
        }

        // Add images if selected
        if (values.logo && values.logo !== storeData?.logo) {
          const logoFile = {
            uri: values.logo,
            type: 'image/jpeg',
            name: 'logo.jpg',
          } as any
          formData.append('logo', logoFile)
        }

        if (values.banner && values.banner !== storeData?.banner) {
          const bannerFile = {
            uri: values.banner,
            type: 'image/jpeg',
            name: 'banner.jpg',
          } as any
          formData.append('banner', bannerFile)
        }

        console.log('Updating store with ID:', storeData?.id)
        console.log('FormData values:', {
          name: values.name,
          address: values.address,
          phone: values.phone,
          start_time: values.start_time,
          end_time: values.end_time,
        })

        const { data } = await axios.put(
          `${config.URL}/stores/update/${storeData?.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${auth.token}`
            }
          }
        )

        if (data?.success) {
          Toast.show({
            type: 'success',
            text1: t('store.storeUpdatedSuccess'),
            position: 'bottom',
            visibilityTime: 2000,
          })
          router.back()
        } else {
          Toast.show({
            type: 'error',
            text1: t('store.storeUpdateFailed'),
            position: 'bottom',
            visibilityTime: 2000,
          })
        }

      } catch (error: any) {
        console.error('Store update error:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        Toast.show({
          type: 'error',
          text1: error.response?.data?.message || t('store.storeUpdateFailed'),
          position: 'bottom',
          visibilityTime: 3000,
        })
      } finally {
        setIsSubmitting(false)
      }
    },
  })

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

  if (!storeData) {
    return (
      <Layout>
        <Header title={t("store.update_store")} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">{t('store.noStoreData')}</Text>
        </View>
      </Layout>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <Layout>
        <Header title={t("store.update_store")} />
        
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* Subtitle */}
          <Text className="text-gray-600 text-center mb-6">
            {t('store.updateStoreSubtitle', { defaultValue: 'Update your store information' })}
          </Text>

          {/* Form Card */}
          <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            {/* Section 1: Store Information */}
            <View className="mb-6">
              <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                <Ionicons name="storefront-outline" size={24} color="#fd4a12" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
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

            {/* Section 2: Store Images */}
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

            {/* Section 3: Operating Hours */}
            <View className="mb-6">
              <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                <Ionicons name="time-outline" size={24} color="#fd4a12" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
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
                    {formik.values.end_time || t('store.selectEndTime')}
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

            {/* Submit Button */}
            <View className="mt-4">
              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  title={t('store.updateStoreButton', { defaultValue: 'Update Store' })}
                  onPress={formik.handleSubmit}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  )
}
