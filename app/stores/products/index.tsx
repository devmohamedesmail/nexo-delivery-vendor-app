import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
  Text,
} from "react-native";

import axios from "axios";
import { config } from "@/constants/config";
import { useTranslation } from "react-i18next";
import useFetch from "@/hooks/useFetch";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";
import Loading from "@/components/ui/Loading";
import Skeleton from "@/components/ui/Skeleton";
import NoProductsFound from "@/components/products/NoProductsFound";
import Header from "@/components/ui/Header";
import ProductItem from "@/components/products/ProductItem";
import { useStore } from "@/hooks/useStore";
import Layout from "@/components/ui/Layout";
import FloatButton from "@/components/ui/FloatButton";
import ProductController from "@/controllers/products/controller";
import { useAuth } from "@/context/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export default function Products() {
  const { t } = useTranslation();
  const { auth } = useAuth()
  const router = useRouter();
  const { store, loading } = useStore();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["products", store.id],
    queryFn: () => ProductController.fetchProductsByStore(store.id, auth.token),
    enabled: !!store?.id && !!auth?.token,
  });





  // Fetch categories for dropdown
  const { data: categoriesData } = useFetch(
    store?.id ? `/categories/store/${store?.id}` : ""
  );



  // 🔹 Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: number) =>
      ProductController.deleteProduct({
        productId,
        token: auth.token,
      }),

    onSuccess: () => {
      Toast.success(t("products.product_deleted_successfully"));
      queryClient.invalidateQueries({
        queryKey: ["products", store.id],
      });
    },

    onError: () => {
      Toast.error(t("products.failed_to_delete_product"));
    },
  });

  const handleDelete = (productId: number) => {
    Alert.alert(
      t("products.delete_product"),
      t("products.delete_product_confirmation"),
      [
        { text: t("products.cancel"), style: "cancel" },
        {
          text: t("products.delete"),
          style: "destructive",
          onPress: () => deleteMutation.mutate(productId),
        },
      ]
    );
  };

  return (
    <Layout>
      <Header title={t("products.products")} />

      <View className="flex flex-row justify-between items-center px-5 py-5">
        <Text className="font-bold"> {t("products.products_count")} - {products?.length}</Text>

        <TouchableOpacity
          onPress={() => router.push("/stores/products/add")}
          className="bg-primary rounded-full px-3 py-2">
          <Text className="text-white">{t("products.add_product")}</Text>
        </TouchableOpacity>
      </View>

      {loading ? <Loading /> : null}

      {isLoading ? (
        <View className="mt-10 flex gap-4 px-3">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} height={100} />
          ))}
        </View>
      ) : null}

      {!isLoading && products?.length === 0 ? <NoProductsFound /> : null}

      <View className="mb-10 pb-20">
        <FlatList
          key={"2-columns"}
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item: product }) => (
            <ProductItem
              product={product}
              categoriesData={categoriesData}
              handleDelete={handleDelete}
            />
          )}
        />
      </View>

      <FloatButton onPress={() => router.push("/stores/products/add")} />
    </Layout>
  );
}
