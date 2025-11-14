import CustomButton from '@/components/custom/custombutton'
import CustomInput from '@/components/custom/Input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Toast } from 'toastify-react-native'
import axios from 'axios'
import CustomImagePicker from '@/components/custom/customimagepicker'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth_context'
import useFetch from '@/hooks/useFetch'


export default function AddMeal() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { auth } = useContext(AuthContext);


  // Validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(t('meal.titleRequired'))
      .min(2, t('meal.titleMinLength')),
    description: Yup.string()
      .required(t('meal.descriptionRequired'))
      .min(10, t('meal.descriptionMinLength')),
    price: Yup.number()
      .required(t('meal.priceRequired'))
      .positive(t('meal.pricePositive'))
      .typeError(t('meal.priceValid')),
    image: Yup.string()
      .required(t('meal.imageRequired'))
  })


  const formik = useFormik({
    initialValues: {
      restaurant_id: '72',
      title: '',
      description: '',
      price: '',
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)

      try {
        // Create FormData for file upload - backend expects 'image' field name
        const formData = new FormData()

        // Add form fields
        formData.append('restaurant_id', auth?.user?.restaurant?.id.toString())
        formData.append('title', values.title)
        formData.append('description', values.description)
        formData.append('price', values.price)

        // Add image file if selected
        if (selectedImage) {
          const filename = selectedImage.split('/').pop() || 'meal.jpg'
          const match = /\.(\w+)$/.exec(filename)
          const type = match ? `image/${match[1]}` : 'image/jpeg'


          const imageFile = {
            uri: selectedImage,
            name: filename,
            type: type,
          } as any

          formData.append('image', imageFile)
        } else {

        }


        const response = await axios.post(
          `${config.URL}/menu/create`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

          // useFetch('/menu/restaurant/' + auth?.user?.restaurant?.id);
        Toast.show({
          text1: t('meal.mealAddedSuccess'),
          type: 'success',
        })
        router.back()
      } catch (error: any) {


        Toast.show({
          text1: t('meal.failedToAddMeal'),
          type: 'error',
        })

      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <View className="flex-1 bg-gray-50">
      {/* Improved Header */}
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
              {t('meal.addNewMeal')}
            </Text>
            <Text
              className="text-sm text-gray-500 text-center mt-1"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {t('meal.createMenuItemSubtitle')}
            </Text>
          </View>

          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-2 py-6">
          {/* Form Container */}
          <View className="bg-white rounded-2xl shadow-sm p-6">
            <View className="space-y-6">
              {/* Meal Title */}
              <View>
                <CustomInput
                  label={t('meal.mealTitle')}
                  placeholder={t('meal.enterMealTitle')}
                  value={formik.values.title}
                  onChangeText={formik.handleChange('title')}
                  type="text"
                  error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
                />
              </View>

              {/* Description */}
              <View>
                <Text
                  className="text-gray-700 text-base font-medium mb-3"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('meal.description')}
                </Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <CustomInput
                    placeholder={t('meal.enterMealDescription')}
                    value={formik.values.description}
                    onChangeText={formik.handleChange('description')}
                    type="text"
                    error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
                  />
                </View>
              </View>

              {/* Price */}
              <View>
                <CustomInput
                  label={t('meal.price')}
                  placeholder={t('meal.enterMealPrice')}
                  value={formik.values.price}
                  onChangeText={formik.handleChange('price')}
                  type="text"
                  keyboardType="numeric"
                  error={formik.touched.price && formik.errors.price ? formik.errors.price : undefined}
                />
              </View>

              {/* Meal Image */}
              <View>
                <Text
                  className="text-gray-700 text-base font-medium mb-3"
                  style={{ fontFamily: 'Cairo_600SemiBold' }}
                >
                  {t('meal.mealImage')}
                </Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <CustomImagePicker
                    placeholder={t('meal.tapToSelectImage')}
                    changeText={t('meal.tapToChangeImage')}
                    value={formik.values.image}
                    onImageSelect={(uri) => {
                      console.log('Image selected:', uri)
                      setSelectedImage(uri)
                      formik.setFieldValue('image', uri)
                    }}
                    error={formik.touched.image && formik.errors.image ? formik.errors.image : undefined}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-6 space-y-3">
            <CustomButton
              title={isSubmitting ? t('meal.addingMeal') : t('meal.addMeal')}
              onPress={formik.handleSubmit}
              disabled={isSubmitting || !formik.isValid || !formik.dirty}
            />

            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-100 py-4 rounded-xl items-center"
            >
              <Text
                className="text-gray-700 font-semibold"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {t('meal.cancel')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Helper Text */}
          <View className="mt-6 bg-blue-50 rounded-xl p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" style={{ marginTop: 2, marginRight: 8 }} />
              <Text
                className="text-blue-700 text-sm flex-1"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                {t('meal.helpText')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
