import React, { useContext, useState } from 'react'
import { TouchableOpacity, View, Text, Alert } from 'react-native'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useTranslation } from 'react-i18next'
import { AuthContext } from '@/context/auth-provider';
import { useRouter } from 'expo-router';
import CustomModal from '../ui/CustomModal';
import Button from '../ui/button';
import { Toast } from 'toastify-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Colors from '@/constants/Colors';

export default function AccountActionsButtons() {
    const { t } = useTranslation()
    const { handle_logout } = useContext(AuthContext)
    const [logoutModalVisible, setLogoutModalVisible] = useState(false)
    const router = useRouter()
    const [loadding, setLoading] = useState(false)




    const logout = async () => {

        try {
            setLoading(true)
            await handle_logout()

            Toast.show({
                type: 'success',
                text1: t('account.logout_successful'),
            })
            setTimeout(() => {
                setLoading(false)
                setLogoutModalVisible(false)
                router.replace('/auth/login')

            }, 3000);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('account.logout_failed'),
            })
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    return (
        <View className='px-5 mt-10'>
            <TouchableOpacity
                className='bg-white py-7  border-b border-b-gray-200 rounded-xl px-4 mb-4 flex-row justify-center items-center'
                onPress={() => setLogoutModalVisible(true)}>
                <View>
                    <Entypo name="chevron-left" size={24} color="gray" />
                </View>
                <View className='flex-1 flex flex-row items-center justify-end mx-3'>
                    <Text>{t('account.logout')}</Text>
                </View>
                <View className='bg-primary/20 rounded-full p-2 flex items-center justify-center w-10 h-10'>
                    <SimpleLineIcons name="logout" size={16} color={Colors.light.tabIconSelected} />
                </View>
            </TouchableOpacity>







            <CustomModal visible={logoutModalVisible} onClose={() => setLogoutModalVisible(false)} >
                <Text className='text-center'>{t('account.logout_confirmation')}</Text>
                <View className='flex  justify-center gap-4 mt-10'>
                    <Button
                        title={loadding ? t('account.logging_out') : t('account.logout')}
                        onPress={logout}
                        className='bg-red-500  px-4 py-3 '
                        textClassName='text-white'
                        style={{ backgroundColor:'red' }}
                    />
                    <Button
                        title={t('auth.cancel')}
                        onPress={() => setLogoutModalVisible(false)}
                        className='bg-gray-200  px-4 py-3 '
                        textClassName='text-gray-800'
                       
                    />
                </View>
            </CustomModal>
        </View>
    )
}
