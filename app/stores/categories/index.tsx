import React, {
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { config } from "@/constants/config";
import { AuthContext } from "@/context/auth_context";
import { useTranslation } from "react-i18next";
import useFetch from "@/hooks/useFetch";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/ui/Loading";
import Header from "@/components/ui/Header";
import NoCategories from "@/components/categories/NoCategories";



export default function Categories() {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch(`/categories/store/${auth.user.store.id}`);

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
              refetchCategories()
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Header title={t("categories.categories")} />

      <View className="flex flex-row justify-end items-center my-2 px-4">
        <TouchableOpacity
          onPress={() => router.push("/stores/categories/add")}
          className="bg-primary px-5 w-fit py-2 rounded-full"
        >
          <Text className="text-white">{t("categories.add_category")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fd4a12"]}
          />
        }
      >
        {categoriesLoading ? (
          <Loading />
        ) : (
          <>
            {/* Stats Card */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-500 text-sm">
                    {t("categories.total_categories")}
                  </Text>
                  <Text className="text-2xl font-bold text-primary mt-1">
                    {categoriesData?.data?.length}
                  </Text>
                </View>
                <View className="bg-primary/10 w-14 h-14 rounded-full items-center justify-center">
                  <Ionicons name="grid-outline" size={28} color="#fd4a12" />
                </View>
              </View>
            </View>

            {/* Categories List */}
            {categoriesData.data.length === 0 ? (
            <NoCategories />
            ) : (
              <View className="space-y-3">
                {categoriesData &&
                  categoriesData.data.map((category: any) => (
                    <View
                      key={category.id}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-1">
                          <Text
                            className="text-lg font-bold text-gray-800"
                            style={{ fontFamily: "Cairo_700Bold" }}
                          >
                            {category.name}
                          </Text>
                          <Text
                            className="text-gray-500 text-sm mt-1"
                            style={{ fontFamily: "Cairo_400Regular" }}
                          >
                            {category.description}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                        <TouchableOpacity
                          // onPress={() => handleEdit(category)}
                          onPress={() =>
                            router.push({
                              pathname: "/stores/categories/update",
                              params: { data: JSON.stringify(category) },
                            })
                          }
                          className="bg-green-500 px-4 py-2 rounded-lg flex-row items-center mr-2"
                        >
                          <Ionicons
                            name="create-outline"
                            size={18}
                            color="white"
                          />
                          <Text
                            className="text-white ml-2 font-medium"
                           
                          >
                            {t("categories.edit")}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDelete(category.id)}
                          className="bg-red-500 px-4 py-2 rounded-lg flex-row items-center"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="white"
                          />
                          <Text
                            className="text-white ml-2 font-medium"
                         
                          >
                            {t("categories.delete")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      {/* <TouchableOpacity
        onPress={openAddModal}
        className="absolute bottom-24 right-6 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity> */}

      {/* <GestureHandlerRootView>
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
        >
          <BottomSheetView>
            <View className="px-5">
              <Input
                label={t("categories.name")}
                placeholder={t("categories.enter_category_name")}
                value={formik.values.name}
                onChangeText={formik.handleChange("name")}
                error={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ""
                }
              />
              <CustomTextArea
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
              <CustomButton
                title={
                  formik.isSubmitting
                    ? t("categories.saving")
                    : editingCategory
                      ? t("categories.update_category")
                      : t("categories.add_category")
                }
                onPress={formik.handleSubmit as any}
                disabled={formik.isSubmitting}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView> */}

      {/* Add/Edit Modal */}
      {/* <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingCategory(null);
          formik.resetForm();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end bg-black/50"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setModalVisible(false);
              setEditingCategory(null);
              formik.resetForm();
            }}
            className="flex-1"
          />
          <View
            className="bg-white rounded-t-3xl p-6"
            style={{ maxHeight: "80%" }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "Cairo_700Bold" }}
              >
                {editingCategory
                  ? t("categories.edit_category")
                  : t("categories.add_category")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingCategory(null);
                  formik.resetForm();
                }}
              >
                <Ionicons name="close-circle" size={32} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label={t("categories.name")}
                placeholder={t("categories.enter_category_name")}
                value={formik.values.name}
                onChangeText={formik.handleChange("name")}
                error={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : ""
                }
              />
              <CustomTextArea
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
              <CustomButton
                title={
                  formik.isSubmitting
                    ? t("categories.saving")
                    : editingCategory
                      ? t("categories.update_category")
                      : t("categories.add_category")
                }
                onPress={formik.handleSubmit as any}
                disabled={formik.isSubmitting}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal> */}
    </SafeAreaView>
  );
}
