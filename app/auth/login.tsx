import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import CustomInput from '@/components/custom/Input'
import CustomButton from '@/components/custom/Button'
import { AuthContext } from '@/context/auth_context'
import Logo from '@/components/common/logo'
import { Toast } from 'toastify-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Skeleton from '@/components/common/Skeleton'



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
        .email(t('auth.identifier_invalid'))
        .required(t('auth.identifier_required')),
      password: Yup.string()
        .required(t('auth.password_required'))
        .min(6, t('auth.password_min')),
    }),

    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const result = await handle_login(values.identifier, values.password)
        Toast.show({
          text1: t('auth.login_success'),
          text2: t('auth.welcomeBack'),
          type: 'success',
        })

        const role = result.data.user.role.role;

        if (role === 'store_owner') {
          router.replace('/stores')
        } else if (role === 'driver') {
          router.replace('/driver')
        } else {
          router.replace('/')
        }
        setIsLoading(false)
      } catch (error: any) {
        setIsLoading(false)
        Toast.show({
          text1: t('auth.login_failed'),
          text2: t('auth.checkCredentials'),
          type: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    },
  })



  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>


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
          <View className="pt-10 pb-8 px-6 bg-black">

          
            
           


            {/* Logo/Brand Section */}
            <View className="items-center mb-8 pt-20">

              <View className="bg-white p-4 rounded-full overflow-hidden">
                <Logo />
              </View>
              <Text
                className="text-3xl  text-white font-extrabold mt-4 mb-2"
              >
                {t('auth.welcomeBack')}
              </Text>
              <Text
                className={`text-white text-center ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}

              >
                {t('auth.loginToYourAccount')}
              </Text>
            </View>
          </View>

          {/* Login Form */}
          <View className="flex-1 px-6 rounded-t-3xl -mt-6 bg-white pt-10">
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

                  >
                    {t('auth.rememberMe')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { }}>
                  <Text
                    className="text-primary font-medium"
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

                >
                  {t('auth.dontHaveAccount')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/auth/register')}>
                  <Text
                    className="text-primary font-semibold ml-1"
                  >
                    {t('auth.signUp')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
