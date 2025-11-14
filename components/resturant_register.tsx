import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import CustomInput from './custom/Input'
import CustomButton from './custom/custombutton'
import { Toast } from 'toastify-react-native'
import axios from 'axios'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth_context'
import Modal from 'react-native-modal';
import CustomImagePicker from './custom/customimagepicker'

interface RestaurantFormValues {
  name: string
  address: string
  phone: string
  description: string
  opening_hours: string
  delivery_time: string
  image: string
}

export default function Resturant_Register() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { auth } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  // Time picker states
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [showStartTimeModal, setShowStartTimeModal] = useState(false)
  const [showEndTimeModal, setShowEndTimeModal] = useState(false)
  
console.log(auth)
  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('restaurantNameRequired'))
      .min(2, t('restaurantNameRequired')),

    address: Yup.string()
      .required(t('addressRequired'))
      .min(10, t('addressRequired')),
    phone: Yup.string()
      .required(t('phone_required'))
      .matches(/^[0-9+\-\s]+$/, t('phone_invalid')),

    // description: Yup.string()
    //   .required(t('descriptionRequired'))
    //   .min(10, t('descriptionRequired')),

    // opening_hours: Yup.string()
    //   .required(t('openingHoursRequired')),
    // delivery_time: Yup.number()
    //   .required(t('deliveryTimeRequired'))
    //   .positive(t('deliveryTimeInvalid'))
    //   .integer(t('deliveryTimeInvalid'))
    //   .typeError(t('deliveryTimeInvalid')),
    image: Yup.string()
      .required(t('imageRequired'))
  })



  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      phone: '',
      start_time: '',
      end_time: '',
      image: '',
    },
    // validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        // Create FormData for file upload
        const formData = new FormData()
        
        // Add form fields
        formData.append('userId', "16")
        formData.append('name', values.name)
        formData.append('address', values.address)
        formData.append('phone', values.phone)
        formData.append('start_time', values.start_time)
        formData.append('end_time', values.end_time)

        // Add image file if selected
        if (selectedImage) {
          const filename = selectedImage.split('/').pop() || 'restaurant.jpg'
          const match = /\.(\w+)$/.exec(filename)
          const type = match ? `image/${match[1]}` : 'image/jpeg'
          
          const imageFile = {
            uri: selectedImage,
            name: filename,
            type: type,
          } as any
          
          formData.append('image', imageFile)
        }

        console.log('Submitting restaurant with FormData')
        
        const response = await axios.post(
          `${config.URL}/restaurants/create`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        console.log('Response:', response.data)
        Toast.success(t('restaurantRegistered'))
        router.back()
      } catch (error: any) {
        console.error('Full error:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        Toast.error(error.response?.data?.message || t('registrationFailed'))
      } finally {
        setIsSubmitting(false)
      }
    },
  });



  return (
    <View className='flex-1 bg-gray-50'>
      {/* Sticky Header */}
      <View className="bg-white shadow-lg border-b border-gray-100" style={{ paddingTop: 50 }}>
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          
          <View className="flex-1 mx-4">
            <Text
              className="text-xl font-bold text-gray-800 text-center"
              style={{ fontFamily: 'Cairo_700Bold' }}
            >
              {t('resturant.restaurantRegistration')}
            </Text>
            
          </View>
          
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="space-y-4 px-4 pb-20">
          {/* Restaurant Name */}
          <CustomInput
            label={t('resturant.restaurantName')}
            placeholder={t('resturant.enterRestaurantName')}
            value={formik.values.name}
            onChangeText={(formik.handleChange('name'))}
            type="text"
            error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
          />






          {/* Address */}
          <CustomInput
            label={t('resturant.restaurantAddress')}
            placeholder={t('resturant.enterRestaurantAddress')}
            value={formik.values.address}
            onChangeText={(formik.handleChange('address'))}
            type="text"
            error={formik.touched.address && formik.errors.address ? formik.errors.address : undefined}
          />

          {/* Phone Number */}
          <CustomInput
            label={t('resturant.phone')}
            placeholder={t('resturant.enterPhone')}
            value={formik.values.phone}
            onChangeText={(formik.handleChange('phone'))}
            type="phone"
            keyboardType="phone-pad"
            error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
          />



          <CustomImagePicker
            label={t('resturant.restaurantImage')}
            placeholder={t('resturant.tapToSelectImage')}
            changeText={t('resturant.tapToChangeImage')}
            value={formik.values.image}
            onImageSelect={(uri) => formik.setFieldValue('image', uri)}
            error={formik.touched.image && formik.errors.image ? formik.errors.image : undefined}
          />



          <View>
            {/* Start Time Picker */}
            <View className="mb-4">
              <Text
                className="text-gray-700 text-base font-medium mb-2"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
              
                {t('resturant.startTime')}
              </Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3"
                onPress={() => setShowStartTimeModal(true)}
              >
                <Text className="text-gray-600" style={{ fontFamily: 'Cairo_400Regular' }}>
                  {startTime || 'Select start time'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* End Time Picker */}
            <View className="mb-4">
              <Text
                className="text-gray-700 text-base font-medium mb-2"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {t('resturant.endTime')}
              </Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3"
                onPress={() => setShowEndTimeModal(true)}
              >
                <Text className="text-gray-600" style={{ fontFamily: 'Cairo_400Regular' }}>
                  {endTime || 'Select end time'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Start Time Modal */}
            <Modal isVisible={showStartTimeModal}>
              <View className="bg-white rounded-lg p-6">
                <Text className="text-lg font-bold mb-4 text-center">Select Start Time</Text>
                <ScrollView className="max-h-48">
                  {Array.from({ length: 24 }, (_, hour) =>
                    Array.from({ length: 2 }, (_, halfHour) => {
                      const minutes = halfHour * 30;
                      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      return (
                        <TouchableOpacity
                          key={timeString}
                          className="py-3 border-b border-gray-200"
                          onPress={() => {
                            setStartTime(timeString);
                            setShowStartTimeModal(false);
                          }}
                        >
                          <Text className="text-center text-lg">{timeString}</Text>
                        </TouchableOpacity>
                      );
                    })
                  ).flat()}
                </ScrollView>
                <TouchableOpacity
                  className="mt-4 bg-red-500 py-3 rounded-lg"
                  onPress={() => setShowStartTimeModal(false)}
                >
                  <Text className="text-white text-center font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            {/* End Time Modal */}
            <Modal isVisible={showEndTimeModal}>
              <View className="bg-white rounded-lg p-6">
                <Text className="text-lg font-bold mb-4 text-center">Select End Time</Text>
                <ScrollView className="max-h-48">
                  {Array.from({ length: 24 }, (_, hour) =>
                    Array.from({ length: 2 }, (_, halfHour) => {
                      const minutes = halfHour * 30;
                      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      return (
                        <TouchableOpacity
                          key={timeString}
                          className="py-3 border-b border-gray-200"
                          onPress={() => {
                            setEndTime(timeString);
                            setShowEndTimeModal(false);
                          }}
                        >
                          <Text className="text-center text-lg">{timeString}</Text>
                        </TouchableOpacity>
                      );
                    })
                  ).flat()}
                </ScrollView>
                <TouchableOpacity
                  className="mt-4 bg-red-500 py-3 rounded-lg"
                  onPress={() => setShowEndTimeModal(false)}
                >
                  <Text className="text-white text-center font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>










          {/* Delivery Time */}
          {/* <CustomInput
            label={t('deliveryTime')}
            placeholder={t('enterDeliveryTime')}
            value={formik.values.delivery_time}
            onChangeText={formik.handleChange('delivery_time')}
            type="text"
            keyboardType="numeric"
            error={formik.touched.delivery_time && formik.errors.delivery_time ? formik.errors.delivery_time : undefined}
          /> */}

          {/* Submit Button */}
          <View className="mt-8">
            <CustomButton
              title={isSubmitting ? t('resturant.registering') : t('resturant.registerRestaurant')}
              onPress={formik.handleSubmit}
              disabled={isSubmitting || !formik.isValid || !formik.dirty}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
