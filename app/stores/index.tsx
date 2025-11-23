import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { AuthContext } from '@/context/auth_context'
import { useContext } from 'react'
import useFetch from '@/hooks/useFetch'
import { useRouter } from 'expo-router'
import NoStore from '@/components/store/NoStore'
import NotificationIcon from '@/components/common/NotificationIcon'
import Skeleton from '@/components/common/Skeleton'

interface ManagementCard {
    title: string
    subtitle: string
    icon: keyof typeof Ionicons.glyphMap
    route: string
    color: string
    bgColor: string
}

export default function Home() {
    const { t } = useTranslation()
    const { auth } = useContext(AuthContext)
    const router = useRouter()
    const { data: profileData,
        loading: profileLoading,
        error: profileError,
        refetch: refetchProfile
    } = useFetch(`/users/profile/${auth?.user?.id}`)




    const managementCards: ManagementCard[] = [
        {
            title: t('store.categories'),
            subtitle: t('store.manage_product_categories'),
            icon: 'grid-outline',
            route: '/stores/categories',
            color: '#3B82F6',
            bgColor: '#EFF6FF',
        },
        {
            title: t('store.products'),
            subtitle: t('store.manage_your_products'),
            icon: 'cube-outline',
            route: '/stores/products',
            color: '#10B981',
            bgColor: '#ECFDF5',
        },
        {
            title: t('store.orders'),
            subtitle: t('store.view_manage_orders'),
            icon: 'receipt-outline',
            route: '/stores/orders',
            color: '#F59E0B',
            bgColor: '#FFFBEB',
        },
        {
            title: t('account.account'),
            subtitle: t('account.description'),
            icon: 'person-outline',
            route: '/account',
            color: '#EF4444',
            bgColor: '#FEF2F2',
        },
    ]
    return (
        <SafeAreaView className="flex-1 bg-gray-50 " edges={["bottom"]}>
            <StatusBar barStyle="light-content" backgroundColor="black" />

            <View className="flex-row items-center justify-between pt-20 px-4 py-4 bg-black/90 shadow-sm">
                <NotificationIcon />
                <Text className="text-2xl font-bold text-white">{t('store.homeTitle', { defaultValue: 'Driver Home' })}</Text>
                <TouchableOpacity
                    onPress={() => router.push('/account')}
                    className="p-2 rounded-full bg-primary"
                    accessibilityLabel={t('account.profile')}
                >
                    <Ionicons name="person-circle-outline" size={28} color="white" />
                </TouchableOpacity>
            </View>




            {profileData?.data?.store ? (
                <>
                    <ScrollView className="flex-1 p-4">
                        {/* Store Info Header */}
                        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                            <View className="flex-row items-center mb-4">
                                <View className="bg-primary/10 w-16 h-16 rounded-full items-center justify-center mr-4">
                                    {/* <Ionicons name="storefront" size={32} color="#fd4a12" /> */}
                                    <Image source={{ uri: profileData?.data?.store?.logo }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-2xl font-bold text-black-800" >
                                        {profileData?.data?.store?.name}
                                    </Text>
                                    <Text className="text-black mt-1" >
                                        {t('store.store_management')}
                                    </Text>
                                </View>
                            </View>

                            {/* Quick Stats */}
                            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <View className="items-center flex-1">
                                    <Ionicons name="stats-chart" size={24} color="#10B981" />
                                    <Text className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                                        {t('store.active')}
                                    </Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Ionicons name="star" size={24} color="#F59E0B" />
                                    <Text className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                                        {t('store.rating')}
                                    </Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Ionicons name="people" size={24} color="#3B82F6" />
                                    <Text className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'Cairo_400Regular' }}>
                                        {t('store.customers')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Management Section */}
                        <View className="mb-4">
                            <Text className="text-lg font-bold text-black-800 mb-3 px-2" >
                                {t('store.store_management')}
                            </Text>

                            <View className="space-y-3">
                                {managementCards.map((card, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => router.push(card.route as any)}
                                        className="bg-white rounded-xl p-5 shadow-sm active:opacity-70"
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center">
                                            <View
                                                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                                style={{ backgroundColor: card.bgColor }}
                                            >
                                                <Ionicons name={card.icon} size={28} color={card.color} />
                                            </View>

                                            <View className="flex-1">
                                                <Text className="text-lg font-bold text-gray-800" >
                                                    {card.title}
                                                </Text>
                                                <Text className="text-gray-500 text-sm mt-1" >
                                                    {card.subtitle}
                                                </Text>
                                            </View>

                                            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>


                    </ScrollView>
                </>
            ) : (
                <>
                    <NoStore />
                </>
            )}
            {/* {profileLoading ? <Loading /> : null} */}
        </SafeAreaView>
    )
}
