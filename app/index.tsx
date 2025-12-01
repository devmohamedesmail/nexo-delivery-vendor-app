import { AuthContext } from "@/context/auth_context";
import React, { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import { Link, Redirect, router } from "expo-router";
import Loading from "@/components/ui/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { auth, isLoading } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!auth) return;

    if (auth.user?.role?.role === "driver") {
      router.replace("/driver");
    }

    if (auth.user?.role?.role === "store_owner") {
      router.replace("/stores");
    }
  }, [auth]);

  if (isLoading) {
    return <Loading />;
  }

  if (!auth) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white justify-center items-center"
      edges={["bottom"]}
    >
      <View>
        <Text className="text-lg text-center mb-4">
          {t("auth.noauthvarified")}
        </Text>
        <Link
          href="/auth/login"
          className="bg-primary text-white px-10 py-3 rounded-full"
        >
          {t("auth.login")}
        </Link>
      </View>
    </SafeAreaView>
  );
}
