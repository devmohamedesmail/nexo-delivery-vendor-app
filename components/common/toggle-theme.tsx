import { useTheme } from '@/context/theme-provider'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ToggleTheme() {
    const { theme, setTheme } = useTheme()
    return (
        <TouchableOpacity
            className='w-10 h-10 bg-white rounded-full items-center justify-center'
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <AntDesign name="moon" size={20} color="black" /> : <AntDesign name="sun" size={20} color="#ffb703" />}
        </TouchableOpacity>
    )
}
