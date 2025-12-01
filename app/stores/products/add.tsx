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
import Loading from "@/components/ui/Loading";
import Skeleton from "@/components/ui/Skeleton";
import Header from "@/components/ui/Header";
import Input from "@/components/ui/Input";
import CustomTextArea from "@/components/ui/customtextarea";
import CustomButton from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import CustomImagePicker from "@/components/ui/customimagepicker";

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

export default function Add() {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
      name: "",
      description: "",
      price: "",
      sale_price: "",
      category_id: "",
      image: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("products.name_required")),
      price: Yup.number()
        .required(t("products.price_required"))
        .positive(t("products.price_positive")),
      sale_price: Yup.number()
        .nullable()
        .positive(
          t("products.price_positive")
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

        const response = await axios.post(
          `${config.URL}/products/create`,
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
            text1: t("products.product_added_successfully"),
          })   
          resetForm();
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: t("products.failed_to_save_product"),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <Header title={t("products.add_product")} />

      <ScrollView className="px-4 py-3">
        {/* Product Name */}
        <View className="pb-20">
          <View className="mb-4">
            <Input
              label={t("products.product_name")}
              placeholder={t("products.enter_product_name")}
              value={formik.values.name}
              onChangeText={formik.handleChange("name")}
              error={
                formik.touched.name && formik.errors.name
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
              error={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : ""
              }
            />
            {formik.touched.description && formik.errors.description && (
              <Text
                className="text-red-500 text-xs mt-1"
                style={{ fontFamily: "Cairo_400Regular" }}
              >
                {formik.errors.description}
              </Text>
            )}
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
                formik.touched.price && formik.errors.price
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
                formik.touched.sale_price && formik.errors.sale_price
                  ? formik.errors.sale_price
                  : ""
              }
            />
          </View>

          {/* Category Dropdown */}
          <View className="mb-4">
            {/* <Text
              className="text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: "Cairo_600SemiBold" }}
            >
              {t("products.category")}
            </Text> */}
            <Select
              label={t("products.category")}
              placeholder={t("products.select_category")}
              options={categoryOptions}
              value={formik.values.category_id}
              onSelect={(value: string) =>
                formik.setFieldValue("category_id", value)
              }
            />
            {formik.touched.category_id && formik.errors.category_id && (
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
