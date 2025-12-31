import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/theme-provider';
import { useTranslation } from 'react-i18next';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/button';
import ToggleTheme from '@/components/common/toggle-theme';
import LanguageSwitcher from '@/components/common/language-switcher';

export default function ForgetPassword() {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');

    const handleReset = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        // Handle password reset logic here
        Alert.alert('Success', 'Password reset link sent to your email');
    };

    return (
        <View className={`flex-1  px-6 justify-center ${theme=== 'light' ? 'bg-white' : 'bg-gray-900'} `}>
            <Text className="text-3xl font-bold text-center mb-6 text-gray-800">
                {t("auth.reset-password")} 
            </Text>

            <ToggleTheme />
            <LanguageSwitcher />

            <Input
                label={t("auth.email")}
                placeholder={t("auth.email")}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <Button title={t("auth.send-reset-password")} onPress={handleReset} />


            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-center text-blue-600">
                    {t("auth.back-to-login")}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
