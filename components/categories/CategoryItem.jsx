
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function CategoryItem({ category, handleDelete }) {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <View
            key={category.id}
            className="bg-white rounded-xl p-4 shadow-sm w-[45%] m-2"
        >
            <View className="flex items-center justify-between mb-2">

                <View className='bg-blue-400 w-20 h-20 rounded-full flex items-center justify-center mb-2'>
                    <Text className='text-xl text-white'>
                        {category.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text
                    className="text-lg font-bold text-gray-800"

                >
                    {category.name}
                </Text>
                <Text
                    className="text-gray-500 text-sm mt-1"
                    style={{ fontFamily: "Cairo_400Regular" }}
                >
                    {category.description}
                </Text>
            </View>

            <View className="flex  items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: "/stores/categories/show",
                            params: { category_id: category.id.toString() },
                        })
                    }
                    className="bg-primary px-4 py-2 rounded-lg flex-row items-center justify-center min-w-full mb-2"
                >
                    <AntDesign name="eye" size={20} color="white" />
                    <Text className="text-white ml-2 font-medium">
                        {t("categories.show_products")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: "/stores/categories/update",
                            params: { data: JSON.stringify(category) },
                        })
                    }
                    className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center justify-center mr-2 min-w-full mb-2"
                >
                    <Ionicons name="create-outline" size={18} color="white" />
                    <Text className="text-white ml-2 font-medium">
                        {t("categories.edit")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleDelete(category.id)}
                    className="bg-red-500 px-4 py-2 rounded-lg flex-row items-center justify-center min-w-full mb-2"
                >
                    <Ionicons name="trash-outline" size={18} color="white" />
                    <Text className="text-white ml-2 font-medium">
                        {t("categories.delete")}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
