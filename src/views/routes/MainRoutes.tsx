import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React, { useContext } from "react";
import ListView from "../ListView";
import SettingsView from "../SettingsView";
import Map from "../MapView"
import { createStackNavigator } from "@react-navigation/stack";
import DetailsView from "../DetailsView";
import ImageGallery from "../components/ImageGallery";
import EditView from "../EditView";
import CoordinatesPicker from "../components/CoordinatesPicker";
import { Point } from "../../models/Model";
import ColorPicker from "../components/ColorPicker";
import { localize } from "../../localization/Localization";
import { SettingsContext } from "../../states/SettingsState";

type TabsParamList = {
   List: undefined
   Map: undefined
   Settings: undefined
};

const Tab = createMaterialBottomTabNavigator<TabsParamList>();

export type MainStackParamList = {
   Tabs: undefined
   Details: { userId: string, userName: string }
   Edit: { userId: string }
   Gallery: { imageUrls: string[], startIndex: number }
   CoordinatesPicker: { setCoordinates: (coordinates: Point | undefined) => void }
   ColorPicker: { setColor: (color: string) => void, oldColor: string }
};

const Stack = createStackNavigator<MainStackParamList>();

const Tabs = () => {
   useContext(SettingsContext)

   return (
      <Tab.Navigator>
         <Tab.Screen
            name="List"
            component={ListView}
            options={{
               tabBarLabel: localize("Players"),
               tabBarIcon: "account",
            }}
         />
         <Tab.Screen
            name="Map"
            component={Map}
            options={{
               tabBarLabel: localize("Map"),
               tabBarIcon: "map"
            }}
         />
         <Tab.Screen
            name="Settings"
            component={SettingsView}
            options={{
               tabBarLabel: localize("Settings"),
               tabBarIcon: "cog",
            }}
         />
      </Tab.Navigator>
   )
}

export default () => (
   <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
         name="Tabs"
         component={Tabs}
         options={{ headerShown: false }}
      />
      <Stack.Screen
         name="Details"
         component={DetailsView}
         // options={{ headerStyle: styles.header }}
         options={({ route }) => ({ title: route.params.userName })}
      />
      <Stack.Screen
         name="Gallery"
         component={ImageGallery}
         options={{ title: localize("Gallery") }}
      />
      <Stack.Screen
         name="Edit"
         component={EditView}
         options={{ title: localize("Edit") }}
      />
      <Stack.Screen
         name="CoordinatesPicker"
         component={CoordinatesPicker}
         options={{ title: localize("Pick coordinates") }}
      />
      <Stack.Screen
         name="ColorPicker"
         component={ColorPicker}
         options={{ title: localize("Pick color") }}
      />
   </Stack.Navigator>
)