import React, { useState } from "react"
import { StateSetter } from "../CommonTypes"

type ContextProps = {
   children: React.ReactNode
}

export enum Language {
   En = "en",
   Ru = "ru"
}

class SettingsDefaults {
   public static readonly language = Language.En
   public static readonly fontFamily = "sans-serif"
   public static readonly fontSize = 18
   public static readonly color = "orange"
   public static readonly isDarkTheme = false
}

export class SettingsState {
   public language = SettingsDefaults.language
   public setLanguage: StateSetter<Language> = () => {}

   public fontFamily = SettingsDefaults.fontFamily
   public setFontFamily: StateSetter<string> = () => {}

   public fontSize = SettingsDefaults.fontSize
   public setFontSize: StateSetter<number> = () => {}

   public color = SettingsDefaults.color
   public setColor: StateSetter<string> = () => {}

   public isDarkTheme = SettingsDefaults.isDarkTheme
   public setIsDarkTheme: StateSetter<boolean> = () => {}
}

export const SettingsContext = React.createContext(new SettingsState())
export const SettingsContextProvider = ({ children }: ContextProps) => {
   const [language, setLanguage] = useState<Language>(SettingsDefaults.language)
   const [fontFamily, setFontFamily] = useState<string>(SettingsDefaults.fontFamily)
   const [fontSize, setFontSize] = useState<number>(SettingsDefaults.fontSize)
   const [color, setColor] = useState<string>(SettingsDefaults.color)
   const [isDarkTheme, setIsDarkTheme] = useState<boolean>(SettingsDefaults.isDarkTheme)

   return (
      <SettingsContext.Provider
         value={{
            language: language,
            setLanguage: setLanguage,
            fontFamily: fontFamily,
            setFontFamily: setFontFamily,
            fontSize: fontSize, 
            setFontSize: setFontSize,
            color: color,
            setColor: setColor,
            isDarkTheme: isDarkTheme,
            setIsDarkTheme: setIsDarkTheme
         }}
      >
         {children}
      </SettingsContext.Provider>
   )
}
