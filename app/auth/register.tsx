import React, { useState, useContext } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/ui/Input'
import { AuthContext } from '@/context/auth_context'
import Button from '@/components/ui/Button'
import { Toast } from 'toastify-react-native'
import { useRouter } from 'expo-router'
import Logo from '@/components/common/logo'
import { SafeAreaView } from 'react-native-safe-area-context'

type UserRole = 3 | 5 

interface RegisterFormValues {
    name: string
    identifier: string
    password: string
    role_id: number | string
}

export default function Register() {
    const { t, i18n } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const { handle_register } = useContext(AuthContext)
    const router = useRouter()


    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, t('name_required'))
            .required(t('name_required')),
        // identifier: Yup.string()
        //     .matches(/^[0-9]{10,15}$/, t('phone_invalid'))
        //     .required(t('phone_required')),
        identifier: Yup.string().email(t('identifier_invalid')).required(t('identifier_required')),
        password: Yup.string()
            .min(6, t('password_min'))
            .required(t('password_required')),
        role_id: Yup.number()
            .oneOf([3, 5], t('role_required'))
            .required(t('role_required'))
    })

    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            name: '',
            identifier: '',
            password: '',
            role_id: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true)

            try {

                const result = await handle_register(values.name, values.identifier, values.password, values.role_id)
                if (result.success) {

                    Toast.show({
                        type: 'success',
                        text1: t('auth.registration_success'),
                        position: 'top',
                        visibilityTime: 3000,
                    });

                    if (values.role_id === 3) {
                        // setTab('2')
                        router.push('/stores/create')
                    } else if (values.role_id === 5) {
                        // setTab('3')
                        router.push('/driver/create')
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        text1: t('auth.registration_failed'),
                        position: 'top',
                        visibilityTime: 3000,
                    });

                }


            } catch (error) {
                Alert.alert('Error', 'Network error. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }
    })

    const roleOptions: { value: UserRole; label: string; icon: string }[] = [
        {
            value: 3,
            label: t('auth.store_owner'),
            icon: 'storefront-outline'
        },
        {
            value: 5,
            label: t('auth.driver'),
            icon: 'car-outline'
        }
    ]




    return (
        <SafeAreaView className="flex-1 " edges={["bottom"]}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >



                    <View className="pt-10 pb-8 px-6 bg-black">




                        {/* Logo/Brand Section */}
                        <View className="items-center mb-8 pt-20">

                            <View className="bg-white p-4 rounded-full overflow-hidden">
                                <Logo />
                            </View>
                            <Text className="text-3xl  text-white font-extrabold mt-4 mb-2" >
                                {t('auth.createAccount')}
                            </Text>
                    
                        </View>
                    </View>


                    <View className="flex-1 px-6 rounded-t-3xl -mt-6 bg-white pt-10">



                        {/* Name Input */}
                        <Input
                            label={t('auth.name')}
                            placeholder={t('auth.enterName')}
                            type="text"
                            value={formik.values.name}
                            onChangeText={formik.handleChange('name')}

                            error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
                        />

                        {/* Phone Number Input */}
                        <Input
                            label={t('auth.identifier')}
                            placeholder={t('auth.identifier')}
                            type="email"
                            value={formik.values.identifier}
                            onChangeText={formik.handleChange('identifier')}

                            error={formik.touched.identifier && formik.errors.identifier ? formik.errors.identifier : undefined}
                        />

                        {/* Password Input */}
                        <Input
                            label={t('auth.password')}
                            placeholder={t('auth.enterPassword')}
                            type="password"
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}

                            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                        />

                        {/* Role Selection */}
                        <View className="my-6">
                            <View className="space-y-3">
                                {roleOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => formik.setFieldValue('role_id', option.value)}
                                        className={`border rounded-xl p-4 mb-3 flex-row-reverse items-center  ${formik.values.role_id === option.value
                                            ? 'border-primary bg-black-50'
                                            : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${formik.values.role_id === option.value
                                            ? 'bg-blue-100'
                                            : 'bg-gray-100'
                                            }`}>
                                            <Ionicons
                                                name={option.icon as any}
                                                size={20}
                                                color={formik.values.role_id === option.value ? 'red' : '#6B7280'}
                                            />
                                        </View>
                                        <Text className={`flex-1 text-right ${formik.values.role_id === option.value
                                            ? 'text-priamry'
                                            : 'text-gray-700'
                                            }`}>
                                            {option.label}
                                        </Text>
                                        {formik.values.role_id === option.value && (
                                            <Ionicons name="checkmark-circle" size={24} color="#0c0c0cff" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {formik.touched.role_id && formik.errors.role_id && (
                                <Text className="text-red-500 text-sm mt-2">
                                    {formik.errors.role_id}
                                </Text>
                            )}
                        </View>

                        <Button
                            title={isLoading ? t('auth.wait') : t('auth.next')}
                            onPress={() => formik.handleSubmit()}
                            disabled={isLoading || !formik.isValid || !formik.dirty || !formik.values.identifier || !formik.values.password}
                        
                        />







                        {/* Terms and Sign In Link */}
                        <View className="mb-10 py-10">


                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600 ">{t('auth.alreadyHaveAccount')} </Text>
                                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                    <Text className="text-primary ">{t('auth.signIn')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
