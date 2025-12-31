import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FontAwesome, AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { config } from '@/constants/config';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/context/auth-provider';
import Button from '../ui/button';
import CustomModal from '../ui/CustomModal';
import Colors from '@/constants/Colors';
import OrderController, { Order } from '@/controllers/orders/controller';

const statusConfig = {
    pending: { 
        color: 'bg-amber-100', 
        textColor: 'text-amber-700', 
        borderColor: 'border-amber-200' 
    },
    accepted: { 
        color: 'bg-blue-100', 
        textColor: 'text-blue-700', 
        borderColor: 'border-blue-200' 
    },
    preparing: { 
        color: 'bg-purple-100', 
        textColor: 'text-purple-700', 
        borderColor: 'border-purple-200' 
    },
    on_the_way: { 
        color: 'bg-indigo-100', 
        textColor: 'text-indigo-700', 
        borderColor: 'border-indigo-200' 
    },
    delivered: { 
        color: 'bg-green-100', 
        textColor: 'text-green-700', 
        borderColor: 'border-green-200' 
    },
    cancelled: { 
        color: 'bg-red-600', 
        textColor: 'text-white', 
        borderColor: 'border-red-600' 
    },
};

interface OrderItemProps {
    item: Order;
}

export default function OrderItem({ item }: OrderItemProps) {
    const { t, i18n } = useTranslation();
    const { auth } = useAuth();
    const { store } = useStore();
    const queryClient = useQueryClient();
    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    const statusStyle = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;

    const acceptMutation = useMutation({
        mutationFn: (orderId: number) => 
            OrderController.acceptOrder({ orderId, token: auth.token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders', store?.id] });
            Toast.success(t('orders.orderAcceptedSuccessfully'));
        },
        onError: () => {
            Toast.error(t('orders.failedToAcceptOrder'));
        },
    });

    const cancelMutation = useMutation({
        mutationFn: (orderId: number) => 
            OrderController.cancelOrder({ orderId, token: auth.token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders', store?.id] });
            Toast.success(t('orders.orderCancelledSuccessfully'));
            setCancelModalVisible(false);
        },
        onError: () => {
            Toast.error(t('orders.orderCancellationFailed'));
        },
    });

    const handleAcceptOrder = () => {
        acceptMutation.mutate(item.id);
    };

    const handleCancelOrder = () => {
        cancelMutation.mutate(item.id);
    };


    return (
        <View>
            <View className="bg-white mx-4 mb-4 rounded-2xl border border-gray-100 shadow-sm">
                {/* Header */}
                <View className="p-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                            <Text className="text-gray-500 text-xs mb-1">
                                {t('orders.orderId')}
                            </Text>
                            <Text className="text-gray-900 font-bold text-lg">
                                #{item.id}
                            </Text>
                        </View>
                        <View className={`${statusStyle.color} px-3 py-2 rounded-full`}>
                            <Text className={`${statusStyle.textColor} font-semibold text-xs`}>
                                {t(`orders.${item.status === 'on_the_way' ? 'onTheWay' : item.status}`)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Order Items */}
                <View className="p-4 border-b border-gray-100">
                    <Text className="text-gray-700 font-semibold mb-3">
                        {t('orders.items')} ({item.order.length})
                    </Text>
                    {item.order.map((orderItem: any, index: number) => (
                        <View key={index} className="flex-row justify-between items-center mb-2">
                            <View className="flex-row items-center flex-1">
                                <View className="bg-gray-100 w-8 h-8 rounded-lg justify-center items-center mr-3">
                                    <Text className="text-gray-600 font-bold text-xs">
                                        {orderItem.quantity}x
                                    </Text>
                                </View>
                                <Text className="text-gray-700 flex-1" numberOfLines={1}>
                                    {orderItem.name}
                                </Text>
                            </View>
                            <Text className="text-gray-900 font-semibold ml-2">
                                {config.CURRENCY} {orderItem.price}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View className="p-4">
                    <View className={`flex-row justify-between items-center mb-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Text className="text-gray-600 font-medium">
                            {t('orders.totalAmount')}
                        </Text>
                        <Text className="text-gray-900 font-bold text-xl">
                            {config.CURRENCY} {item.total_price}
                        </Text>
                    </View>

                    {item?.user?.name && (
                        <View className="flex-row items-center mb-3">
                            <FontAwesome 
                                name="user" 
                                size={18} 
                                color={Colors.light.tabIconSelected} 
                            />
                            <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                                {item.user.name}
                            </Text>
                        </View>
                    )}

                    <View className="flex-row items-center mb-3">
                        <FontAwesome6 
                            name="location-dot" 
                            size={18} 
                            color={Colors.light.tabIconSelected} 
                        />
                        <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                            {item.delivery_address}
                        </Text>
                    </View>

                    {item.phone && (
                        <View className="flex-row items-center mb-4">
                            <AntDesign 
                                name="phone" 
                                size={18} 
                                color={Colors.light.tabIconSelected} 
                            />
                            <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                                {item.phone}
                            </Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    {item.status === 'pending' && (
                        <View className="flex-row gap-3">
                            <Button
                                title={acceptMutation.isPending 
                                    ? t('orders.acceptingOrder') 
                                    : t('orders.acceptOrder')
                                }
                                className="flex-1"
                                onPress={handleAcceptOrder}
                                disabled={acceptMutation.isPending}
                            />

                            <Button
                                title={t('orders.cancelOrder')}
                                className="flex-1"
                                style={{ backgroundColor: '#ef4444' }}
                                onPress={() => setCancelModalVisible(true)}
                                disabled={cancelMutation.isPending}
                            />
                        </View>
                    )}

                    {(item.status === 'preparing' || item.status === 'on_the_way') && (
                        <TouchableOpacity className="bg-primary py-3 rounded-xl">
                            <Text className="text-white font-bold text-center">
                                {t('orders.trackOrder')}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {item.status === 'delivered' && (
                        <TouchableOpacity className="bg-green-500 py-3 rounded-xl">
                            <Text className="text-white font-bold text-center">
                                {t('orders.orderAgain')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Cancel Order Modal */}
            <CustomModal
                visible={cancelModalVisible}
                onClose={() => setCancelModalVisible(false)}
            >
                <Text className="text-center font-bold text-lg">
                    {t('orders.cancelOrder')}
                </Text>
                <Text className="text-center mt-4 text-gray-600">
                    {t('orders.areYouSureCancel')}
                </Text>
                <View className="flex-row justify-center mt-6 gap-3">
                    <Button
                        title={t('common.cancel')}
                        className="flex-1"
                        style={{ backgroundColor: '#6b7280' }}
                        onPress={() => setCancelModalVisible(false)}
                        disabled={cancelMutation.isPending}
                    />

                    <Button
                        title={cancelMutation.isPending 
                            ? t('common.confirming') 
                            : t('common.confirm')
                        }
                        className="flex-1"
                        onPress={handleCancelOrder}
                        disabled={cancelMutation.isPending}
                    />
                </View>
            </CustomModal>
        </View>
    );
}
