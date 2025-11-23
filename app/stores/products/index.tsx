import React, { useContext, useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, KeyboardAvoidingView, Platform, Image, StatusBar, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Input from '@/components/custom/Input'
import CustomTextArea from '@/components/custom/customtextarea'
import CustomButton from '@/components/custom/Button'
import Select from '@/components/custom/Select'
import CustomImagePicker from '@/components/custom/customimagepicker'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth_context'
import { useTranslation } from 'react-i18next'
import useFetch from '@/hooks/useFetch'
import { Toast } from 'toastify-react-native'
import { useRouter, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '@/components/common/Loading'
import Skeleton from '@/components/common/Skeleton'
import NoProductsFound from '@/components/store/NoProductsFound'


interface Product {
  id: number
  store_id: number
  category_id: number
  name: string
  description: string
  price: number
  sale_price: number | null
  image: string | null
  on_sale: boolean
  is_featured: boolean
  stock: number
  createdAt: string
  updatedAt: string
}

interface Category {
  id: number
  name: string
  description: string
}

export default function Products() {
  const { t } = useTranslation()
  const { auth } = useContext(AuthContext)
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile } = useFetch(auth?.user?.id ? `/users/profile/${auth.user.id}` : '')

  // Check if store exists
  const storeId = profileData?.data?.store?.id || ''
  // Fetch products
  const { data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts } = useFetch(storeId ? `/products/store/${storeId}` : '')
  // Fetch categories for dropdown
  const { data: categoriesData,
    loading: loadingCategories,
    error: errorCategories,
    refetch: refetchCategories } = useFetch(storeId ? `/categories/store/${storeId}` : '')

  useEffect(() => {
    if (productsData && productsData.data) {
      setProducts(productsData.data)
      setRefreshing(false)
    }
  }, [productsData])

  const onRefresh = () => {
    setRefreshing(true)
    refetchProducts()
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      sale_price: '',
      category_id: '',
      image: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('products.name_required')),
      description: Yup.string().required(t('products.description_required')),
      price: Yup.number()
        .required(t('products.price_required'))
        .positive(t('products.price_positive')),
      sale_price: Yup.number().nullable().positive(t('products.price_positive', { defaultValue: 'Price must be positive' })),
      category_id: Yup.string().required(t('products.category_required')),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (!storeId) {
          Toast.error(t('products.no_store_found', { defaultValue: 'No store found' }))
          return
        }

        // Create FormData for image upload
        const formData = new FormData()
        formData.append('store_id', storeId.toString())
        formData.append('name', values.name)
        formData.append('description', values.description)
        formData.append('price', values.price)
        if (values.sale_price) {
          formData.append('sale_price', values.sale_price)
        }
        formData.append('category_id', values.category_id)

        // Add image file if exists
        if (values.image) {
          const uriParts = values.image.split('.')
          const fileType = uriParts[uriParts.length - 1]

          formData.append('image', {
            uri: values.image,
            name: `product.${fileType}`,
            type: `image/${fileType}`,
          } as any)
        }

        if (editingProduct) {
          // Update product
          const response = await axios.put(
            `${config.URL}/products/update/${editingProduct.id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          if (response.data.success) {
            Toast.success(t('products.product_updated_successfully'))
            refetchProducts()
            setModalVisible(false)
            resetForm()
            setEditingProduct(null)
          }
        } else {
          // Create product
          const response = await axios.post(
            `${config.URL}/products/create`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          if (response.data.success) {
            Toast.success(t('products.product_added_successfully'))
            refetchProducts()
            setModalVisible(false)
            resetForm()
          }
        }
      } catch (error) {
        Toast.error(t('products.failed_to_save_product'))
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleDelete = async (productId: number) => {
    try {
      const response = await axios.delete(`${config.URL}/products/${productId}`)
      if (response.data.success) {
        Toast.success(t('products.product_deleted_successfully'))
        refetchProducts()
      }
    } catch (error) {
      Toast.error(t('products.failed_to_delete_product'))
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    formik.setValues({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      category_id: product.category_id.toString(),
      image: product.image || '',
    })
    setModalVisible(true)
  }

  const openAddModal = () => {
    setEditingProduct(null)
    formik.resetForm()
    setModalVisible(true)
  }

  // Prepare category options for dropdown
  const categoryOptions = categoriesData?.data?.map((cat: Category) => ({
    label: cat.name,
    value: cat.id.toString(),
  })) || []

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View className="bg-black/90 px-4 pt-24 py-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 bg-white rounded-full p-2">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">
              {t('products.products')}
            </Text>
            <Text className="text-sm text-white mt-1" >
              {t('products.manage_products')}
            </Text>
          </View>

          <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
            <Text className="text-white text-xs font-bold" style={{ fontFamily: 'Cairo_700Bold' }}>
              {products?.length}
            </Text>
          </View>
        </View>
      </View>


      {profileLoading ? (<Loading />) : (

        <>
          {productsLoading ? (
            <View className='mt-10 px-3'>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} w="full" h={100}  />
              ))}
            </View>
          ) : (<>
            {products.length === 0 ? (<NoProductsFound />) : (

              <>

                <FlatList
                  data={products}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ padding: 16 }}
                  renderItem={({ item: product }) => (
                    <View key={product.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                      <View className="flex-row">
                        {/* Product Image */}
                        {product.image ? (
                          <Image
                            source={{ uri: product.image }}
                            className="w-20 h-20 rounded-lg mr-3"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-20 h-20 rounded-lg bg-gray-100 items-center justify-center mr-3">
                            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                          </View>
                        )}

                        {/* Product Details */}
                        <View className="flex-1">
                          <Text className="font-bold text-lg text-gray-800" style={{ fontFamily: 'Cairo_700Bold' }}>
                            {product.name}
                          </Text>
                          <Text className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Cairo_400Regular' }} numberOfLines={2}>
                            {product.description}
                          </Text>
                          <View className="flex-row items-center justify-between mt-2">
                            <View>
                              <Text className="text-primary font-bold text-base" style={{ fontFamily: 'Cairo_700Bold' }}>
                                {product.sale_price ? (
                                  <>
                                    <Text className="line-through text-gray-400 text-sm">{product.price} </Text>
                                    <Text className="text-primary">{product.sale_price} {t('categories.currency', { defaultValue: 'EGP' })}</Text>
                                  </>
                                ) : (
                                  `${product.price} ${t('categories.currency', { defaultValue: 'EGP' })}`
                                )}
                              </Text>
                            </View>
                            {categoriesData?.data && (
                              <Text className="text-xs text-gray-400" style={{ fontFamily: 'Cairo_400Regular' }}>
                                {categoriesData.data.find((c: Category) => c.id === product.category_id)?.name || '-'}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View className="flex-row mt-3 pt-3 border-t border-gray-100">
                        <TouchableOpacity
                          onPress={() => openEditModal(product)}
                          className="flex-1 flex-row items-center justify-center bg-blue-50 rounded-lg py-2 mr-2"
                        >
                          <Ionicons name="create-outline" size={18} color="#3B82F6" />
                          <Text className="text-blue-600 ml-1 font-medium" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                            {t('categories.edit')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(product.id)}
                          className="flex-1 flex-row items-center justify-center bg-red-50 rounded-lg py-2"
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                          <Text className="text-red-600 ml-1 font-medium" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                            {t('categories.delete')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                />

                {/* Floating Add Button */}
                <TouchableOpacity
                  className="absolute bottom-24 right-6 bg-primary rounded-full w-16 h-16 items-center justify-center shadow-lg"
                  onPress={openAddModal}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={32} color="#fff" />
                </TouchableOpacity>

                {/* Add/Edit Product Modal */}
                <Modal
                  visible={modalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                  >
                    <View className="flex-1 bg-black/50 justify-end">
                      <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
                        {/* Modal Header */}
                        <View className="flex-row items-center justify-between mb-4">
                          <Text className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cairo_700Bold' }}>
                            {editingProduct ? t('products.edit_product') : t('products.add_product')}
                          </Text>
                          <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                          </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                          {/* Product Name */}
                          <View className="mb-4">

                            <Input
                              label={t('products.product_name')}
                              placeholder={t('products.enter_product_name')}
                              value={formik.values.name}
                              onChangeText={formik.handleChange('name')}
                              error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                            />

                          </View>

                          {/* Product Description */}
                          <View className="mb-4">
                            <CustomTextArea
                              label={t('products.product_description')}
                              placeholder={t('products.enter_product_description')}
                              value={formik.values.description}
                              onChangeText={formik.handleChange('description')}
                              error={formik.touched.description && formik.errors.description ? formik.errors.description : ''}
                            />
                            {formik.touched.description && formik.errors.description && (
                              <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                                {formik.errors.description}
                              </Text>
                            )}
                          </View>

                          {/* Price */}
                          <View className="mb-4">

                            <Input
                              label={t('products.price')}
                              placeholder={t('products.enter_price')}
                              value={formik.values.price}
                              onChangeText={formik.handleChange('price')}
                              keyboardType="numeric"
                              error={formik.touched.price && formik.errors.price ? formik.errors.price : ''}
                            />

                          </View>

                          {/* Sale Price */}
                          <View className="mb-4">

                            <Input
                              label={t('products.sale_price')}
                              placeholder={t('products.enter_sale_price', { defaultValue: 'Enter sale price' })}
                              value={formik.values.sale_price}
                              onChangeText={formik.handleChange('sale_price')}
                              keyboardType="numeric"
                              error={formik.touched.sale_price && formik.errors.sale_price ? formik.errors.sale_price : ''}
                            />

                          </View>

                          {/* Category Dropdown */}
                          <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Cairo_600SemiBold' }}>
                              {t('products.category')}
                            </Text>
                            <Select
                              placeholder={t('products.select_category')}
                              options={categoryOptions}
                              value={formik.values.category_id}
                              onSelect={(value: string) => formik.setFieldValue('category_id', value)}
                            />
                            {formik.touched.category_id && formik.errors.category_id && (
                              <Text className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                                {formik.errors.category_id}
                              </Text>
                            )}
                          </View>

                          {/* Product Image */}
                          <View className="mb-6">
                            <CustomImagePicker
                              label={t('products.product_image')}
                              value={formik.values.image}
                              onImageSelect={(uri: string) => formik.setFieldValue('image', uri)}
                              placeholder={t('products.tap_to_select_image')}
                            />
                          </View>

                          {/* Submit Button */}
                          <CustomButton
                            title={formik.isSubmitting ? t('products.saving') : t('products.save')}
                            onPress={formik.handleSubmit}
                            disabled={formik.isSubmitting}
                          />
                        </ScrollView>
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </Modal>

              </>)}

          </>)}
        </>

      )}

    </SafeAreaView>
  )
}

