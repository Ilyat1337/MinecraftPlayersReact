import React, { useContext } from "react";
import { TextInput as RNPTextInput } from "react-native-paper"
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";
import { SettingsContext } from "../../states/SettingsState";

type CustomTextInputProps = Omit<TextInputProps, "theme"> & {
   theme?: ReactNativePaper.Theme;
}

const TextInput = (props: CustomTextInputProps) => {
   const { fontSize, fontFamily } = useContext(SettingsContext)

   return (
      <RNPTextInput
         {...props}
         style={[{ fontSize: fontSize, fontFamily: fontFamily }, props.style]}
      />
   )
}

//theme: ReactNativePaper.Theme;

export default TextInput