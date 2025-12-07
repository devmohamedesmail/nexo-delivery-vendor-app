import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import NoStore from "@/components/store/NoStore";
import NotificationIcon from "@/components/common/NotificationIcon";
import Loading from "@/components/ui/Loading";
import { useStore } from "@/hooks/useStore";
import ManageHomeSection from "@/components/features/store/index/ManageHomeSection";
import StoreHeader from "@/components/features/store/index/StoreHeader";
import Layout from "@/components/ui/Layout";
import { Link, useRouter } from "expo-router";

export default function Home() {
  const { t } = useTranslation();
  const { store, loading } = useStore();
  const router = useRouter();

  return (
    <Layout>
      <View className="flex-row items-center justify-between pt-20 px-4 py-4 bg-black/90 shadow-sm">
        <NotificationIcon />
        <Text className="text-2xl font-bold text-white">
          {t("common.home")}
        </Text>
      </View>



      {loading ? (
        <Loading />
      ) : (
        <>
          {store ? (
            <>
              <ScrollView className="flex-1 p-4">
                <StoreHeader />
                <ManageHomeSection />
              </ScrollView>
            </>
          ) : (
            <>
              <NoStore />
            </>
          )}
        </>
      )}
    </Layout>
  );
}
