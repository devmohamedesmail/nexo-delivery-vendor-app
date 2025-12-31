import React, { useState, useMemo } from "react";
import { View, FlatList, Text, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import OrderItem from "@/components/order/OrderItem";
import NoOrdersFound from "@/components/order/NoOrdersFound";
import Layout from "@/components/ui/Layout";
import Header from "@/components/ui/Header";
import { useStore } from "@/hooks/useStore";
import FilterSection from "@/components/order/FilterSection";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import OrderController, { Order, OrderStatus } from "@/controllers/orders/controller";
import { useAuth } from "@/context/auth-provider";

export default function Orders() {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { store } = useStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", store?.id],
    queryFn: () => OrderController.fetchOrdersByStore(store.id, auth.token),
    enabled: !!store?.id && !!auth?.token,
  });

  const tabs: { key: OrderStatus; label: string }[] = [
    { key: "all", label: t("orders.all") },
    { key: "pending", label: t("orders.pending") },
    { key: "accepted", label: t("orders.accepted") },
    { key: "preparing", label: t("orders.preparing") },
    { key: "on_the_way", label: t("orders.onTheWay") },
    { key: "delivered", label: t("orders.delivered") },
    { key: "cancelled", label: t("orders.cancelled") },
  ];

  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    if (activeTab === "all") return orders;
    return orders.filter((order: Order) => order.status === activeTab);
  }, [orders, activeTab]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };


  return (
    <Layout>
      <Header title={t("orders.title")} />

      {/* Order count */}
      <View className="px-5 py-3">
        <Text className="font-bold text-gray-700">
          {t("orders.ordersCount")} - {filteredOrders?.length}
        </Text>
      </View>

      {isLoading ? (
        <OrderSkeleton />
      ) : (
        <>
          <FilterSection
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <FlatList
            data={Array.isArray(filteredOrders) ? filteredOrders : []}
            renderItem={({ item }) =>
              item && <OrderItem item={item} />
            }
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoOrdersFound />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#fd4a12"]}
              />
            }
          />
        </>
      )}
    </Layout>
  );
}
