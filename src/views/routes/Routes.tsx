import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
import { LoggedUserContext } from '../../states/LoggedUserState';

export const RouteNames = {
   DISPATCH_ROUTE: 'DispatchRoute',
   AUTH_ROUTES: 'AuthRoutes',
   MAIN_ROUTES: 'MainRoutes',
   SIGN_IN_ROUTE: 'SignIn',
   SIGN_UP_ROUTE: 'SignUp',
   MAP_ROUTE: 'Map',
};

export type RootStackParamList = {
   AuthRoutes: undefined
   MainRoutes: undefined
};

const Stack = createStackNavigator<RootStackParamList>();

export default () => {
   const context = useContext(LoggedUserContext)

   return (
      <Stack.Navigator>  
      {
         context.loggedUserId ? (
            <Stack.Screen name="MainRoutes" component={MainRoutes} options={{ headerShown: false }} />
         ) : (
            <Stack.Screen name="AuthRoutes" component={AuthRoutes} options={{ headerShown: false }} />
         )
      }
      </Stack.Navigator>
   )
}
