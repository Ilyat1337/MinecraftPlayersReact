import en from "./en.json"
import ru from "./ru.json"

let appLanguage: string = "en"

const locales = {
   en, ru
}

export function setAppLanguage(language: string) {
   appLanguage = language
}

export function localize(text: string) {
   return (locales as any)[appLanguage][text] ?? text;
}