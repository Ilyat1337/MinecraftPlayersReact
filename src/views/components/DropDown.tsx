import {
   LayoutChangeEvent,
   ScrollView,
   StyleProp,
   TextStyle,
   TouchableWithoutFeedback,
   View,
} from "react-native";
import { Menu, Text, TextInput as RNPTextInput, TouchableRipple, useTheme } from "react-native-paper";
import React, { ReactNode, forwardRef, useEffect, useState } from "react";
import TextInput from './TextInput';

import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";
import { Theme } from "react-native-paper/lib/typescript/types";
import { localize } from "../../localization/Localization";

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface DropDownPropsInterface {
   visible: boolean;
   onDismiss: () => void;
   showDropDown: () => void;
   value: string | number | undefined;
   setValue: (_value: string | number) => void;
   label?: string | undefined;
   placeholder?: string | undefined;
   mode?: "outlined" | "flat" | undefined;
   inputProps?: TextInputPropsWithoutTheme;
   list: Array<{
      label: string;
      value: string | number;
      custom?: ReactNode;
   }>;
   dropDownContainerMaxHeight?: number;
   activeColor?: string;
   theme?: Theme;
}

export class DropdownElement {
   constructor(public label: string, public value: any) { }
}

type DropdownProps = {
   dropdownElements: DropdownElement[]
   value: any
   setValue: (any) => void
   mode: "outlined" | "flat"
   label?: string
   style?: StyleProp<TextStyle>
}

type TextInputPropsWithoutTheme = Without<TextInputProps, "theme">;

const Dropdown = (props: DropdownProps) => {
   const [visible, setVisible] = useState<boolean>(false)
   const [displayValue, setDisplayValue] = useState("");

   const { dropdownElements, value, setValue, mode, label, style } = props

   const [inputLayout, setInputLayout] = useState({
      height: 0,
      width: 0,
      x: 0,
      y: 0,
   });

   const onLayout = (event: LayoutChangeEvent) => {
      setInputLayout(event.nativeEvent.layout);
   };

   useEffect(() => {
      const label = dropdownElements.find(element => element.value === value)?.label;
      if (label) {
         setDisplayValue(label);
      }
   }, [dropdownElements, value]);

   return (
      <Menu
         visible={visible}
         onDismiss={() => setVisible(false)}
         // theme={theme}
         anchor={
            <TouchableRipple onPress={() => setVisible(true)} onLayout={onLayout}>
               <View pointerEvents={"none"}>
                  <TextInput
                     value={displayValue}
                     mode={mode}
                     label={label}
                     autoCorrect={false}
                     // placeholder={placeholder}
                     pointerEvents={"none"}
                     //theme={theme}
                     right={<RNPTextInput.Icon name={'menu-down'} />}
                     style={style}
                  />
               </View>
            </TouchableRipple>
         }
         style={{
            maxWidth: inputLayout?.width,
            width: inputLayout?.width,
            marginTop: inputLayout?.height,
         }}
      >
         <ScrollView style={{ maxHeight: 200 }}>
            {dropdownElements.map((element, index) => (
               <Menu.Item
                  key={index}
                  //theme={theme}
                  // titleStyle={{
                  //    color:
                  //       value === _item.value
                  //          ? activeColor || (theme || activeTheme).colors.primary
                  //          : undefined,
                  // }}
                  onPress={() => {
                     setValue(element.value);
                     setVisible(false)
                  }}
                  title={element.label}
                  style={{ width: inputLayout?.width }}
               />
            ))}
         </ScrollView>
      </Menu>
   );
}

export function enumToDropdownElements(e: any): DropdownElement[] {
   return Object.values(e)
      .map(value => new DropdownElement(localize(value as string), value))
}

const DropDown1 = forwardRef<TouchableWithoutFeedback, DropDownPropsInterface>(
   (props, ref) => {
      const activeTheme = useTheme();
      const {
         visible,
         onDismiss,
         showDropDown,
         value,
         setValue,
         activeColor,
         mode,
         label,
         placeholder,
         inputProps,
         list,
         dropDownContainerMaxHeight,
         theme,
      } = props;
      const [displayValue, setDisplayValue] = useState("");
      const [inputLayout, setInputLayout] = useState({
         height: 0,
         width: 0,
         x: 0,
         y: 0,
      });

      const onLayout = (event: LayoutChangeEvent) => {
         setInputLayout(event.nativeEvent.layout);
      };

      useEffect(() => {
         const _label = list.find((_) => _.value === value)?.label;
         if (_label) {
            setDisplayValue(_label);
         }
      }, [list, value]);

      return (
         <Menu
            visible={visible}
            onDismiss={onDismiss}
            // theme={theme}
            anchor={
               <TouchableRipple ref={ref} onPress={showDropDown} onLayout={onLayout}>
                  <View pointerEvents={"none"}>
                     <TextInput
                        value={displayValue}
                        mode={mode}
                        label={label}
                        placeholder={placeholder}
                        pointerEvents={"none"}
                        theme={theme}
                        {...inputProps}
                     />
                  </View>
               </TouchableRipple>
            }
            style={{
               maxWidth: inputLayout?.width,
               width: inputLayout?.width,
               marginTop: inputLayout?.height,
            }}
         >
            <ScrollView style={{ maxHeight: dropDownContainerMaxHeight || 200 }}>
               {list.map((_item, _index) => (
                  <Menu.Item
                     key={_index}
                     //theme={theme}
                     // titleStyle={{
                     //    color:
                     //       value === _item.value
                     //          ? activeColor || (theme || activeTheme).colors.primary
                     //          : undefined,
                     // }}
                     onPress={() => {
                        setValue(_item.value);
                        if (onDismiss) {
                           onDismiss();
                        }
                     }}
                     title={_item.custom || _item.label}
                     style={{ width: inputLayout?.width }}
                  />
               ))}
            </ScrollView>
         </Menu>
      );
   }
);

export default Dropdown;