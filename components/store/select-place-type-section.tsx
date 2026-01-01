import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import Select from '../ui/select'
import useFetch from '@/hooks/useFetch'

interface FormikProps {

}
export default function SelectPlaceTypeSection({ formik, handlePlaceSelect }: any) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar'
    const { data: placesData, loading: loadingPlaces, error: errorPlaces } = useFetch('/places')
    const { data: storeTypeData, loading: loadingStoreType } = useFetch('/store-types')


   

    const placeOptions = placesData?.data?.map((place: any) => ({
        label: place.name,
        value: place.id.toString()
    })) || []


    const storeTypeOptions = storeTypeData?.data?.map((type: any) => ({
        label: i18n.language === 'ar' ? type.name_ar : type.name_en,
        value: type.id.toString(),
    }))
    return (
        <View className="mb-6">
            <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                <Ionicons name="location-outline" size={24} color="#fd4a12" />
                <Text className="text-lg font-semibold text-gray-800 mx-5" >
                    {t('store.locationAndType')}
                </Text>
            </View>


            {/* Place Selection */}
            <Select
                label={t('store.selectPlace')}
                placeholder={t('store.choosePlacePlaceholder')}
                value={formik.values.place_id}
                onSelect={handlePlaceSelect}
                options={placeOptions}
                error={formik.touched.place_id && formik.errors.place_id ? formik.errors.place_id : undefined}
            />

            {/* Store Type Selection - Only show when place is selected */}
            <Select
                label={t('store.selectStoreType')}
                placeholder={t('store.chooseStoreTypePlaceholder')}
                value={formik.values.store_type_id}
                onSelect={(value: string) => formik.setFieldValue('store_type_id', value)}
                options={storeTypeOptions}
                error={formik.touched.store_type_id && formik.errors.store_type_id ? formik.errors.store_type_id : undefined}
            />

        </View>
    )
}
