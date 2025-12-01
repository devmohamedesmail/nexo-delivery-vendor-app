import React, { useContext, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { config } from "@/constants/config";
import { AuthContext } from "@/context/auth_context";
import useFetch from "@/hooks/useFetch";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import Input from "@/components/ui/Input";
import CustomTextArea from "@/components/ui/customtextarea";
import CustomButton from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import CustomImagePicker from "@/components/ui/customimagepicker";
import { useLocalSearchParams } from "expo-router";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function Update() {
  const data = useLocalSearchParams();
  const product = data.data ? JSON.parse(data.data as string) : null;
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useFetch(auth?.user?.id ? `/users/profile/${auth.user.id}` : "");

  // Check if store exists
  const storeId = profileData?.data?.store?.id || "";

  const { data: categoriesData } = useFetch(
    storeId ? `/categories/store/${storeId}` : ""
  );

  const categoryOptions =
    categoriesData?.data?.map((cat: Category) => ({
      label: cat.name,
      value: cat.id.toString(),
    })) || [];

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price?.toString() || "",
      sale_price: product?.sale_price?.toString() || "",
      category_id: product?.category_id?.toString() || "",
      image: product?.image || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("products.name_required")),
      price: Yup.number()
        .required(t("products.price_required"))
        .positive(t("products.price_positive")),
      sale_price: Yup.number()
        .nullable()
        .positive(
          t("products.price_positive", {
            defaultValue: "Price must be positive",
          })
        ),
      category_id: Yup.string().required(t("products.category_required")),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (!storeId) {
          Toast.error(
            t("products.no_store_found", { defaultValue: "No store found" })
          );
          return;
        }

        // Create FormData for image upload
        const formData = new FormData();
        formData.append("store_id", storeId.toString());
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        if (values.sale_price) {
          formData.append("sale_price", values.sale_price);
        }
        formData.append("category_id", values.category_id);

        // Add image file if exists
        if (values.image) {
          const uriParts = values.image.split(".");
          const fileType = uriParts[uriParts.length - 1];

          formData.append("image", {
            uri: values.image,
            name: `product.${fileType}`,
            type: `image/${fileType}`,
          } as any);
        }

        const response = await axios.put(
          `${config.URL}/products/update/${product?.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          
          Toast.show({
            type: "success",
            text1: t("products.product_updated_successfully"),
          });
          resetForm();
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: t("products.failed_to_save_product"),
        });
        console.log("Error saving product:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <Header title={t("products.update_product")} />
      <ScrollView>
        <View className="px-4 py-6">
          {/* Product Name */}
          <View className="mb-4">
            <Input
              label={t("products.product_name")}
              placeholder={t("products.enter_product_name")}
              value={formik.values.name}
              onChangeText={formik.handleChange("name")}
              error={
                formik.touched.name && typeof formik.errors.name === "string"
                  ? formik.errors.name
                  : ""
              }
            />
          </View>

          {/* Product Description */}
          <View className="mb-4">
            <CustomTextArea
              label={t("products.product_description")}
              placeholder={t("products.enter_product_description")}
              value={formik.values.description}
              onChangeText={formik.handleChange("description")}
            />
          </View>

          {/* Price */}
          <View className="mb-4">
            <Input
              label={t("products.price")}
              placeholder={t("products.enter_price")}
              value={formik.values.price}
              onChangeText={formik.handleChange("price")}
              keyboardType="numeric"
              error={
                formik.touched.price && typeof formik.errors.price === "string"
                  ? formik.errors.price
                  : ""
              }
            />
          </View>

          {/* Sale Price */}
          <View className="mb-4">
            <Input
              label={t("products.sale_price")}
              placeholder={t("products.enter_sale_price", {
                defaultValue: "Enter sale price",
              })}
              value={formik.values.sale_price}
              onChangeText={formik.handleChange("sale_price")}
              keyboardType="numeric"
              error={
                formik.touched.sale_price &&
                typeof formik.errors.sale_price === "string"
                  ? formik.errors.sale_price
                  : ""
              }
            />
          </View>

          {/* Category Dropdown */}
          <View className="mb-4">
            <Text
              className="text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: "Cairo_600SemiBold" }}
            >
              {t("products.category")}
            </Text>
            <Select
              placeholder={t("products.select_category")}
              options={categoryOptions}
              value={formik.values.category_id}
              onSelect={(value: string) =>
                formik.setFieldValue("category_id", value)
              }
            />
            {formik.touched.category_id &&
              typeof formik.errors.category_id === "string" && (
                <Text
                  className="text-red-500 text-xs mt-1"
                  style={{ fontFamily: "Cairo_400Regular" }}
                >
                  {formik.errors.category_id}
                </Text>
              )}
          </View>

          {/* Product Image */}
          <View className="mb-6">
            <CustomImagePicker
              label={t("products.product_image")}
              value={formik.values.image}
              onImageSelect={(uri: string) =>
                formik.setFieldValue("image", uri)
              }
              placeholder={t("products.tap_to_select_image")}
            />
          </View>

          {/* Submit Button */}
          <CustomButton
            title={
              formik.isSubmitting ? t("products.saving") : t("products.save")
            }
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
