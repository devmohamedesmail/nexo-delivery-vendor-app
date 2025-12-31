import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/ui/Header";
import { useAuth } from "@/context/auth-provider";
import Loading from "@/components/ui/Loading";
import EmptyNotification from "@/components/common/empty-notification";
import axios from "axios";
import { config } from "@/constants/config";
import { Toast } from "toastify-react-native";
import Layout from "@/components/ui/Layout";
import NotificationItem from "@/components/notifications/NotificationItem";

interface NotificationItem {
  id: string;
  type:
    | "order_received"
    | "order_accepted"
    | "order_ready"
    | "order_delivered"
    | "order_cancelled";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  orderId?: string;
}

export default function Notification() {
  const { data } = useLocalSearchParams();
  const notifications: NotificationItem[] =
    typeof data === "string"
      ? JSON.parse(data)
      : Array.isArray(data)
        ? JSON.parse(data[0])
        : [];
  const { t } = useTranslation();
  const router = useRouter();
  const { auth } = useAuth();

  return (
    <Layout>
      <Header title={t("notifications.title")} />
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {notifications.length === 0 ? <EmptyNotification /> : null}

          {notifications &&
            notifications.map((item) => (
             <NotificationItem key={item.id} item={item} />
            ))}
        </ScrollView>
      </View>
    </Layout>
  );
}
