import React, { useContext, useRef, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { AuthStackParamList } from './routes/AuthRoutes';
import { SettingsContext } from '../states/SettingsState';
import { usersModel } from '../models/UsersModel';
import OkDialog, { DialogData } from './components/OkDialog';
import Text from './components/Text';
import TextInput from './components/TextInput';
import { localize } from '../localization/Localization';

type Props = {
   navigation: StackNavigationProp<AuthStackParamList, "SignIn">;
};

const SignInView = ({ navigation }: Props) => {
   useContext(SettingsContext)

   const [email, setEmail] = useState<string>('')
   const [password, setPassword] = useState<string>('')   
   const [isSigningIn, setIsSigningIn] = useState<boolean>(false)

   const [isShowingDialog, setIsShowingDialog] = useState<boolean>(false)
   const dialogData = useRef<DialogData>(new DialogData("", ""))


   const handleLogin = async () => {
      setIsSigningIn(true)
      await usersModel
         .signIn(email, password)
         .catch(error => {
            handleError(error)
            setIsSigningIn(false)
         })
   }

   const handleError = (error: any) => {
      if (error instanceof Error) {
         dialogData.current = new DialogData(localize("Error"), (error as Error).message)
         setIsShowingDialog(true)
      }
   }

   const handleSignUpClick = () => {
      navigation.navigate("SignUp");
   }

   const theme = useTheme()

   return (
      <>
         <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={styles.formNameText}>Sign In</Text>
            <TextInput
               value={email}
               mode="outlined"
               onChangeText={(data: string) => setEmail(data)}
               placeholder={localize('Email')}
               style={styles.input}
            />
            <TextInput
               value={password}
               mode="outlined"
               onChangeText={(data: string) => setPassword(data)}
               placeholder={localize('Password')}
               secureTextEntry={true}
               style={styles.input}
            />

            {/* <Button title={'Login'} onPress={handleLogin}  /> */}
            <Button loading={isSigningIn} mode="contained" onPress={handleLogin}>
               {localize("Sign in")}
            </Button>
            <Text onPress={handleSignUpClick} style={styles.signUpText}>
               {localize("Don't have an account? Sign up.")}
            </Text>

            <OkDialog
               isShowing={isShowingDialog}
               setIsShowing={setIsShowingDialog}
               dialogData={dialogData.current}
            />
         </View>
      </>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      //backgroundColor: '#ecf0f1',
      backgroundColor: 'black',
   },
   formNameText: {
      fontSize: 25,
      marginBottom: 10,
   },
   signUpText: {
      fontSize: 15,
      padding: 20,
      fontStyle: 'italic',
      marginBottom: 10,
      //color: 'black',
   },
   input: {
      width: "70%",
      //height: 44,
      //padding: 10,
      //borderWidth: 0.7,
      //borderColor: 'grey',
      marginBottom: 10,
   },
});

export default SignInView;
