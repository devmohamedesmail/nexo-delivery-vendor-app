import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-provider";
import { Toast } from "toastify-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Header from "@/components/ui/Header";
import { useStore } from "@/hooks/useStore";
import CategoryController from "@/controllers/categories/contoller";
import Layout from "@/components/ui/Layout";

export default function update() {
  const { data } = useLocalSearchParams();
  const category = JSON.parse(data as string);
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const { store } = useStore();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (values: { name: string; description: string }) =>
      CategoryController.updateCategory({
        categoryId: category.id,
        storeId: store?.id!,
        name: values.name,
        description: values.description,
        token: auth.token,
      }),
    onSuccess: () => {
      Toast.success(t("categories.category_updated_successfully"));
      queryClient.invalidateQueries({ queryKey: ["categories", store.id] });
      formik.resetForm();
    },
    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.message ||
          t("categories.failed_to_save_category")
      );
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category.name,
      description: category.description,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("categories.name_required")),
    }),
    onSubmit: async (values) => {
      updateMutation.mutate(values);
    },
  });

  return (
    <Layout>
       <Header title={t("categories.update_category")} />
      <View className="p-4">
        <Input
          label={t("categories.name")}
          placeholder={t("categories.enter_category_name") || ""}
          value={formik.values.name}
          onChangeText={formik.handleChange("name")}
          error={
            formik.touched.name && typeof formik.errors.name === "string"
              ? formik.errors.name
              : ""
          }
        />

        <TextArea
          label={t("categories.description")}
          placeholder={t("categories.enter_category_description") || ""}
          value={formik.values.description}
          onChangeText={formik.handleChange("description")}
        
          
        />
        <Button
          title={updateMutation.isPending ? t("common.saving") : t("common.save")}
          onPress={formik.handleSubmit as any}
          disabled={updateMutation.isPending}
        />
      </View>
    </Layout>
  );
}
