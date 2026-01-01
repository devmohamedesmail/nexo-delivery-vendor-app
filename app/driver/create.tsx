import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/button'
import Select from '../../components/ui/select'
import { Toast } from 'toastify-react-native'
import CustomImagePicker from '../../components/ui/customimagepicker'
import CustomHeader from '../../components/ui/Header'
import CustomLoading from '../../components/ui/Loading'
import axios from 'axios'
import { config } from '@/constants/config'
import useFetch from '@/hooks/useFetch'
import { useAuth } from '@/context/auth-provider'
import { SafeAreaView } from 'react-native-safe-area-context'

interface DriverFormValues {
    vehicle_type: string
    vehicle_license_plate: string
    vehicle_color: string
    image: string
}

interface VehicleType {
    id: number
    type: string
    image: string
    price: number
    start_price: number
}

export default function Create() {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const { auth } = useAuth()
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch vehicle types from backend
    const {
        data: vehiclesData,
        loading: vehiclesLoading,
        error: vehiclesError,
    } = useFetch('/vehicles')

    // Validation schema
    const validationSchema = Yup.object().shape({
        vehicle_type: Yup.string().required(t('driver.vehicle_type_required')),
        vehicle_license_plate: Yup.string().required(t('driver.license_plate_required')),
        vehicle_color: Yup.string().required(t('driver.vehicle_color_required')),
        image: Yup.string().required(t('driver.vehicle_image_required')),
    })
    // Form handler
    const formik = useFormik<DriverFormValues>({
        initialValues: {
            vehicle_type: '',
            vehicle_license_plate: '',
            vehicle_color: '',
            image: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!selectedImage) {
                Toast.error(t('driver.vehicle_image_required'))
                return
            }

            setIsSubmitting(true)
            try {
                const formData = new FormData()
                formData.append('userId', auth?.user?.id?.toString() || '')
                formData.append('vehicle_type', values.vehicle_type)
                formData.append('vehicle_license_plate', values.vehicle_license_plate)
                formData.append('vehicle_color', values.vehicle_color)

                // Add image file
                const filename = selectedImage.split('/').pop() || 'vehicle.jpg'
                const match = /\.(\w+)$/.exec(filename)
                const type = match ? `image/${match[1]}` : 'image/jpeg'

                formData.append('image', {
                    uri: selectedImage,
                    name: filename,
                    type,
                } as any)

                const response = await axios.post(`${config.URL}/drivers/create`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })

                Toast.success(t('driver.profile_created_successfully'))
                formik.resetForm()
                setSelectedImage(null)
                router.back()
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || t('driver.failed_to_create_profile')
                Toast.error(errorMessage)
                console.error('Driver registration error:', error.response?.data)
            } finally {
                setIsSubmitting(false)
            }
        },
    })

    // Prepare vehicle types options
    const vehicleTypes =
        vehiclesData?.data
            ?.filter((vehicle: VehicleType) => vehicle?.type) // Filter out vehicles without type
            ?.map((vehicle: VehicleType) => ({
                value: vehicle.type.toLowerCase(),
                label: vehicle.type,
            })) || []

    // Vehicle colors options
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
        { value: 'brown', label: t('colors.brown') },
    ]

    if (vehiclesLoading) {
        return <CustomLoading />
    }

    if (vehiclesError) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 px-6">
                <Text className="text-red-500 text-center mb-4">{t('driver.failed_to_load_vehicles')}</Text>
                <Button title={t('common.retry')} onPress={() => router.back()} />
            </View>
        )
    }

    return (
        <SafeAreaView className='flex-1' edges={["bottom"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-gray-50"
            >
                <CustomHeader title={t('driver.createProfile')} />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="px-6 py-4">
                        {/* Subtitle */}
                        <Text className="text-gray-600 text-center mb-6" style={{ fontFamily: 'Cairo_400Regular' }}>
                            {t('driver.createYourProfile')}
                        </Text>

                        {/* Form Card */}
                        <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            {/* Section Header */}
                            <View className="mb-6">
                                <Text
                                    className={`text-xl font-semibold text-black mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                                >
                                    {t('driver.vehicleInfo')}
                                </Text>

                            </View>

                            {/* Form Fields */}
                            <View className="space-y-4">
                                {/* Vehicle Image */}
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

                                {/* Vehicle Type */}
                                <Select
                                    label={t('driver.vehicle_type')}
                                    placeholder={t('driver.select_vehicle_type')}
                                    value={formik.values.vehicle_type}
                                    onSelect={(value: string) => formik.setFieldValue('vehicle_type', value)}
                                    options={vehicleTypes}
                                    error={
                                        formik.touched.vehicle_type && formik.errors.vehicle_type
                                            ? formik.errors.vehicle_type
                                            : undefined
                                    }
                                />

                                {/* License Plate */}
                                <Input
                                    label={t('driver.vehicle_license_plate')}
                                    placeholder={t('driver.enter_license_plate')}
                                    value={formik.values.vehicle_license_plate}
                                    onChangeText={formik.handleChange('vehicle_license_plate')}
                                    type="text"
                                    error={
                                        formik.touched.vehicle_license_plate && formik.errors.vehicle_license_plate
                                            ? formik.errors.vehicle_license_plate
                                            : undefined
                                    }
                                />

                                {/* Vehicle Color */}
                                <Select
                                    label={t('driver.vehicle_color')}
                                    placeholder={t('driver.select_vehicle_color')}
                                    value={formik.values.vehicle_color}
                                    onSelect={(value: string) => formik.setFieldValue('vehicle_color', value)}
                                    options={vehicleColors}
                                    error={
                                        formik.touched.vehicle_color && formik.errors.vehicle_color
                                            ? formik.errors.vehicle_color
                                            : undefined
                                    }
                                />
                            </View>

                            {/* Submit Button */}
                            <View className="mt-8">
                               
                                <Button
                                    title={`${isSubmitting ? t('driver.registering...') : t('driver.registerVehicle')}`}
                                    onPress={formik.handleSubmit}
                                    disabled={isSubmitting}

                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
