import React, { useContext } from "react";
import { StyleSheet, View } from "react-native"
import { Button, Switch, TouchableRipple, useTheme } from "react-native-paper"
import { Picker } from "@react-native-picker/picker";
import { Language, SettingsContext } from "../states/SettingsState";
import Slider from "@react-native-community/slider";
import { LoggedUserContext } from "../states/LoggedUserState";
import Text from './components/Text';
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "./routes/MainRoutes";
import { localize, setAppLanguage } from "../localization/Localization";

type Props = {
   navigation: StackNavigationProp<MainStackParamList, "Tabs">;
};

const SettingsView = ({ navigation }: Props) => {
   const { language, setLanguage,
      fontFamily, setFontFamily,
      fontSize, setFontSize,
      color, setColor,
      isDarkTheme, setIsDarkTheme } = useContext(SettingsContext)

   const { setLoggedUserId } = useContext(LoggedUserContext)

   const { colors: { text } } = useTheme()


   return (
      <View style={styles.container}>
         <View style={styles.settingLine}>
            <Text>Language</Text>
            <Picker
               selectedValue={language}
               onValueChange={(value) => { 
                  setAppLanguage(value)
                  setLanguage(value)
                }}
               style={{ ...styles.formInput, color: text, fontSize: 40, fontFamily }}
               mode="dropdown"
               dropdownIconColor={text}
               itemStyle={{ color: "white" }}

            >
               <Picker.Item label="English" value={Language.En} />
               <Picker.Item label="Русский" value={Language.Ru} />
            </Picker>
         </View>

         <View style={styles.settingLine}>
            <Text>Font name</Text>
            <Picker
               selectedValue={fontFamily}
               onValueChange={(value) => setFontFamily(value)}
               style={{ ...styles.formInput, color: text }}
               mode="dropdown"
               dropdownIconColor={text}
            >
               <Picker.Item label="Sans Serif" value="sans-serif" />
               <Picker.Item label="Helvetica Regular" value="HelveticaRegular" />
               <Picker.Item label="Avenir Next" value="AvenirNextCyr-Regular" />
               <Picker.Item label="Noteworthy" value="Noteworthy-Lt" />
               <Picker.Item label="Stick" value="Stick" />
            </Picker>
         </View>

         <View style={styles.settingLine}>
            <Text>{`${localize("Size")} (${fontSize})`}</Text>
            <View style={styles.formInput}>
               <Slider
                  style={styles.slider}
                  value={fontSize}
                  onValueChange={(size) => setFontSize(size)}
                  minimumValue={14}
                  maximumValue={22}
                  minimumTrackTintColor={color}
                  thumbTintColor={color}
                  step={1}
               />
            </View>
         </View>

         <TouchableRipple onPress={() => setIsDarkTheme(!isDarkTheme)}>
            <View style={styles.settingLine}>
               <Text>Dark theme</Text>
               <View pointerEvents="none">
                  <Switch value={isDarkTheme} />
               </View>
            </View>
         </TouchableRipple>

         <TouchableRipple onPress={() => navigation.navigate("ColorPicker", { setColor: setColor, oldColor: color })}>
            <View style={[styles.settingLine, { marginTop: 15 }]}>
               <Text>Color</Text>
               <View style={[styles.colorIndicator, { backgroundColor: color }]} />
            </View>
         </TouchableRipple>

         <View style={styles.centeredContainer}>
            <Button color="red" onPress={() => setLoggedUserId("")}>{localize("Log out")}</Button>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      marginVertical: 10,
      marginHorizontal: 16,
   },
   settingLine: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
      alignItems: "center"
   },
   formInput: {
      width: "50%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
   },
   slider: {
      width: "88%",
      height: 40
   },
   centeredContainer: {
      alignItems: 'center',
      marginVertical: 5,
   },
   colorIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10
   }
})

export default SettingsView