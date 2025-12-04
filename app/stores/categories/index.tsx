import React, { useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";
import { config } from "@/constants/config";
import { useTranslation } from "react-i18next";
import useFetch from "@/hooks/useFetch";
import { Toast } from "toastify-react-native";
import Loading from "@/components/ui/Loading";
import NoCategories from "@/components/categories/NoCategories";
import Layout from "@/components/features/store/categories/Layout";
import { useStore } from "@/hooks/useStore";
import CategoryItem from "@/components/categories/CategoryItem";

export default function Categories() {
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const { store } = useStore();
  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useFetch(`/categories/store/${store?.id}`);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetchCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      t("categories.delete_category"),
      t("categories.delete_category_confirmation"),
      [
        { text: t("categories.cancel"), style: "cancel" },
        {
          text: t("categories.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Deleting category with id:", id);
              await axios.delete(`${config.URL}/categories/${id}`);
              Toast.show({
                type: "success",
                text1: t("categories.category_deleted_successfully"),
              });
              refetchCategories();
            } catch (error: any) {
              console.log("Error deleting category:", error);
              Toast.show({
                type: "error",
                text1: t("categories.failed_to_delete_category"),
              });
            }
          },
        },
      ]
    );
  };

  return (
    <Layout>
      <FlatList
        key={"2-columns"}
        data={categoriesData?.data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item: category }) => (
          <CategoryItem category={category} handleDelete={handleDelete} />
        )}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fd4a12"]}
          />
        }
        // حالات التحميل
        ListHeaderComponent={
          <>
            {categoriesLoading && <Loading />}
            {!categoriesLoading && categoriesData?.data?.length === 0 && (
              <NoCategories />
            )}
          </>
        }
      />
    </Layout>
  );
}
