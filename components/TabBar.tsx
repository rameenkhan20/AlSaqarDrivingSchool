import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable, Text } from '@react-navigation/elements';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import instructorProfile from '@/app/(tabs)/instructorProfile';
import studentList from '@/app/(tabs)/studentList';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

function TabBar({ state, descriptors, navigation}: BottomTabBarProps) {
    

  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const icon = {
    index: (iconStyle: any) => {
        <FontAwesome name="drivers-license-o" size={24} {...iconStyle} /> 
    },
    instructorProfile: (iconStyle: any) => {
        <EvilIcons name="calendar" size={24} {...iconStyle} />
    },
    studentList:  (iconStyle: any) => {
        <Fontisto name="persons" size={24} {...iconStyle} />
    }
  }

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {icon[route.name]({
                color: isFocused ? colors.primary : colors.text
            })}
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
                
              {/* {label} */}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

export default TabBar;

const styles = StyleSheet.create({
    tabBar : {
        position: "absolute",
        bottom: 40,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.white,
        marginHorizontal: 25,
        marginVertical: 20,
        padding: 10,
        borderRadius: 10,
    },
    tabBarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})
