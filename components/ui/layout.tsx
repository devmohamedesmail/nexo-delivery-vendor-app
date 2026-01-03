import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useTheme } from "@/context/theme-provider";


export default function Layout({ children }: { children: React.ReactNode }) {
  const {theme}=useTheme();
  return (
    <SafeAreaView className={`flex-1 edges={["bottom"]} ${theme === "dark" ? "bg-black" : "bg-gray-50"} `}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {children}
    </SafeAreaView>
  );
}
