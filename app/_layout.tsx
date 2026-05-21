import React from "react";
import {Stack} from "expo-router"
import { StudentClassContextProvider } from "@/context/studentClassesContext";

export default function RootLayout() {
    return (
      <StudentClassContextProvider>
        <Stack screenOptions={{headerShown: false}}/>
      </StudentClassContextProvider>
    )

}