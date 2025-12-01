import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import useFetch from "@/hooks/useFetch";

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
  return (
    <View key={product.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row">
        {/* Product Image */}
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            className="w-20 h-20 rounded-lg mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          </View>
        )}

        {/* Product Details */}
        <View className="flex-1">
          <Text
            className="font-bold text-lg text-gray-800"
            style={{ fontFamily: "Cairo_700Bold" }}
          >
            {product.name}
          </Text>
          <Text
            className="text-gray-500 text-sm mt-1"
            style={{ fontFamily: "Cairo_400Regular" }}
            numberOfLines={2}
          >
            {product.description}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text
                className="text-primary font-bold text-base"
                style={{ fontFamily: "Cairo_700Bold" }}
              >
                {product.sale_price ? (
                  <>
                    <Text className="line-through text-gray-400 text-sm">
                      {product.price}{" "}
                    </Text>
                    <Text className="text-primary">
                      {product.sale_price}{" "}
                      {t("categories.currency", {
                        defaultValue: "EGP",
                      })}
                    </Text>
                  </>
                ) : (
                  `${product.price} ${t("categories.currency", { defaultValue: "EGP" })}`
                )}
              </Text>
            </View>
            {categoriesData?.data && (
              <Text
                className="text-xs text-gray-400"
                style={{ fontFamily: "Cairo_400Regular" }}
              >
                {categoriesData.data.find(
                  (c: Category) => c.id === product.category_id
                )?.name || "-"}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row mt-3 pt-3 border-t border-gray-100">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/stores/products/update",
              params: { data: JSON.stringify(product) },
            })
          }
          className="flex-1 flex-row items-center justify-center bg-green-500 rounded-lg py-2 mr-2"
        >
          <Ionicons name="create-outline" size={18} color="white" />
          <Text
            className="text-white ml-1 font-medium"
          >
            {t("categories.edit")}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => handleDelete(product.id)}
          className="flex-1 flex-row items-center justify-center bg-red-500 rounded-lg py-2"
        >
          <Ionicons name="trash-outline" size={18} color="white" />
          <Text
            className="text-white ml-1 font-medium"
          >
            {t("categories.delete")}
          </Text>
        </TouchableOpacity>


      </View>
    </View>
  );
}
