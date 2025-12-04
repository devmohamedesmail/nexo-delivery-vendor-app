import useFetch from "@/hooks/useFetch";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image: string | null;
  category_id: number;
  on_sale: boolean;
  category: {
    id: number;
    name: string;
    description: string;
  };
}

export default function show() {
  const { t } = useTranslation();
  const { category_id } = useLocalSearchParams();
  const { data, loading } = useFetch(`/products/categories/${category_id}`);
  
  const products: Product[] = data?.data || [];
  const categoryName = products[0]?.category?.name || "";

  const renderProduct = ({ item }: { item: Product }) => (
    <View className="w-1/2 p-2">
      <View className="bg-white rounded-lg shadow-sm border border-gray-100">
        <View className="aspect-square bg-gray-100 rounded-t-lg items-center justify-center">
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              className="w-full h-full rounded-t-lg"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-gray-400 text-4xl">🍽️</Text>
          )}
        </View>
        
        <View className="p-3">
          <Text 
            className="text-sm font-semibold text-gray-800 mb-1" 
            style={{ fontFamily: "Cairo_600SemiBold" }}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          
          <View className="flex-row items-center justify-between mt-2">
            <View>
              {item.sale_price ? (
                <View>
                  <Text 
                    className="text-xs text-gray-400 line-through" 
                    style={{ fontFamily: "Cairo_400Regular" }}
                  >
                    {item.price} {t("common.currency", { defaultValue: "LE" })}
                  </Text>
                  <Text 
                    className="text-sm font-bold text-green-600" 
                    style={{ fontFamily: "Cairo_700Bold" }}
                  >
                    {item.sale_price} {t("common.currency", { defaultValue: "LE" })}
                  </Text>
                </View>
              ) : (
                <Text 
                  className="text-sm font-bold text-gray-800" 
                  style={{ fontFamily: "Cairo_700Bold" }}
                >
                  {item.price} {t("common.currency", { defaultValue: "LE" })}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <Header title={categoryName} />
      
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text style={{ fontFamily: "Cairo_400Regular" }}>
            {t("common.loading")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text 
                className="text-gray-400" 
                style={{ fontFamily: "Cairo_400Regular" }}
              >
                {t("products.no_products")}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
