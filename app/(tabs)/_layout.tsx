import { Tabs } from 'expo-router'
import React from 'react'

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
      <Tabs.Screen name="instructorProfile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="studentList" options={{ title: 'Students' }} />
    </Tabs>
  )
}

export default TabLayout







// import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
// import { PlatformPressable } from '@react-navigation/elements';
// import { useLinkBuilder, useTheme } from '@react-navigation/native';
// import { Text, View } from 'react-native';

// // type Props = {
// //     state : any;
// //     descriptors: any;
// //     navigation: any;
// // }

// // type forRoute = {
// //     route : any;
// //     index: any;
// // }


// function MyTabBar({ state, descriptors, navigation } : BottomTabBarButtonProps) {
//   const { colors } = useTheme();
//   const { buildHref } = useLinkBuilder();

//   return (
//     <View style={{ flexDirection: 'row' }}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//               ? options.title
//               : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         return (
//           <PlatformPressable
//             key={route.key}
//             href={buildHref(route.name, route.params)}
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarButtonTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{ flex: 1 }}
//           >
//             <Text style={{ color: isFocused ? colors.primary : colors.text }}>
//               {label}
//             </Text>
//           </PlatformPressable>
//         );
//       })}
//     </View>
//   );
// }



// export default function Layout() {
//   return (
//     <Tabs>
//       <TabSlot />
//       <TabList style={styles.BottomTabBar}>
//         <TabTrigger name="home" href="/(tabs)/dashboard">
//             <EvilIcons name="calendar" size={22} color="black" />
//           <Text>Home</Text>
//         </TabTrigger>
//         <TabTrigger name="profile" href="/(tabs)/instructorProfile">
//         <FontAwesome name="drivers-license-o" size={22} color="black" />
//           <Text>profile</Text>
//         </TabTrigger>
//         <TabTrigger name="students" href="/(tabs)/studentList">
//         <Fontisto name="persons" size={22} color="black" />
//           <Text>Article</Text>
//         </TabTrigger>
//       </TabList>
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//     BottomTabBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         backgroundColor: Colors.white,
//         paddingVertical: 10,
//         borderTopWidth: 1,
//         borderTopColor: Colors.steel,
//     }
// })
