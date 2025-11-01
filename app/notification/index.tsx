import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import CustomHeader from '../../components/custom/customheader'

interface NotificationItem {
  id: string
  type: 'order_received' | 'order_accepted' | 'order_ready' | 'order_delivered' | 'order_cancelled'
  title: string
  message: string
  time: string
  isRead: boolean
  orderId?: string
}

export default function Notification() {
  const { t } = useTranslation()
  const router = useRouter()
  
  // Sample notification data - replace with actual data from your API
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'order_received',
      title: t('notifications.orderReceived'),
      message: 'Order #12345 from Ahmed Mohamed',
      time: '2 min ago',
      isRead: false,
      orderId: '12345'
    },
    {
      id: '2',
      type: 'order_accepted',
      title: t('notifications.orderAccepted'),
      message: 'Order #12344 has been accepted',
      time: '1 h ago',
      isRead: true,
      orderId: '12344'
    },
    {
      id: '3',
      type: 'order_ready',
      title: t('notifications.orderReady'),
      message: 'Order #12343 is ready for pickup',
      time: '2 h ago',
      isRead: true,
      orderId: '12343'
    },
    {
      id: '4',
      type: 'order_delivered',
      title: t('notifications.orderDelivered'),
      message: 'Order #12342 has been delivered successfully',
      time: 'Yesterday',
      isRead: true,
      orderId: '12342'
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_received':
        return 'notifications'
      case 'order_accepted':
        return 'checkmark-circle'
      case 'order_ready':
        return 'restaurant'
      case 'order_delivered':
        return 'bicycle'
      case 'order_cancelled':
        return 'close-circle'
      default:
        return 'notifications'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_received':
        return 'bg-blue-500'
      case 'order_accepted':
        return 'bg-green-500'
      case 'order_ready':
        return 'bg-orange-500'
      case 'order_delivered':
        return 'bg-emerald-500'
      case 'order_cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title={t('notifications.title')} />
      
      <View className="flex-1">
        {/* Header with mark all read button */}
        {notifications.length > 0 && unreadCount > 0 && (
          <View className="px-6 py-4 bg-white border-b border-gray-100">
            <TouchableOpacity
              onPress={markAllAsRead}
              className="self-end"
            >
              <Text className="text-blue-600 font-semibold text-sm">
                {t('notifications.markAllRead')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            // Empty State
            <View className="flex-1 justify-center items-center px-8 py-20">
              <View className="bg-gray-100 rounded-full p-8 mb-6">
                <Ionicons name="notifications-outline" size={48} color="#9CA3AF" />
              </View>
              
              <Text 
                className="text-xl font-bold text-gray-800 mb-3 text-center"
                style={{ fontFamily: 'Cairo_700Bold' }}
              >
                {t('notifications.noNotifications')}
              </Text>
              
              <Text 
                className="text-gray-500 text-center text-base leading-6"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                {t('notifications.noNotificationsDesc')}
              </Text>
            </View>
          ) : (
            // Notifications List
            <View className="px-6 py-4">
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id)
                    }
                    // Navigate to order details if orderId exists
                    if (notification.orderId) {
                      // router.push(`/restaurant/order-details/${notification.orderId}`)
                    }
                  }}
                  className={`mb-4 p-4 rounded-2xl shadow-sm border ${
                    notification.isRead 
                      ? 'bg-white border-gray-100' 
                      : 'bg-blue-50 border-blue-100'
                  }`}
                >
                  <View className="flex-row items-start">
                    {/* Icon */}
                    <View 
                      className={`rounded-full p-3 mr-4 ${getNotificationColor(notification.type)}`}
                    >
                      <Ionicons 
                        name={getNotificationIcon(notification.type) as any} 
                        size={20} 
                        color="white" 
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-1">
                        <Text 
                          className={`font-bold text-base ${
                            notification.isRead ? 'text-gray-800' : 'text-gray-900'
                          }`}
                          style={{ fontFamily: 'Cairo_700Bold' }}
                        >
                          {notification.title}
                        </Text>
                        
                        {!notification.isRead && (
                          <View className="bg-blue-500 rounded-full w-2 h-2 ml-2 mt-1" />
                        )}
                      </View>
                      
                      <Text 
                        className={`text-sm mb-2 ${
                          notification.isRead ? 'text-gray-600' : 'text-gray-700'
                        }`}
                        style={{ fontFamily: 'Cairo_400Regular' }}
                      >
                        {notification.message}
                      </Text>
                      
                      <View className="flex-row justify-between items-center">
                        <Text 
                          className="text-xs text-gray-500"
                          style={{ fontFamily: 'Cairo_400Regular' }}
                        >
                          {notification.time}
                        </Text>
                        
                        {notification.orderId && (
                          <View className="flex-row items-center">
                            <Text 
                              className="text-xs text-blue-600 mr-1"
                              style={{ fontFamily: 'Cairo_600SemiBold' }}
                            >
                              #{notification.orderId}
                            </Text>
                            <Ionicons name="chevron-forward" size={12} color="#2563EB" />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
