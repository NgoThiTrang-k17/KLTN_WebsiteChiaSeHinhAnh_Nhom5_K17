import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../infrastructure/theme/colors";

import { PotsScreen } from "../../features/post/screens/posts.screen"
const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Home: "md-home",
  Search: "md-search",
  Message: "md-message",
  Account: "md-account",
};

const createScreenOptions = ({ route }) => {
    const iconName = TAB_ICON[route.name];
    return {
      tabBarIcon: ({ size, color }) => (
        <Ionicons name={iconName} size={size} color={color} />
      ),
    };
};

export const AppNavigator = () => (
    <Tab.Navigator
        screenOptions={createScreenOptions}
        tabBarOptions={{
        activeTintColor: colors.brand.primary,
        inactiveTintColor: colors.brand.muted,
        }}
    >
        <Tab.Screen name="Home" component={PotsScreen} />
        {/* <Tab.Screen name="Search" />
        <Tab.Screen name="Message" />
        <Tab.Screen name="Account" /> */}
    </Tab.Navigator>
);