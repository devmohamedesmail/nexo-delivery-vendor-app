import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function NotificationIcon() {
    const router = useRouter();
    return (
        <TouchableOpacity 
        onPress={()=>router.push('/notification')}
        className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
            <Ionicons name="notifications" size={20} color="red" />
        </TouchableOpacity>
    )
}
