import { AuthContext } from '@/context/auth_context'
import React, { useContext, useEffect } from 'react'
import { Text, SafeAreaView } from 'react-native'
import { Redirect } from 'expo-router'
import RestaurantHomeScreen from '@/components/RestaurantHomeScreen'
import DriverHomeScreen from '@/components/DriverHomeScreen'
import Loading from '@/components/custom/Loading'




export default function Home() {
  const { auth, isLoading } = useContext(AuthContext)

  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Loading />
    )
  }

  // If no auth, redirect to login
  if (!auth) {
    return <Redirect href="/auth/login" />
  }

  // Show appropriate home screen based on user role
  if (auth?.user?.role.id === 5) {
    return <DriverHomeScreen />
  } else if (auth?.user?.role.id === 3) {
    return <RestaurantHomeScreen />
  } else {
    // Fallback for unknown role
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">Unknown user role
          {auth?.user?.role.id}
        </Text>
      </SafeAreaView>
    )
  }
}
