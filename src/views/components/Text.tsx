import React, { useContext } from "react";
import { TextProps } from "react-native"
import { Text as RNPText } from "react-native-paper"
import { localize } from "../../localization/Localization";
import { SettingsContext } from "../../states/SettingsState";

type CustomTextProps = TextProps & {
   children: React.ReactNode
}

const Text = (props: CustomTextProps) => {
   const { fontSize, fontFamily } = useContext(SettingsContext)

   return (
      <RNPText
         {...props}
         style={[{ fontSize: fontSize, fontFamily: fontFamily }, props.style]}
      >
         {localize(props.children as string)}
      </RNPText>
   )
}

export default Text