import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { io, Socket } from "socket.io-client";
import useFetch from "@/hooks/useFetch";
import { useStore } from "@/hooks/useStore";

export default function NotificationIcon() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const { data, refetch } = useFetch(`/notifications/?notifiable_id=8&notifiable_type=store`)
  const { store } = useStore();
  const [notificationcount, setNotificationCount] = useState(data?.data?.length || 0);
  const [socketNotification, setSocketNotification] = useState<Socket | null>(null);


  const socket = io("https://tawsila-app.onrender.com", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    const storeId = 8;
    socket.emit("join_store", store?.id);
    socket.on("new_order", (data) => {
      refetch();
      setNotificationCount((prevCount: any) => prevCount + 1);
    });

    // When disconnected
    socket.on("disconnect", () => {
      setIsConnected(false);
    });


    setSocketNotification(socket);

    return () => {
      socket.disconnect();
    };
  }, [store?.id]);







  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => router.push({
          pathname: "/notification",
          params: { data: JSON.stringify(data?.data || []) },
        })}
        className="w-10 h-10 bg-white rounded-full items-center justify-center"
      >
        <Ionicons name="notifications" size={20} color="#fd4a12" />
      </TouchableOpacity>
      <View
        className={`absolute top-0 -right-3  border-2 border-white w-6 h-6 flex flex-row items-center justify-center rounded-full ${isConnected ? "bg-green-600" : "bg-red-600"}`}
      >
        <Text className="text-center text-xs text-white">
          {data?.data?.length || 0}
          {/* {notificationcount} */}
        </Text>
      </View>
    </View>
  );
}
