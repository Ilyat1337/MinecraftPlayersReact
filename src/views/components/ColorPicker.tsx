import React from 'react';
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../routes/MainRoutes";
import { LogBox, StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ColorPicker as ColorPickerComponent } from 'react-native-color-picker'

type Props = {
   navigation: StackNavigationProp<MainStackParamList, "ColorPicker">
   route: RouteProp<MainStackParamList, "ColorPicker">
};

const ColorPicker = ({ navigation, route }: Props) => {
   const { setColor, oldColor } = route.params

   return (
      <View style={styles.container}>
         <ColorPickerComponent
            oldColor={oldColor}
            onColorSelected={color => setColor(color)}
            style={{ flex: 1 }}
            hideSliders
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingBottom: 90
   },
});

LogBox.ignoreLogs([
   'Non-serializable values were found in the navigation state',
]);

export default ColorPicker