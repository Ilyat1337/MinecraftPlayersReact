import React from 'react';
import { LoggedUserContextProvider } from '../states/LoggedUserState';
import { SettingsContextProvider } from "../states/SettingsState"
import { UsersContextProvider } from "../states/UsersState"
import App from "./App"

const AppWrapper = () => {
   return (
      <UsersContextProvider>
         <LoggedUserContextProvider>
            <SettingsContextProvider>
               <App />
            </SettingsContextProvider>
         </LoggedUserContextProvider>
      </UsersContextProvider>
   )
}

export default AppWrapper