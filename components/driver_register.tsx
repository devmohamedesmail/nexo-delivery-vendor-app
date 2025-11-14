import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import CustomInput from './custom/Input'
import CustomButton from './custom/custombutton'
import CustomDropdown from './custom/Select'
import { Toast } from 'toastify-react-native'
import { Ionicons } from '@expo/vector-icons'
import CustomImagePicker from './custom/customimagepicker'
import CustomHeader from './custom/customheader'
import CustomLoading from './custom/Loading'
import axios from 'axios'

interface DriverFormValues {

  vehicle_type: string
  vehicle_license_plate: string
  vehicle_color: string
  image: string

}

export default function DriverRegister() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
 const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    // Vehicle Information
    vehicleMake: Yup.string()
      .required(t('driver.vehicleMakeRequired')),
    vehicleModel: Yup.string()
      .required(t('driver.vehicleModelRequired')),
    vehicleYear: Yup.number()
      .required(t('driver.vehicleYearRequired'))
      .min(1990, t('driver.invalidYear'))
      .max(new Date().getFullYear() + 1, t('driver.invalidYear'))
      .typeError(t('driver.invalidYear')),
    vehicleColor: Yup.string()
      .required(t('driver.vehicleColorRequired')),
    licensePlate: Yup.string()
      .required(t('driver.licensePlateRequired'))
      .min(3, t('driver.licensePlateRequired')),
    vehicleType: Yup.string()
      .required(t('driver.vehicleTypeRequired')),
    carImage: Yup.string()
      .required(t('driver.carImageRequired'))
  })


  const formik = useFormik({
    initialValues: {
      vehicle_type: '',
      vehicle_license_plate: '',
      vehicle_color: '',
      image: '',
    },
    // validationSchema: validationSchema,
    onSubmit: async values => {
      setIsSubmitting(true)
      try {
        const formData = new FormData()
        formData.append('userId', '2') // Replace with actual userId
        formData.append('vehicle_type', values.vehicle_type)
        formData.append('vehicle_license_plate', values.vehicle_license_plate)
        formData.append('vehicle_color', values.vehicle_color)

        // Add image file if selected
        if (selectedImage) {
          const filename = selectedImage.split('/').pop() || 'driver_vehicle.jpg'
          const match = /\.(\w+)$/.exec(filename)
          const type = match ? `image/${match[1]}` : 'image/jpeg'
          
          const imageFile = {
            uri: selectedImage,
            name: filename,
            type: type,
          } as any
          
          formData.append('image', imageFile)
        }

        console.log('Submitting driver registration with FormData')
        
        const response = await axios.post(
          'https://uber-express-project.onrender.com/api/drivers',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        
        console.log('Driver registered successfully:', response.data)
        Toast.success('Driver registration successful!')
        
        // Reset form
        formik.resetForm()
        setSelectedImage(null)
        
        // Navigate back or to success page
        router.back()
        
      } catch (error: any) {
        console.error('Full error:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        
        // Log the actual backend error message
        if (error.response?.data) {
          console.error('Backend error details:', JSON.stringify(error.response.data, null, 2))
        }
        
        const errorMessage = error.response?.data?.message || 'Failed to register driver'
        Toast.error(errorMessage)
      } finally {
        setIsSubmitting(false)
      }
    },
  })



  const vehicleTypes = [
    { value: 'car', label: t('car') },
    { value: 'motorcycle', label: t('motorcycle') },
    { value: 'bicycle', label: t('bicycle') },
    { value: 'scooter', label: t('scooter') }
  ]

  const vehicleColors = [
    { value: 'black', label: t('colors.black') },
    { value: 'white', label: t('colors.white') },
    { value: 'silver', label: t('colors.silver') },
    { value: 'gray', label: t('colors.gray') },
    { value: 'red', label: t('colors.red') },
    { value: 'blue', label: t('colors.blue') },
    { value: 'green', label: t('colors.green') },
    { value: 'yellow', label: t('colors.yellow') },
    { value: 'orange', label: t('colors.orange') },
    { value: 'brown', label: t('colors.brown') }
  ]



  return (
    <ScrollView className="flex-1 bg-gray-50">
       <CustomHeader title={t('driver.vehicleRegistration')} />
      <View className="px-6 py-1">
        {/* Header with Back Button */}
       

        <View className="bg-white rounded-xl shadow-sm p-6">
          {/* Vehicle Information Section */}
          <View className="space-y-4">
            <View className="mb-6">
              <Text
                className="text-xl font-semibold text-center text-gray-800 mb-2"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {t('driver.vehicleInfo')}
              </Text>
              <View className="h-1 w-12 bg-secondary rounded m-auto"></View>
            </View>

            

            <CustomImagePicker
              label={t('driver.carImage')}
              placeholder={t('driver.tapToSelectCarImage')}
              changeText={t('driver.tapToChangeCarImage')}
              value={selectedImage || ''}
              onImageSelect={(uri) => {
                setSelectedImage(uri)
                formik.setFieldValue('image', uri)
              }}
              error={formik.touched.image && formik.errors.image ? formik.errors.image : undefined}
            />

            <CustomDropdown
              label={t('driver.vehicle_type')}
              placeholder={t('driver.enterVehicleType')}
              value={formik.values.vehicle_type}
              onSelect={(value) => formik.setFieldValue('vehicle_type', value)}
              options={vehicleTypes}
              error={formik.touched.vehicle_type && formik.errors.vehicle_type ? formik.errors.vehicle_type : undefined}
            />

            <CustomInput
              label={t('driver.vehicle_license_plate')}
              placeholder={t('driver.vehicle_license_plate')}
              value={formik.values.vehicle_license_plate}
              onChangeText={formik.handleChange('vehicle_license_plate')}
              type="text"
              error={formik.touched.vehicle_license_plate && formik.errors.vehicle_license_plate ? formik.errors.vehicle_license_plate : undefined}
            />

            <CustomDropdown
              label={t('driver.vehicle_color')}
              placeholder={t('driver.vehicle_color')}
              value={formik.values.vehicle_color}
              onSelect={(value) => formik.setFieldValue('vehicle_color', value)}
              options={vehicleColors}
              error={formik.touched.vehicle_color && formik.errors.vehicle_color ? formik.errors.vehicle_color : undefined}
            />







            {/* Vehicle Type Selector */}

          </View>

          {/* Submit Button */}
          <View className="mt-8">
            {isSubmitting ? (
              <CustomLoading />
            ) : (
              <CustomButton
                title={t('driver.registerVehicle')}
                onPress={formik.handleSubmit}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
