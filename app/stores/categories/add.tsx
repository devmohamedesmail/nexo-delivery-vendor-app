import React, { useContext, useState } from "react";
import { View } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { config } from "../../../constants/config";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/context/auth_context";
import { Toast } from "toastify-react-native";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/customtextarea";
import Button from "@/components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import useFetch from "@/hooks/useFetch";

export default function Add() {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
   const {refetch: refetchCategories} = useFetch(`/categories/store/${auth.user.store.id}`);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("categories.name_required")),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setLoading(true);
        const payload = {
          store_id: auth.user.store.id,
          name: values.name,
          description: values.description,
        };

        const response = await axios.post(
          `${config.URL}/categories/create`,
          payload
        );
        console.log(response.status);
        if (response.status === 201) {
          Toast.show({
            type: "success",
            text1: t("categories.category_added_successfully"),
          });
          refetchCategories();
          resetForm();
        } else {
          Toast.show({
            type: "error",
            text1: t("categories.failed_to_save_category"),
          });
        }
        setLoading(false);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1:
            error?.response?.data?.message ||
            t("categories.failed_to_save_category"),
        });
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
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
          
          title={loading ? t("common.saving") : t("common.save")}
          onPress={formik.handleSubmit as any}
          disabled={formik.isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}
