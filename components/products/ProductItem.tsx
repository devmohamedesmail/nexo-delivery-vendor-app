import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { config } from "@/constants/config";
import Button from "../ui/button";
import Entypo from '@expo/vector-icons/Entypo';

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function ProductItem({
  product,
  categoriesData,
  handleDelete,
}: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View
      key={product.id}
      className="bg-white rounded-xl mb-3 shadow-sm border border-gray-100 w-[45%] mx-2"
    >
      {/* product Image */}
      <View className="relative">
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            className="w-full h-40 rounded-t-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-40 rounded-t-xl bg-gradient-to-b from-gray-50 to-gray-100 items-center justify-center">
            <Ionicons name="image-outline" size={40} color="#D1D5DB" />
          </View>
        )}

        <View className="absolute top-2 right-2 gap-2">
          <TouchableOpacity
            onPress={() => handleDelete(product.id)}
            className="bg-red-500 w-9 h-9 items-center justify-center rounded-full shadow-md"
          >
            <Ionicons name="trash-outline" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/stores/products/update",
                params: { data: JSON.stringify(product) },
              })
            }
            className="bg-primary w-9 h-9 items-center justify-center rounded-full shadow-md"
          >
            <Entypo name="edit" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Info */}
      <View className="p-3">
        <Text 
          className="font-bold text-base text-gray-900 mb-2 text-center" 
          style={{ fontFamily: "Cairo_600SemiBold" }}
          numberOfLines={2}
        >
          {product?.name}
        </Text>

        {product?.category?.name && (
          <Text 
            className="text-xs text-primary text-center mb-2" 
            style={{ fontFamily: "Cairo_400Regular" }}
          >
            {product?.category?.name}
          </Text>
        )}

        {/* Price Display */}
        <View className="mt-1">
          {!product?.attributes || product?.attributes?.length === 0 ? (
            <View className="bg-green-50 px-3 py-2 rounded-lg">
              <Text 
                className="text-center font-bold text-green-700 text-base" 
                style={{ fontFamily: "Cairo_700Bold" }}
              >
                {product.price} {config.CURRENCY}
              </Text>
            </View>
          ) : (
            <View className="mt-1">
              {product.attributes.map((attr: any) => (
                <View key={attr.id} className="mb-2">
                  <Text 
                    className="text-xs text-gray-600 mb-1.5 text-center font-semibold" 
                    style={{ fontFamily: "Cairo_600SemiBold" }}
                  >
                    {attr.name}
                  </Text>
                  {attr.values && attr.values.length > 0 && (
                    <View className="flex-row flex-wrap justify-center gap-1">
                      {attr.values.map((val: any, index: number) => (
                        <View 
                          key={index} 
                          className="bg-primary/90 px-2.5 py-1.5 rounded-lg border flex items-center border-primary/70"
                        >
                          <Text 
                            className="text-xs text-white font-medium mb-2"  
                          >
                            {val.value}
                          </Text>
                          <Text 
                            className="text-xs text-white font-bold" 
                            
                          >
                            {val.price} {config.CURRENCY}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
