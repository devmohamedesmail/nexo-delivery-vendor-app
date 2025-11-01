import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Button } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import CustomInput from '@/components/custom/custominput'
import CustomButton from '@/components/custom/custombutton'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { AuthContext } from '@/context/auth_context'
import Logo from '@/components/logo'
import ToastManager, { Toast } from 'toastify-react-native'



export default function Login() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { auth, handle_login } = useContext(AuthContext)


  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string()
        .required(t('phone_required'))
        .test('email-or-phone', t('phone_invalid'), function (value) {
          if (!value) return false;
          // Check if it's a valid email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // Check if it's a valid phone number
          const phoneRegex = /^[0-9]{10,15}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }),
      password: Yup.string()
        .required(t('password_required'))
        .min(6, t('password_min')),
    }),

    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const result = await handle_login(values.identifier, values.password)
        Toast.show({
          text1: t('auth.login_success'),
          type: 'success',
        })

        const role = result.data.user.role;
        if (role === 'restaurant_owner') {
          router.replace('/restaurant/dashboard')
        } else if (role === 'restaurant') {
          router.replace('/')
        } else if (role === 'driver') {
          router.replace('/')
        } else {
          router.replace('/')
        }

        console.log("Login result:", result.data.user.role);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        Toast.show({
          text1: t('auth.login_failed'),
          type: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    },
  })



  return (
    <View className="flex-1 bg-white">


      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="pt-10 pb-8 px-6">
            



            {/* Logo/Brand Section */}
            <View className="items-center mb-8 pt-20">
              <Logo />
              <Text
                className="text-3xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: 'Cairo_700Bold' }}
              >
                {t('auth.welcomeBack')}
              </Text>
              <Text
                className={`text-gray-600 text-center ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                {t('auth.loginToYourAccount')}
              </Text>
            </View>
          </View>

          {/* Login Form */}
          <View className="flex-1 px-6">
            <View className="space-y-4">
              {/* Email/Phone Input */}
              <CustomInput
                label={t('auth.phone')}
                placeholder={t('auth.phone')}
                value={formik.values.identifier}
                onChangeText={formik.handleChange('identifier')}
                type="text"
                keyboardType="default"
                error={formik.touched.identifier && formik.errors.identifier ? formik.errors.identifier : undefined}
              />

              {/* Password Input */}
              <CustomInput
                label={t('auth.password')}
                placeholder={t('auth.enterPassword')}
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                type="password"
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
              />

              {/* Remember Me & Forgot Password */}
              <View className={`flex-row justify-between items-center mt-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center"
                >
                  <View className={`w-5 h-5 border-2 border-gray-300 rounded mr-2 items-center justify-center ${rememberMe ? 'bg-primary border-primary' : ''}`}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
                  </View>
                  <Text
                    className="text-black"
                    style={{ fontFamily: 'Cairo_400Regular' }}
                  >
                    {t('auth.rememberMe')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { }}>
                  <Text
                    className="text-primary font-medium"
                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                  >
                    {t('auth.forgotPassword')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <View className="mt-8">
                <CustomButton
                  title={isLoading ? t('auth.signingIn') : t('auth.signIn')}
                  onPress={formik.handleSubmit}
                  disabled={isLoading || !formik.isValid || !formik.dirty || !formik.values.identifier || !formik.values.password}
                />
              </View>



              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mt-8 mb-8">
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: 'Cairo_400Regular' }}
                >
                  {t('auth.dontHaveAccount')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/auth/register')}>
                  <Text
                    className="text-primary font-semibold ml-1"
                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                  >
                    {t('auth.signUp')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
