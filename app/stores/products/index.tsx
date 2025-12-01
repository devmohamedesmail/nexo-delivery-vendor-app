import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { config } from "@/constants/config";
import { AuthContext } from "@/context/auth_context";
import { useTranslation } from "react-i18next";
import useFetch from "@/hooks/useFetch";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/ui/Loading";
import Skeleton from "@/components/ui/Skeleton";
import NoProductsFound from "@/components/store/NoProductsFound";
import Header from "@/components/ui/Header";
import ProductItem from "@/components/products/ProductItem";

interface Product {
  id: number;
  store_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  image: string | null;
  on_sale: boolean;
  is_featured: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function Products() {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useFetch(auth?.user?.id ? `/users/profile/${auth.user.id}` : "");

  // Check if store exists
  const storeId = profileData?.data?.store?.id || "";

  const {
    data: productsData,
    loading: productsLoading,
    refetch: refetchProducts,
  } = useFetch(storeId ? `/products/store/${storeId}` : "");
  // Fetch categories for dropdown
  const { data: categoriesData } = useFetch(
    storeId ? `/categories/store/${storeId}` : ""
  );

  useEffect(() => {
    if (productsData && productsData.data) {
      setProducts(productsData.data);
      setRefreshing(false);
    }
  }, [productsData]);

  const handleDelete = async (productId: number) => {
    try {
      const response = await axios.delete(
        `${config.URL}/products/${productId}`
      );
      if (response.data.success) {
        Toast.success(t("products.product_deleted_successfully"));
        refetchProducts();
      }
    } catch (error) {
      Toast.error(t("products.failed_to_delete_product"));
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <Header title={t("products.products")} />

      {profileLoading ? (
        <Loading />
      ) : (
        <>
          {productsLoading ? (
            <View className="mt-10 flex gap-4 px-3">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} height={200} />
              ))}
            </View>
          ) : (
            <>
              {products.length === 0 ? (
                <NoProductsFound />
              ) : (
                <>
                  <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item: product }) => (
                      <ProductItem
                        product={product}
                        categoriesData={categoriesData}
                        handleDelete={handleDelete}
                      />
                    )}
                  />
                </>
              )}
            </>
          )}

          <TouchableOpacity
            className="absolute bottom-24 right-6 bg-primary rounded-full w-16 h-16 items-center justify-center shadow-lg"
            onPress={() => router.push("/stores/products/add")}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}
