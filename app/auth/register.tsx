import React, { useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/ui/Input'
import { AuthContext } from '@/context/auth-provider'
import Button from '@/components/ui/button'
import { Toast } from 'toastify-react-native'
import { useRouter } from 'expo-router'
import Logo from '@/components/common/logo'
import AuthLayout from '@/components/auth/AuthLayout'
import Header from '@/components/auth/Header'
import RoleOptions from '@/components/auth/RoleOptions'



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
            .min(2, t('auth.name_required'))
            .required(t('auth.name_required')),
        // identifier: Yup.string()
        //     .matches(/^[0-9]{10,15}$/, t('phone_invalid'))
        //     .required(t('phone_required')),
        identifier: Yup.string().email(t('auth.identifier_invalid')).required(t('auth.identifier_required')),
        password: Yup.string()
            .min(6, t('auth.password_min'))
            .required(t('auth.password_required')),
        role_id: Yup.number()
            .oneOf([3, 5], t('auth.role_required'))
            .required(t('auth.role_required'))
    })

    const formik = useFormik<RegisterFormValues>({
        initialValues: {
            name: '',
            identifier: '',
            password: '',
            role_id: 3,
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
                        router.push('/stores/create')
                    } else if (values.role_id === 5) {
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






    return (
        <AuthLayout>
            <Header title={t('auth.createAccount')} description={t('auth.registerDescription')} />

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
                {/* <RoleOptions formik={formik} /> */}




                <View className='mt-10'>
                    <Button
                        title={isLoading ? t('auth.wait') : t('auth.next')}
                        onPress={() => formik.handleSubmit()}
                        disabled={isLoading || !formik.isValid || !formik.dirty || !formik.values.identifier || !formik.values.password}

                    />
                </View>







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
        </AuthLayout>
    )
}
