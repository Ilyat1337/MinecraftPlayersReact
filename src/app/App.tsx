import { NavigationContainer, DarkTheme as RNDarkTheme, DefaultTheme as RNDefaultTheme,  } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { DarkTheme as RNPDarkTheme, DefaultTheme as RNPDefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { usersModel } from '../models/UsersModel';
import Routes from '../views/routes/Routes';
import { UsersContext } from '../states/UsersState';
import { LoggedUserContext } from '../states/LoggedUserState';
import { SettingsContext } from '../states/SettingsState';

const App = () => {
   console.log("Rendering root!")

   const { users, setUsers } = useContext(UsersContext)
   usersModel.setUsersState(users, setUsers)

   const { loggedUserId, setLoggedUserId } = useContext(LoggedUserContext)
   usersModel.setLoggedUserSate(loggedUserId, setLoggedUserId)//getExampleUsers()[0]))

   useEffect(() => {
      //usersModel.loadUsers()
      return usersModel.subscribeOnUserChanges()
   }, [])

   const { color } = useContext(SettingsContext)

   const customDefaultTheme = { ...RNPDefaultTheme, colors: {...RNPDefaultTheme.colors, primary: color, accent: color}}
   const customDarkTheme = { ...RNPDarkTheme, colors: {...RNPDarkTheme.colors, primary: color, accent: color}}
   const { isDarkTheme } = useContext(SettingsContext) 
   return (
      <NavigationContainer theme={isDarkTheme ? RNDarkTheme : RNDefaultTheme}>
         <PaperProvider theme={isDarkTheme ? customDarkTheme : customDefaultTheme}>
            <Routes />
         </PaperProvider>
      </NavigationContainer>
   )
}

export default App;
