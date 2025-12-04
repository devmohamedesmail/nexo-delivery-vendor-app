import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { config } from '@/constants/config';
import Button from '../ui/Button';
import axios from 'axios';
import { Toast } from 'toastify-react-native';
import CustomModal from '../ui/CustomModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '@/constants/Colors';



const statusConfig = {
    pending:
        { color: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
    accepted:
        { color: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
    preparing:
        { color: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
    on_the_way:
        { color: 'bg-indigo-100', textColor: 'text-indigo-700', borderColor: 'border-indigo-200' },
    delivered:
        { color: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-200' },
    cancelled:
        { color: 'bg-red-600', textColor: 'text-white', borderColor: 'border-red-600' },
};

export default function OrderItem({ item, refetchOrders }: { item: any, refetchOrders: () => void }) {
    const { t, i18n } = useTranslation();
    const statusStyle = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    const handle_cancelOrder = async () => {
        try {
            setIsCancelling(true);

            const response = await axios.patch(`${config.URL}/orders/${item.id}/cancel`);
            Toast.show({
                type: 'success',
                text1: t('orders.orderCancelledSuccessfully')
            })
            setIsCancelling(false);
        } catch (error) {
            setIsCancelling(false);
            Toast.show({
                type: 'error',
                text1: t('orders.orderCancellationFailed')
            })

        } finally {
            setCancelModalVisible(false);
            setIsCancelling(false);
        }
    }



    const accept_order = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`${config.URL}/orders/${item.id}/accept`);
            refetchOrders();
            Toast.show({
                type: 'success',
                text1: t('orders.orderAcceptedSuccessfully')
            })
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: t('orders.failedToAcceptOrder')
            })
        } finally {
            setLoading(false);
        }
    }


    return (
        <View>
            <View className="bg-white mx-4 mb-4 rounded-2xl border border-gray-100" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 1
            }}>
                {/* Header */}
                <View className="p-4 border-b border-gray-100">

                    <View className="flex-row justify-between items-start mb-3">
                        <View className="flex-1">
                            <Text className="text-gray-500 text-xs mb-1">{t('orders.orderId')}</Text>
                            <Text className="text-gray-900 font-bold text-lg">#{item.id}</Text>
                        </View>
                        <View className={`${statusStyle.color}  px-3 py-2 rounded-full flex-row items-center`}>
                            <Text className={`${statusStyle.textColor} font-semibold text-xs ml-1`}>
                                {t(`orders.${item.status === 'on_the_way' ? 'onTheWay' : item.status}`)}
                            </Text>
                        </View>
                    </View>



                    <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                        <Text className="text-gray-500 text-xs ml-2">{formatDate(item.placed_at)}</Text>
                    </View>

                </View>

                {/* Order Items */}
                <View className="p-4 border-b border-gray-100">
                    <Text className="text-gray-700 font-semibold mb-3">{t('orders.items')} ({item.order.length})</Text>
                    {item.order.map((item: any, index: any) => (
                        <View key={index} className="flex-row justify-between items-center mb-2">
                            <View className="flex-row items-center flex-1">
                                <View className="bg-gray-100 w-8 h-8 rounded-lg justify-center items-center mr-3">
                                    <Text className="text-gray-600 font-bold text-xs">{item.quantity}x</Text>
                                </View>
                                <Text className="text-gray-700 flex-1" numberOfLines={1}>{item.name}</Text>
                            </View>
                            <Text className="text-gray-900 font-semibold ml-2"> {config.CURRENCY} {item.price}</Text>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View className="p-4">
                    <View className={`flex-row justify-between items-center mb-4  ${i18n.language === 'ar' ? 'flex-row-reverse' : ''} `}>
                        <Text className="text-gray-600 font-medium ">{t('orders.totalAmount')}</Text>
                        <Text className="text-gray-900  text-xl "> {config.CURRENCY} {item.total_price} </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <FontAwesome name="user" size={20} color={Colors.light.tabIconSelected} />
                        <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                            {item?.user?.name}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <FontAwesome6 name="location-dot" size={20} color={Colors.light.tabIconSelected} />
                        <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                            {item.delivery_address}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <AntDesign name="phone" size={20} color={Colors.light.tabIconSelected} />
                        <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                            {item.phone}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row space-x-2">

                        {(item.status === 'preparing' || item.status === 'on_the_way') && (
                            <TouchableOpacity className="flex-1 bg-primary py-3 rounded-xl mr-2">
                                <Text className="text-white font-bold text-center">{t('orders.trackOrder')}</Text>
                            </TouchableOpacity>
                        )}

                        {item.status === 'delivered' && (
                            <TouchableOpacity className="flex-1 bg-green-500 py-3 rounded-xl">
                                <Text className="text-white font-bold text-center">{t('orders.orderAgain')}</Text>
                            </TouchableOpacity>
                        )}

                        {item.status === 'pending' && (
                            <View className="flex-row flex-1 justify-between space-x-2 gap-4">

                                {/* <TouchableOpacity
                                    onPress={accept_order}
                                    className="flex-1 py-3 rounded-xl" style={{ backgroundColor: 'green' }}>
                                    <Text className="text-white font-bold text-center">{t('orders.acceptOrder')}</Text>
                                </TouchableOpacity> */}
                                <Button
                                    title={loading ? t('orders.acceptingOrder') : t('orders.acceptOrder')}
                                    className="flex-1 py-3 rounded-xl"
                                    onPress={accept_order}
                                />

                                <Button
                                    title={t('orders.cancelOrder')}
                                    className="flex-1 py-3 rounded-xl" style={{ backgroundColor: 'red' }}
                                    onPress={() => setCancelModalVisible(true)}
                                />

                                {/* <TouchableOpacity
                                    onPress={() => setCancelModalVisible(true)}
                                    className="flex-1 py-3 rounded-xl" style={{ backgroundColor: 'red' }}>
                                    <Text className="text-white font-bold text-center">{t('orders.cancelOrder')}</Text>
                                </TouchableOpacity> */}

                            </View>
                        )}

                    </View>
                </View>
            </View>


            <CustomModal
                visible={cancelModalVisible}
                onClose={() => setCancelModalVisible(false)}

            >
                <Text className='text-center font-bold text-lg'>{t('orders.cancelOrder')}</Text>
                <Text className='text-center mt-4 text-gray-600'>{t('orders.areYouSureCancel')}</Text>
                <View className='flex flex-row justify-center mt-10 gap-5'>



                    <Button
                        title={t('common.cancel')}
                        className='flex-1 mx-2'
                        style={{ backgroundColor: 'gray', marginRight: 8 }}
                        onPress={() => setCancelModalVisible(false)}
                    />

                    <Button
                        title={isCancelling ? t('common.confirming') : t('common.confirm')}
                        onPress={handle_cancelOrder}
                        disabled={isCancelling}
                        className='flex-1 mx-2'
                    />


                </View>

            </CustomModal>
        </View>
    )
}
