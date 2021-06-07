import React, { useContext, useState } from "react";
import { Text, View } from 'react-native';

export const PotsScreen = ({ navigation }) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text>Hello, world!</Text>
        </View>
    )
}