import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { config } from "../../../constants/config";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth_context";
import { Toast } from "toastify-react-native";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/customtextarea";
import Button from "@/components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";

export default function update() {
  const { data } = useLocalSearchParams();
  const category = JSON.parse(data as string);
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category.name,
      description: category.description,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("categories.name_required")),
      // description: Yup.string().required(t('categories.description_required')),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setLoading(true);
        const payload = {
          store_id: auth.user.store.id,
          name: values.name,
          description: values.description,
        };

        const response = await axios.put(
          `${config.URL}/categories/update/${category.id}`,
          payload
        );
        if (response.status === 200) {
          Toast.show({
            type: "success",
            text1: t("categories.category_updated_successfully"),
          });

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
          title={loading ? t("common.saving") : t("common.save")}
          onPress={formik.handleSubmit as any}
          disabled={formik.isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}
