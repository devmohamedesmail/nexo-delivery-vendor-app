import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface LanguageSwitcherProps {
  showText?: boolean;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ showText = true, className = '' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const currentLanguage = i18n.language === 'ar' ? 'العربية' : 'English';
  const nextLanguage = i18n.language === 'ar' ? 'English' : 'العربية';

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      className={`flex-row items-center bg-gray-100 px-3 py-2 rounded-full ${className}`}
    >
     
      <MaterialIcons name="language" size={20} color="black" />
      {showText && (
        <Text className="text-gray-700 font-medium ml-2">
          {nextLanguage}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default LanguageSwitcher;
