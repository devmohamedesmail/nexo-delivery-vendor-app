import React, { createContext } from "react";
import { useAuth } from "./auth-provider";
import useFetch from "@/hooks/useFetch";

export const ProfileContext = createContext({});

export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useAuth();
  const {data,loading,error}=useFetch(`/users/profile/${auth?.user?.id}`);
  // const profile = auth?.user || null;
  const profile = data?.data || null;
  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}
