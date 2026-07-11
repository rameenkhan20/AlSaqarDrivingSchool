import { StudentClassContextProvider } from "@/context/studentClassesContext";
import { supabase } from "@/services/supabaseClient";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  supabase.from("_test").select().then(console.log);    //testing 
    return (
      <StudentClassContextProvider>
        <Stack screenOptions={{headerShown: false}}/>
      </StudentClassContextProvider>
    )

}