import React, { useContext, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import CustomHeader from '../../components/custom/customheader'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { AuthContext } from '@/context/auth_context'

interface SettingItem {
    id: string
    title: string
    subtitle?: string
    icon: string
    type: 'navigation' | 'toggle' | 'action' | 'language'
    value?: boolean
    onPress?: () => void
    dangerous?: boolean
}

export default function Settings() {
    const { t } = useTranslation()
    const router = useRouter()
    const {logout} = useContext(AuthContext)

    // Settings state
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
    const [orderAlertsEnabled, setOrderAlertsEnabled] = useState(true)

    const handleLogout = () => {
        Alert.alert(
            t('settings.logout'),
            t('settings.logoutConfirm'),
            [
                {
                    text: t('settings.cancel'),
                    style: 'cancel'
                },
                {
                    text: t('settings.confirm'),
                    style: 'destructive',
                    onPress: async () => {
                        // Implement logout logic here
                        await logout();
                        router.replace('/auth/login')
                    }
                }
            ]
        )
    }

    const showComingSoon = (feature: string) => {
        Alert.alert(
            t('settings.comingSoon'),
            t('settings.featureComingSoon'),
            [{ text: 'OK' }]
        )
    }

    const settingSections = [
        // Account Section
        {
            title: t('settings.account'),
            items: [
                {
                    id: 'profile',
                    title: t('settings.editProfile'),
                    subtitle: t('settings.personalInfo'),
                    icon: 'person-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Profile')
                },
                {
                    id: 'password',
                    title: t('settings.changePassword'),
                    icon: 'lock-closed-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Change Password')
                }
            ]
        },

        // Restaurant Section
        {
            title: t('settings.restaurant'),
            items: [
                {
                    id: 'restaurant-info',
                    title: t('settings.restaurantInfo'),
                    icon: 'restaurant-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Restaurant Info')
                },
                {
                    id: 'opening-hours',
                    title: t('settings.openingHours'),
                    icon: 'time-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Opening Hours')
                },
                {
                    id: 'menu-management',
                    title: t('settings.menuManagement'),
                    icon: 'menu-outline',
                    type: 'navigation' as const,
                    onPress: () => router.push('/restaurant/menu')
                },
                {
                    id: 'order-settings',
                    title: t('settings.orderSettings'),
                    icon: 'receipt-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Order Settings')
                }
            ]
        },

        // Preferences Section
        {
            title: t('settings.preferences'),
            items: [
                {
                    id: 'language',
                    title: t('settings.language'),
                    icon: 'language-outline',
                    type: 'language' as const
                },
                {
                    id: 'notifications',
                    title: t('settings.pushNotifications'),
                    icon: 'notifications-outline',
                    type: 'toggle' as const,
                    value: notificationsEnabled,
                    onPress: () => setNotificationsEnabled(!notificationsEnabled)
                },
                {
                    id: 'email-notifications',
                    title: t('settings.emailNotifications'),
                    icon: 'mail-outline',
                    type: 'toggle' as const,
                    value: emailNotificationsEnabled,
                    onPress: () => setEmailNotificationsEnabled(!emailNotificationsEnabled)
                },
                {
                    id: 'order-alerts',
                    title: t('settings.orderAlerts'),
                    icon: 'alert-circle-outline',
                    type: 'toggle' as const,
                    value: orderAlertsEnabled,
                    onPress: () => setOrderAlertsEnabled(!orderAlertsEnabled)
                }
            ]
        },

        // Privacy & Security Section
        {
            title: t('settings.privacy'),
            items: [
                {
                    id: 'privacy-policy',
                    title: t('settings.privacyPolicy'),
                    icon: 'shield-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Privacy Policy')
                },
                {
                    id: 'terms',
                    title: t('settings.termsOfService'),
                    icon: 'document-text-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Terms of Service')
                },
                {
                    id: 'data-protection',
                    title: t('settings.dataProtection'),
                    icon: 'lock-open-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Data Protection')
                }
            ]
        },

        // Support Section
        {
            title: t('settings.support'),
            items: [
                {
                    id: 'help',
                    title: t('settings.helpCenter'),
                    icon: 'help-circle-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Help Center')
                },
                {
                    id: 'contact',
                    title: t('settings.contactUs'),
                    icon: 'mail-open-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Contact Us')
                },
                {
                    id: 'report',
                    title: t('settings.reportIssue'),
                    icon: 'flag-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Report Issue')
                },
                {
                    id: 'faq',
                    title: t('settings.faq'),
                    icon: 'chatbubble-ellipses-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('FAQ')
                }
            ]
        },

        // About Section
        {
            title: t('settings.about'),
            items: [
                {
                    id: 'version',
                    title: t('settings.appVersion'),
                    subtitle: '1.0.0',
                    icon: 'information-circle-outline',
                    type: 'navigation' as const,
                    onPress: () => { }
                },
                {
                    id: 'rate',
                    title: t('settings.rateApp'),
                    icon: 'star-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Rate App')
                },
                {
                    id: 'share',
                    title: t('settings.shareApp'),
                    icon: 'share-outline',
                    type: 'navigation' as const,
                    onPress: () => showComingSoon('Share App')
                }
            ]
        }
    ]

    const renderSettingItem = (item: SettingItem) => {
        if (item.type === 'language') {
            return (
                <View key={item.id} className="bg-white mx-4 mb-2 rounded-2xl shadow-sm border border-gray-100">
                    <View className="p-4">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View className="bg-gray-100 p-3 rounded-xl mr-4">
                                    <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                                </View>
                                <View className="flex-1">
                                    <Text
                                        className="text-base font-semibold text-gray-800"
                                        style={{ fontFamily: 'Cairo_600SemiBold' }}
                                    >
                                        {item.title}
                                    </Text>
                                </View>
                            </View>
                            <LanguageSwitcher />
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <TouchableOpacity
                key={item.id}
                onPress={item.onPress}
                className="bg-white mx-4 mb-2 rounded-2xl shadow-sm border border-gray-100"
            >
                <View className="p-4">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className={`p-3 rounded-xl mr-4 ${item.dangerous ? 'bg-red-100' : 'bg-gray-100'}`}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={20}
                                    color={item.dangerous ? '#EF4444' : '#6B7280'}
                                />
                            </View>

                            <View className="flex-1">
                                <Text
                                    className={`text-base font-semibold ${item.dangerous ? 'text-red-600' : 'text-gray-800'}`}
                                    style={{ fontFamily: 'Cairo_600SemiBold' }}
                                >
                                    {item.title}
                                </Text>
                                {item.subtitle && (
                                    <Text
                                        className="text-sm text-gray-500 mt-1"
                                        style={{ fontFamily: 'Cairo_400Regular' }}
                                    >
                                        {item.subtitle}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {item.type === 'toggle' ? (
                            <Switch
                                value={item.value}
                                onValueChange={item.onPress}
                                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                                thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                            />
                        ) : (
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <CustomHeader title={t('settings.title')} />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                <View className="py-6">
                    {settingSections.map((section, sectionIndex) => (
                        <View key={sectionIndex} className="mb-6">
                            {/* Section Header */}
                            <Text
                                className="text-sm font-bold text-gray-600 mb-3 mx-6"
                                style={{ fontFamily: 'Cairo_700Bold' }}
                            >
                                {section.title.toUpperCase()}
                            </Text>

                            {/* Section Items */}
                            {section.items.map((item) => renderSettingItem(item))}
                        </View>
                    ))}

                    {/* Logout Button */}
                    <View className="mx-4 mt-4 mb-8">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-white rounded-2xl shadow-sm border border-red-200"
                        >
                            <View className="p-4">
                                <View className="flex-row items-center justify-center">
                                    <View className="bg-red-100 p-3 rounded-xl mr-4">
                                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                                    </View>

                                    <Text
                                        className="text-base font-semibold text-red-600 flex-1"
                                        style={{ fontFamily: 'Cairo_600SemiBold' }}
                                    >
                                        {t('settings.logout')}
                                    </Text>

                                    <Ionicons name="chevron-forward" size={16} color="#EF4444" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
