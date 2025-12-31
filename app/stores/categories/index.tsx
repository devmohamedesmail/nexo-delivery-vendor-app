import React, { useState } from "react";
import {
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Toast } from "toastify-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/ui/Loading";
import NoCategories from "@/components/categories/NoCategories";
import Layout from "@/components/categories/Layout";
import { useStore } from "@/hooks/useStore";
import CategoryItem from "@/components/categories/CategoryItem";
import CategoryController from "@/controllers/categories/contoller";
import { useAuth } from "@/context/auth-provider";

export default function Categories() {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { store } = useStore();
  const queryClient = useQueryClient();

  const { 
    data: categories = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["categories", store?.id],
    queryFn: () => CategoryController.fetchCategoriesByStore(store.id, auth.token),
    enabled: !!store?.id && !!auth?.token,
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
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
          onPress: () => deleteMutation.mutate(id),
        },
      ]
    );
  };

  const deleteMutation = useMutation({
    mutationFn: (categoryId: number) =>
      CategoryController.deleteCategory({ id: categoryId, token: auth?.token }),
    onSuccess: () => {
      Toast.success(t("categories.category_deleted_successfully"));
      queryClient.invalidateQueries({ queryKey: ["categories", store.id] });
    },
    onError: () => {
      Toast.error(t("categories.failed_to_delete_category"));
    },
  });

  return (
    <Layout>
      <FlatList
        key={"2-columns"}
        data={categories}
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
        ListHeaderComponent={
          <>
            {isLoading && <Loading />}
            {!isLoading && categories?.length === 0 && (
              <NoCategories />
            )}
          </>
        }
      />
    </Layout>
  );
}
