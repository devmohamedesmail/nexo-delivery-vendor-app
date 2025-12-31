import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import NoStore from "@/components/store/NoStore";
import NotificationIcon from "@/components/common/notification-icon";
import Loading from "@/components/ui/Loading";
import { useStore } from "@/hooks/useStore";
import ManageHomeSection from "@/components/features/store/index/ManageHomeSection";
import StoreHeader from "@/components/features/store/index/StoreHeader";
import Layout from "@/components/ui/Layout";
import { useAuth } from "@/context/auth-provider";
import ToggleTheme from "@/components/common/toggle-theme";


export default function Home() {
  const { t } = useTranslation();
  const { store, loading } = useStore();
  const { isLoading: authLoading } = useAuth();


  useEffect(() => { }, [])

  return (
    <Layout>
      <View className="flex-row items-center justify-between pt-20 px-4 py-4 bg-black/90 shadow-sm">

        <View className="flex items-center flex-row gap-6">
          <NotificationIcon />
          <ToggleTheme />
        </View>
        <Text className="text-2xl font-bold text-white">
          {t("common.home")}
        </Text>
      </View>






      {loading || authLoading ? (
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
