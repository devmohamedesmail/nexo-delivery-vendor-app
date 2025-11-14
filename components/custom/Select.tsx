import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

interface DropdownOption {
  label: string
  value: string
}

interface CustomDropdownProps {
  label?: string
  placeholder?: string
  value?: string
  onSelect?: (value: string) => void
  options: DropdownOption[]
  error?: string
  disabled?: boolean
}

export default function Select({
  label,
  placeholder = "Select an option",
  value,
  onSelect,
  options,
  error,
  disabled = false
}: CustomDropdownProps) {
  const { i18n } = useTranslation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  
  const selectedOption = options.find(option => option.value === value)
  const isRTL = i18n.language === 'ar'

  const handleSelect = (selectedValue: string) => {
    onSelect?.(selectedValue)
    setIsModalVisible(false)
  }

  return (
    <View className='mb-5'>
      {label && (
        <Text 
          style={{ fontFamily: 'Cairo_400Regular' }}
          className={`mb-3 text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
        className={`
          border-2 rounded-xl px-4 py-4 w-full
          ${error 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-200 bg-white'
          }
          ${disabled ? 'opacity-50 bg-gray-100' : ''}
          shadow-sm flex-row justify-between items-center
        `}
        style={{ 
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <Text 
          style={{ 
            fontFamily: 'Cairo_400Regular',
            textAlign: isRTL ? 'right' : 'left'
          }}
          className={`text-base flex-1 ${
            selectedOption ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Ionicons 
          name={isModalVisible ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6B7280" 
        />
      </TouchableOpacity>

      {error && (
        <View className='flex-row items-center mt-2 px-1'>
          <Ionicons name="alert-circle" size={12} color="#EF4444" />
          <Text 
            className='text-red-500 text-xs ml-2 flex-1'
            style={{ fontFamily: 'Cairo_400Regular' }}
          >
            {error}
          </Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable className="bg-white rounded-xl mx-6 max-h-96 w-80">
            <View className="p-4 border-b border-gray-200">
              <Text 
                className="text-lg font-semibold text-center text-gray-800"
                style={{ fontFamily: 'Cairo_600SemiBold' }}
              >
                {label || "Select Option"}
              </Text>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className={`
                    px-4 py-4 
                    ${index !== options.length - 1 ? 'border-b border-gray-100' : ''}
                    ${item.value === value ? 'bg-blue-50' : ''}
                  `}
                >
                  <View className="flex-row justify-between items-center">
                    <Text 
                      style={{ 
                        fontFamily: 'Cairo_400Regular',
                        textAlign: isRTL ? 'right' : 'left'
                      }}
                      className={`text-base flex-1 ${
                        item.value === value ? 'text-blue-600 font-medium' : 'text-gray-800'
                      }`}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={20} color="#2563EB" />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="p-4 border-t border-gray-200"
            >
              <Text 
                className="text-center text-gray-600"
                style={{ fontFamily: 'Cairo_400Regular' }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}