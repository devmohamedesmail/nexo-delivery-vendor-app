
import AuthProvider from "@/context/auth-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "../i18n/i18n"
import ToastManager from "toastify-react-native";
import ProfileProvider from "@/context/profile-provider";
import 'react-native-gesture-handler';
import { NetworkProvider } from "@/context/network-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/theme-provider";




export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <NetworkProvider>
              <Stack screenOptions={{ headerShown: false }}></Stack>
              <ToastManager />
              <StatusBar style="auto" />
            </NetworkProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>

    </QueryClientProvider>

  );
}
