import React from "react";
import { View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import useFetch from "@/hooks/useFetch";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { store } = useStore();
  const { data: categoriesData } = useFetch(`/categories/store/${store?.id}`);
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000"  />
      <Header title={t("categories.categories")} />

      <View className="flex flex-row justify-between items-center my-2 px-4">
        <Text className="text-2xl font-bold text-primary mt-1">
          {categoriesData?.data?.length}
        </Text>
        <Button
          title={t("categories.add_category")}
          onPress={() => router.push("/stores/categories/add")}
        />
      </View>
      {children}
    </SafeAreaView>
  );
}
