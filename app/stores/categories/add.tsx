import React, { useContext, useState } from "react";
import { View } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/context/auth-provider";
import { Toast } from "toastify-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Header from "@/components/ui/Header";
import Layout from "@/components/ui/Layout";
import { useStore } from "@/hooks/useStore";
import CategoryController from "@/controllers/categories/contoller";

export default function Add() {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const { store } = useStore();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: { name: string; description: string }) =>
      CategoryController.createCategory({
        store_id: store?.id!,
        name: values.name,
        description: values.description,
        token: auth.token,
      }),
    onSuccess: () => {
      Toast.success(t("categories.category_added_successfully"));
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
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("categories.name_required")),
    }),
    onSubmit: async (values) => {
      createMutation.mutate(values);
    },
  });

  return (
    <Layout>
      <Header title={t("categories.add_category")} />
      <View className="px-5 py-10">
        <Input
          label={t("categories.name")}
          placeholder={t("categories.enter_category_name")}
          value={formik.values.name}
          onChangeText={formik.handleChange("name")}
          error={
            formik.touched.name && formik.errors.name ? formik.errors.name : ""
          }
        />
        <TextArea
          label={t("categories.description")}
          placeholder={t("categories.enter_category_description")}
          value={formik.values.description}
          onChangeText={formik.handleChange("description")}
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : ""
          }
          touched={formik.touched.description}
        />
        <Button
          title={createMutation.isPending ? t("common.saving") : t("common.save")}
          onPress={formik.handleSubmit as any}
          disabled={createMutation.isPending}
        />
      </View>
    </Layout>
  );
}
