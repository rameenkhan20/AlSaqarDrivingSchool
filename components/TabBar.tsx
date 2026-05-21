import { Colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


function TabBar({ state, descriptors, navigation}: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    const icon : { [key: string]: any  } = {
        index: (iconStyle: any) => (
            <Ionicons
                    name="calendar-outline"
                    size={22}
                    {...iconStyle}
                />
        ),
        studentList:  (iconStyle: any) => (
            <Ionicons
                    name="people"
                    size={22} 
                    {...iconStyle} 
                />
        ),
        instructorProfile: (iconStyle: any) => (
            <Ionicons
                    name="settings-outline" 
                    size={22} 
                    {...iconStyle}  />
        )
    }

    return (
        <View style={[styles.tabBar, {paddingBottom: insets.bottom}]}>
        {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label: any =
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
                    color: isFocused ? Colors.secondary : Colors.steel
                })}
                <Text style={{ color: isFocused ? Colors.secondary : Colors.placeholder , fontSize: 11, fontWeight: "500" }}>
                {label}
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
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.white,
        padding: 10,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    tabBarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})
