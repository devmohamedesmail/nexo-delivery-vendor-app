import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

export default function NoCategories() {
  const { t } = useTranslation();
  return (
    <View
      className="bg-white rounded-xl p-8 items-center justify-center"
      style={{ minHeight: 200 }}
    >
      <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
      <Text
        className="text-gray-400 mt-4 text-center"
        style={{ fontFamily: "Cairo_600SemiBold" }}
      >
        {t("categories.no_categories_yet")}
      </Text>
      <Text
        className="text-gray-400 text-sm text-center mt-2"
        style={{ fontFamily: "Cairo_400Regular" }}
      >
        {t("categories.add_first_category")}
      </Text>
    </View>
  );
}
