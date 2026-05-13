import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{headerShown : false}} />;
}


// export function TabLayout() {
//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="dashboard">
//         <EvilIcons name="calendar" size={22} color="black" />
//         {/* <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="CalendarMonthOutlined.fill" md="CalendarMonthOutlined" /> */}
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="instructorProfile">
//         <FontAwesome name="drivers-license-o" size={22} color="black" />
//         {/* <NativeTabs.Trigger.Icon sf="gear" md="settings" />
//         <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label> */}
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="studentList">
//         <Fontisto name="persons" size={22} color="black" />
//         {/* <NativeTabs.Trigger.Icon sf="gear" md="settings" />
//         <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label> */}
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }

