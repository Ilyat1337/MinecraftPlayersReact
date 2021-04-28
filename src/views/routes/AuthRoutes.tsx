import React, { useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../SignInView";
import SignUp from "../SignUpView";
import { localize } from '../../localization/Localization';
import { SettingsContext } from '../../states/SettingsState';

export type AuthStackParamList = {
   SignIn: undefined
   SignUp: undefined
};

const Stack = createStackNavigator<AuthStackParamList>();

export default () => {
   useContext(SettingsContext)

   return (
      < Stack.Navigator initialRouteName="SignIn" >
         <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: localize("Sign up") }}
         />
      </Stack.Navigator >
   )
}
