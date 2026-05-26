import { StudentClassContextProvider } from "@/context/studentClassesContext";
import { Stack } from "expo-router";
import React from "react";


export default function RootLayout() {
    return (
      <StudentClassContextProvider>
        <Stack screenOptions={{headerShown: false}}/>
      </StudentClassContextProvider>
    )

}