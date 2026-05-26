import { StudentClassContextProvider } from "@/context/studentClassesContext";
import { ThemeProvider } from '@/theme/theme-provider';
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
    return (
      <ThemeProvider>
      <StudentClassContextProvider>
        <Stack screenOptions={{headerShown: false}}/>
      </StudentClassContextProvider>
      </ThemeProvider>
    )

}