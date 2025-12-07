import useFetch from "@/hooks/useFetch";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import { useTranslation } from "react-i18next";
import ProductItem from "@/components/products/ProductItem";
import Layout from "@/components/ui/Layout";

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

 

  return (
    <Layout>
      <Header title={categoryName} />
      
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text style={{ fontFamily: "Cairo_400Regular" }}>
            {t("common.loading")}
          </Text>
        </View>
      ) : (
       <View>
        <View className="flex flex-row justify-center items-center py-5">
          <Text className="font-bold">
            {t('products.products_count')} {products.length}
          </Text>
        </View>
         <FlatList
          data={products}
          renderItem={({ item }) => <ProductItem product={item} />}
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
       </View>
      )}
    </Layout>
  );
}
