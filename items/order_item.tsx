import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

export default function OrderItem({ order }: { order: any }) {
    const { t } = useTranslation();
    console.log("order item", order);

    return (
        <View className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Status Bar */}


            <View className="p-6">
                {/* Enhanced Order Header */}
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="receipt" size={16} color="#3B82F6" />
                            </View>
                            <Text
                                className="text-lg font-bold text-gray-800"
                                style={{ fontFamily: 'Cairo_700Bold' }}
                            >
                                {t('order')}
                            </Text>
                        </View>

                        <View className="flex-row items-center ml-11">
                            <Ionicons name="person" size={16} color="#6B7280" />
                            <Text
                                className="text-gray-600 ml-2 font-medium"
                                style={{ fontFamily: 'Cairo_500Medium' }}
                            >

                                {order.user.name}
                            </Text>
                        </View>
                    </View>

                    <View className="items-end">
                        <View className={`px-4 py-2 rounded-xl  shadow-sm`}>
                            <View className="flex-row items-center">
                                {/* <Ionicons name={getStatusIcon(order.status)} size={16} color="currentColor" /> */}
                                <Ionicons name="ellipse" size={12} color="#10B981" />
                                <Text
                                    className="ml-2 font-bold text-sm"
                                    style={{ fontFamily: 'Cairo_700Bold' }}
                                >
                                    {order.status}
                                </Text>
                            </View>
                        </View>

                        <View className="bg-green-50 px-3 py-1 rounded-lg mt-2">
                            <Text
                                className="text-2xl font-bold text-green-700"
                                style={{ fontFamily: 'Cairo_700Bold' }}
                            >
                                {/* ${order.total_amount} */}
                                {order.total_price}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Enhanced Order Details */}
                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="space-y-3">
                        <View className="flex-row items-center">
                            <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="call" size={14} color="#10B981" />
                            </View>
                            <Text
                                className="text-gray-700 font-medium"
                                style={{ fontFamily: 'Cairo_500Medium' }}
                            >
                                {order.phone}
                            </Text>
                        </View>

                        <View className="flex-row items-start">
                            <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                                <Ionicons name="location" size={14} color="#3B82F6" />
                            </View>
                            <Text
                                className="text-gray-700 flex-1 font-medium"
                                style={{ fontFamily: 'Cairo_400Regular' }}
                            >
                                {order.delivery_address}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-6 h-6 bg-purple-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="time" size={14} color="#8B5CF6" />
                            </View>
                            <Text
                                className="text-gray-700 font-medium"
                                style={{ fontFamily: 'Cairo_400Regular' }}
                            >
                                order date
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Enhanced Order Items */}
                <View className="mb-4">
                    <Text
                        className="text-lg font-bold text-gray-800 mb-3"
                        style={{ fontFamily: 'Cairo_700Bold' }}
                    >
                        {t('order_items')}
                    </Text>

                    <View className="bg-gray-50 rounded-xl p-4">

                        {/* order item */}
                        {order && order.order && order.order.map((item:any, index:any) => (
                            <View key={index} className={`flex-row justify-between items-center py-3}`}>
                                <View className="flex-row items-center flex-1">
                                    <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
                                        <Text
                                            className="text-orange-600 font-bold text-sm"
                                            style={{ fontFamily: 'Cairo_700Bold' }}
                                        >
                                           { item.quantity}
                                        </Text>
                                    </View>
                                    <Text
                                        className="text-gray-800 font-medium flex-1"
                                        style={{ fontFamily: 'Cairo_500Medium' }}
                                    >
                                        {item.name}
                                    </Text>
                                </View>

                                <View className="bg-white px-3 py-1 rounded-lg">
                                    <Text
                                        className="text-gray-800 font-bold"
                                        style={{ fontFamily: 'Cairo_700Bold' }}
                                    >
                                        {item.price}
                                    </Text>
                                </View>
                            </View>
                        ))}

                    </View>
                </View>

                {/* Enhanced Action Buttons */}
                {/* {order.status === 'pending' && (
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => updateOrderStatus(order.id, 'cancelled')}
                            className="flex-1 bg-white border-2 border-red-300 py-4 rounded-2xl shadow-sm"
                            style={{
                                shadowColor: '#EF4444',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3
                            }}
                        >
                            <View className="flex-row items-center justify-center">
                                <View className="w-6 h-6 bg-red-100 rounded-full items-center justify-center mr-2">
                                    <Ionicons name="close" size={14} color="#DC2626" />
                                </View>
                                <Text
                                    className="text-red-600 font-bold text-base"
                                    style={{ fontFamily: 'Cairo_700Bold' }}
                                >
                                    {t('reject')}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => updateOrderStatus(order.id, 'accepted')}
                            className="flex-1 bg-green-500 py-4 rounded-2xl shadow-lg"
                            style={{
                                shadowColor: '#10B981',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6
                            }}
                        >
                            <View className="flex-row items-center justify-center">
                                <View className="w-6 h-6 bg-white bg-opacity-20 rounded-full items-center justify-center mr-2">
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                                <Text
                                    className="text-white font-bold text-base"
                                    style={{ fontFamily: 'Cairo_700Bold' }}
                                >
                                    {t('accept')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )} */}

                {/* {order.status === 'accepted' && (
                    <TouchableOpacity
                        onPress={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-orange-500 py-5 rounded-2xl shadow-lg"
                        style={{
                            shadowColor: '#F97316',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            <View className="w-8 h-8 bg-white bg-opacity-20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="restaurant" size={18} color="white" />
                            </View>
                            <Text
                                className="text-white font-bold text-lg"
                                style={{ fontFamily: 'Cairo_700Bold' }}
                            >
                                {t('start_preparing')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )} */}

                {/* {order.status === 'preparing' && (
                    <TouchableOpacity
                        onPress={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-blue-500 py-5 rounded-2xl shadow-lg"
                        style={{
                            shadowColor: '#3B82F6',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            <View className="w-8 h-8 bg-white bg-opacity-20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="bag-check" size={18} color="white" />
                            </View>
                            <Text
                                className="text-white font-bold text-lg"
                                style={{ fontFamily: 'Cairo_700Bold' }}
                            >
                                {t('mark_ready')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )} */}

                {/* {order.status === 'ready' && (
                    <TouchableOpacity
                        onPress={() => updateOrderStatus(order.id, 'completed')}
                        className="bg-emerald-500 py-5 rounded-2xl shadow-lg"
                        style={{
                            shadowColor: '#10B981',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            <View className="w-8 h-8 bg-white bg-opacity-20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="checkmark-done" size={18} color="white" />
                            </View>
                            <Text
                                className="text-white font-bold text-lg"
                                style={{ fontFamily: 'Cairo_700Bold' }}
                            >
                                {t('mark_completed')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )} */}
            </View>
        </View>
    )
}
