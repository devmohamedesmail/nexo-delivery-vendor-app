import React, { useContext, useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Input from '@/components/custom/Input'
import CustomTextArea from '@/components/custom/customtextarea'
import CustomButton from '@/components/custom/Button'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth_context'
import { useTranslation } from 'react-i18next'
import useFetch from '@/hooks/useFetch'
import { Toast } from 'toastify-react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '@/components/common/Loading'

interface Category {
  id: number
  store_id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function Categories() {
  const { t } = useTranslation()
  const { auth } = useContext(AuthContext)
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useFetch(`/categories/store/${auth.user.store.id}`)

  const onRefresh = () => {
    setRefreshing(true)
    refetchCategories()
  }





  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('categories.name_required')),
      description: Yup.string().required(t('categories.description_required')),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          store_id: auth.user.store.id,
          name: values.name,
          description: values.description,
        }

        if (editingCategory) {
          // Update category
          await axios.put(`${config.URL}/categories/update/${editingCategory.id}`, payload)
          // Toast.success(t('categories.category_updated_successfully'))
          Toast.show({
            type: 'success',
            text1: t('categories.category_updated_successfully'),
          })
        } else {
          // Create category
          await axios.post(`${config.URL}/categories/create`, payload)
          // Toast.success(t('categories.category_added_successfully'))
          Toast.show({
            type: 'success',
            text1: t('categories.category_added_successfully'),
          })
        }

        resetForm()
        setModalVisible(false)
        setEditingCategory(null)
        refetchCategories()
        // fetchCategories()
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message || t('categories.failed_to_save_category'),
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    formik.setValues({
      name: category.name,
      description: category.description,
    })
    setModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Alert.alert(
      t('categories.delete_category'),
      t('categories.delete_category_confirmation'),
      [
        { text: t('categories.cancel'), style: 'cancel' },
        {
          text: t('categories.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${config.URL}/categories/delete/${id}`)
              Toast.success(t('categories.category_deleted_successfully'))
              // fetchCategories()
            } catch (error: any) {
              Toast.error(t('categories.failed_to_delete_category'))
            }
          },
        },
      ]
    )
  }

  const openAddModal = () => {
    setEditingCategory(null)
    formik.resetForm()
    setModalVisible(true)
  }

  // if (categoriesLoading) {
  //   return (
  //     <View className='flex-1'>
  //       <Loading  />
  //     </View>
  //   )
  // }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Professional Header */}
      <View className="bg-black/90 px-4 py-4 shadow-sm pt-24">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <View className="flex-1 mx-4">
            <Text className="text-xl font-bold text-white">
              {t('categories.categories')}
            </Text>
            <Text className="text-sm text-white mt-1">
              {t('categories.manage_categories')}
            </Text>
          </View>

          <View className="bg-primary w-10 h-10 rounded-full items-center justify-center">
            <Text className="text-white font-bold">
              {categoriesData?.data?.length}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#fd4a12']} />}
      >
        {categoriesLoading ? (<Loading />) : (<>
         {/* Stats Card */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 text-sm">
                {t('categories.total_categories')}
              </Text>
              <Text className="text-2xl font-bold text-primary mt-1">
                {categoriesData?.data?.length}
              </Text>
            </View>
            <View className="bg-primary/10 w-14 h-14 rounded-full items-center justify-center">
              <Ionicons name="grid-outline" size={28} color="#fd4a12" />
            </View>
          </View>
        </View>

        {/* Categories List */}
        {categoriesData.data.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center justify-center" style={{ minHeight: 200 }}>
            <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-center" style={{ fontFamily: 'Cairo_600SemiBold' }}>
              {t('categories.no_categories_yet')}
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2" style={{ fontFamily: 'Cairo_400Regular' }}>
              {t('categories.add_first_category')}
            </Text>
          </View>
        ) : (
          <View className="space-y-3">
            {categoriesData && categoriesData.data.map((category: any) => (
              <View key={category.id} className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Cairo_700Bold' }}>
                      {category.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                      {category.description}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                  <TouchableOpacity
                    onPress={() => handleEdit(category)}
                    className="bg-blue-50 px-4 py-2 rounded-lg flex-row items-center mr-2"
                  >
                    <Ionicons name="create-outline" size={18} color="#3B82F6" />
                    <Text className="text-blue-600 ml-2 font-medium" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                      {t('categories.edit')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(category.id)}
                    className="bg-red-50 px-4 py-2 rounded-lg flex-row items-center"
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text className="text-red-600 ml-2 font-medium" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                      {t('categories.delete')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        
        </>)}
       
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={openAddModal}
        className="absolute bottom-24 right-6 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false)
          setEditingCategory(null)
          formik.resetForm()
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/50"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setModalVisible(false)
              setEditingCategory(null)
              formik.resetForm()
            }}
            className="flex-1"
          />
          <View className="bg-white rounded-t-3xl p-6" style={{ maxHeight: '80%' }}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Cairo_700Bold' }}>
                {editingCategory ? t('categories.edit_category') : t('categories.add_category')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false)
                  setEditingCategory(null)
                  formik.resetForm()
                }}
              >
                <Ionicons name="close-circle" size={32} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label={t('categories.name')}
                placeholder={t('categories.enter_category_name')}
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
              />
              <CustomTextArea
                label={t('categories.description')}
                placeholder={t('categories.enter_category_description')}
                value={formik.values.description}
                onChangeText={formik.handleChange('description')}
                error={formik.touched.description && formik.errors.description ? formik.errors.description : ''}
                touched={formik.touched.description}
              />
              <CustomButton
                title={formik.isSubmitting ? t('categories.saving') : editingCategory ? t('categories.update_category') : t('categories.add_category')}
                onPress={formik.handleSubmit as any}
                disabled={formik.isSubmitting}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

