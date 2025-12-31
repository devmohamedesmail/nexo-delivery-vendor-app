import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, StatusBar, Alert, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { AuthContext } from '@/context/auth-provider'
import { SafeAreaView } from 'react-native-safe-area-context'
import AccountButton from '@/components/common/accoun-button'
import i18n from '@/i18n/locales/i18n'
import AccountActionsButtons from '@/components/account/AccountActionsButtons'
import Header from '@/components/ui/Header'
import AccountSettingButton from '@/components/account/AccountSettingButton'
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '@/constants/Colors'



export default function Account() {
  const { t } = useTranslation()
  const { auth } = useContext(AuthContext)



  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="black" />


      <Header title={t('account.account')} />

      {/* Settings Content */}
      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm">
          <View className="p-6 items-center border-b border-gray-100">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Cairo_700Bold' }}>
                {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text
              className="text-lg font-bold text-gray-800"
              style={{ fontFamily: 'Cairo_700Bold' }}
            >
              {auth?.user?.name || t('user')}
            </Text>
            <Text
              className="text-gray-500 mt-1"
              style={{ fontFamily: 'Cairo_400Regular' }}
            >
              {auth?.user?.identifier || 'user@example.com'}
            </Text>
            <View className="mt-2 bg-primary/10 px-3 py-1 rounded-full">
              <Text
                className="text-primary text-sm font-medium"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {/* {auth?.user?.role?.role || t('user')} */}
                {auth?.user?.role?.role === "store_owner" ? t('account.store_owner') : ''}
                {auth?.user?.role?.role === "driver" ? t('account.driver') : ''}
              </Text>
            </View>
          </View>


        </View>



        <View className='px-5'>
          <AccountSettingButton
            title={t('account.whatsup_support')}
            onPress={() => Linking.openURL('https://wa.me/+971589107126')}
            icon={<AntDesign name="whats-app" size={20} color={Colors.light.tabIconSelected} />}
          />
          <AccountSettingButton
            title={t('account.phone_support')}
            onPress={() => Linking.openURL('tel:+971589107126')}
            icon={<AntDesign name="phone" size={20} color={Colors.light.tabIconSelected} />}
          />
        </View>

        <AccountActionsButtons />

        {/* App Version */}
        <View className="items-center py-8">
          <Text
            className="text-gray-400 text-sm"
            style={{ fontFamily: 'Cairo_400Regular' }}
          >
            {t('account.app_version')} 1.0.0
          </Text>
        </View>
      </ScrollView>


    </SafeAreaView>
  )
}
