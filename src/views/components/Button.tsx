import { useContext } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Surface, Button as RNPButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { SettingsContext } from "../../states/SettingsState";

type CustomButtonProps = React.ComponentProps<typeof Surface> & {
   mode?: 'text' | 'outlined' | 'contained'
   dark?: boolean
   compact?: boolean
   color?: string
   loading?: boolean
   icon?: IconSource
   disabled?: boolean
   children: React.ReactNode
   uppercase?: boolean
   accessibilityLabel?: string
   onPress?: () => void
   onLongPress?: () => void
   contentStyle?: StyleProp<ViewStyle>
   style?: StyleProp<ViewStyle>
   labelStyle?: StyleProp<TextStyle>
   theme?: ReactNativePaper.Theme
   testID?: string
}

const Button = (props: CustomButtonProps) => {
   const { fontSize, fontFamily } = useContext(SettingsContext)

   return (
      <RNPButton
         {...props}
         //style={[{ fontFamily: fontFamily }, props.style]}
      >
         {props.children}
      </RNPButton>
   )
}

export default Text