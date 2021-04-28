import React, { useContext, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { usersModel } from '../models/UsersModel';
import { avatarService } from '../services/AvatarService';
import { MobType, OccupationType, PrivilegeType, User } from '../models/Model';
import Dropdown, { enumToDropdownElements } from './components/DropDown'
import OkDialog, { DialogData } from './components/OkDialog'
import Text from './components/Text';
import TextInput from './components/TextInput';
import { localize } from '../localization/Localization';
import { SettingsContext } from '../states/SettingsState';

const SignUpView = () => {
   useContext(SettingsContext)

   const [avatarUrl, setAvatarUrl] = useState<string>(avatarService.getDefaultAvatarUrl())
   const [email, setEmail] = useState<string>('')
   const [password, setPassword] = useState<string>('')

   const [nickname, setNickname] = useState<string>("")
   const [occupation, setOccupation] = useState<OccupationType>(OccupationType.Building)
   const [favouriteMob, setFavouriteMob] = useState<MobType>(MobType.Creeper)

   const [favouriteServerAddress, setFavouriteServerAddress] = useState<string>("")
   const [privilege, setPrivilege] = useState<PrivilegeType>(PrivilegeType.Player)

   const [realworldName, setRealworldName] = useState<string>("")
   const [country, setCountry] = useState<string>("")
   const [city, setCity] = useState<string>("")
   const [age, setAge] = useState<string>("")

   const [isSigningUp, setIsSigningUp] = useState<boolean>(false)

   const [isShowingDialog, setIsShowingDialog] = useState<boolean>(false)
   const dialogData = useRef<DialogData>(new DialogData("", ""))

   const handleSignUp = () => {
      let user = new User("", email, password, nickname, occupation, favouriteMob, favouriteServerAddress,
         privilege, realworldName, country, city, parseInt(age) ?? 0, avatarUrl)

      setIsSigningUp(true)

      usersModel
         .signUp(user)
         .catch(error => {
            handleError(error)
            setIsSigningUp(false)
         })
   }

   const handleNicknameChange = async () => {
      const avatarUrl = await avatarService.getAvatarUrlForNickname(nickname)
      console.log(avatarUrl)
      setAvatarUrl(avatarUrl)
   }

   const handleError = (error: any) => {
      let errorMessage: string

      if (error instanceof Error) {
         errorMessage = (error as Error).message
      } else {
         errorMessage = error
      }

      dialogData.current = new DialogData(localize("Error"), errorMessage)
      setIsShowingDialog(true)
   }

   return (
      <ScrollView>
         <View style={styles.centeredContainer}>
            <Image
               style={styles.avatarImage}
               source={{ uri: avatarUrl }}
            />
         </View>

         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{localize("Credentials")}</Text>
            <TextInput
               value={email}
               mode="outlined"
               onChangeText={(data: string) => setEmail(data)}
               label={localize("Email")}
               autoCorrect={false}
               style={styles.sectionLine}
            />
            <TextInput
               value={password}
               mode="outlined"
               onChangeText={(data: string) => setPassword(data)}
               label={localize("Password")}
               secureTextEntry={true}
               style={styles.sectionLine}
            />
         </View>

         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{localize("Ingame")}</Text>
            <TextInput
               value={nickname}
               mode="outlined"
               onChangeText={(data: string) => setNickname(data)}
               label={localize("Nickname")}
               style={styles.sectionLine}
               autoCorrect={false}
               onEndEditing={handleNicknameChange}
            />
            <Dropdown
               mode="outlined"
               value={occupation}
               setValue={setOccupation}
               dropdownElements={enumToDropdownElements(OccupationType)}
               label={localize("Occupation")}
               style={styles.sectionLine}
            />
            <Dropdown
               mode="outlined"
               value={favouriteMob}
               setValue={setFavouriteMob}
               dropdownElements={enumToDropdownElements(MobType)}
               label={localize("Favourite mob")}
               style={styles.sectionLine}
            />
         </View>

         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{localize("Favourite server")}</Text>
            <TextInput
               value={favouriteServerAddress}
               mode="outlined"
               onChangeText={(data: string) => setFavouriteServerAddress(data)}
               label={localize("Server address")}
               autoCorrect={false}
               style={styles.sectionLine}
            />
            <Dropdown
               mode="outlined"
               value={privilege}
               setValue={setPrivilege}
               dropdownElements={enumToDropdownElements(PrivilegeType)}
               label={localize("Privilege")}
               style={styles.sectionLine}
            />
         </View>

         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{localize("Real world")}</Text>
            <TextInput
               value={realworldName}
               mode="outlined"
               onChangeText={(data: string) => setRealworldName(data)}
               label={localize("Name")}
               autoCorrect={false}
               style={styles.sectionLine}
            />
            <TextInput
               value={country}
               mode="outlined"
               onChangeText={(data: string) => setCountry(data)}
               label={localize("Country")}
               autoCorrect={false}
               style={styles.sectionLine}
            />
            <TextInput
               value={city}
               mode="outlined"
               onChangeText={(data: string) => setCity(data)}
               label={localize("City")}
               autoCorrect={false}
               style={styles.sectionLine}
            />
            <TextInput
               value={age}
               mode="outlined"
               onChangeText={(data: string) => setAge(data)}
               label={localize("Age")}
               style={styles.sectionLine}
            />
         </View>

         <View style={styles.centeredContainer}>
            <Button
               loading={isSigningUp}
               onPress={handleSignUp}
               style={styles.signUpButton}
               mode="contained"
            >
               {localize("Sign up")}
            </Button>
         </View>

         <OkDialog
            isShowing={isShowingDialog}
            setIsShowing={setIsShowingDialog}
            dialogData={dialogData.current}
         />

      </ScrollView>
   )
}

const styles = StyleSheet.create({
   centeredContainer: {
      alignItems: "center"
   },
   avatarImage: {
      width: 150,
      height: 150,
      borderRadius: 10
   },
   sectionContainer: {
      marginHorizontal: 16,
      marginVertical: 10
   },
   sectionTitle: {
      // fontSize: 15
      opacity: 0.5
   },
   sectionLine: {
      marginVertical: 5
   },
   signUpButton: {
      width: 290,
      marginBottom: 20
   }
})

export default SignUpView;
