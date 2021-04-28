import React, { useContext } from 'react';
import { Image, StyleSheet, View } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, Divider } from "react-native-paper"
import { MainStackParamList } from "./routes/MainRoutes";
import { RouteProp } from '@react-navigation/native';
import { usersModel } from '../models/UsersModel';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePreview from './components/ImagePreview';
import Video from "react-native-video";
import { UsersContext } from '../states/UsersState';
import Text from './components/Text';
import { SettingsContext } from '../states/SettingsState';
import { localize } from '../localization/Localization';

type Props = {
   navigation: StackNavigationProp<MainStackParamList, "Details">
   route: RouteProp<MainStackParamList, "Details">
};

const DetailsView = ({ navigation, route }: Props) => {
   useContext(SettingsContext)

   let { users } = useContext(UsersContext)
   const user = users.find(user => user.id === route.params.userId)

   React.useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <Button onPress={() => { navigation.navigate("Edit", { userId: user.id }) }} >
               {localize("Edit")}
            </Button >
         ),
      });
   }, [navigation]);

   return (
      <ScrollView>
         <View style={styles.centeredContainer}>
            <Image
               style={styles.avatarImage}
               source={{ uri: user.avatarUrl }}
            />
            <Text style={{ fontSize: 30 }} >{user.nickname}</Text>
         </View>
         <Divider style={styles.divider} />
         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ingame</Text>
            <View style={styles.sectionContent}>
               <View style={styles.sectionLine}>
                  <Text>Nickname</Text>
                  <Text>{user.nickname}</Text>
               </View>

               <View style={styles.sectionLine}>
                  <Text>Occupation</Text>
                  <Text>{user.occupation}</Text>
               </View>

               <View style={styles.sectionLine}>
                  <Text>Favourite mob</Text>
                  <Text>{user.favouriteMob}</Text>
               </View>
            </View>
         </View>

         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Favourite server</Text>
            <View style={styles.sectionContent}>
               <View style={styles.sectionLine}>
                  <Text>Server address</Text>
                  <Text>{user.favouriteServerAddress}</Text>
               </View>

               <View style={styles.sectionLine}>
                  <Text>Privilege</Text>
                  <Text>{user.privilege}</Text>
               </View>
            </View>
         </View>

         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Real world</Text>
            <View style={styles.sectionContent}>
               <View style={styles.sectionLine}>
                  <Text>Name</Text>
                  <Text>{user.realworldName}</Text>
               </View>

               <View style={styles.sectionLine}>
                  <Text>Country</Text>
                  <Text>{user.country}</Text>
               </View>

               <View style={styles.sectionLine}>
                  <Text>City</Text>
                  <Text>{user.city}</Text>
               </View>

               <View style={styles.sectionLine}>
                  <Text>Age</Text>
                  <Text>{user.age}</Text>
               </View>
            </View>
         </View>

         {
            user.coordinates &&
            <View style={styles.sectionContainer}>
               <Text style={styles.sectionTitle}>Coordinates</Text>
               <View style={styles.sectionContent}>
                  <View style={styles.sectionLine}>
                     <Text>Latitude</Text>
                     <Text>{user.coordinates!.latitude.toPrecision(5)}</Text>
                  </View>

                  <View style={styles.sectionLine}>
                     <Text>Longitude</Text>
                     <Text>{user.coordinates!.longitude.toPrecision(5)}</Text>
                  </View>
               </View>
            </View>
         }

         {
            user.imageUrls.length > 0 &&
            <View style={styles.sectionContainer}>
               <Text style={styles.sectionTitle}>Images</Text>
               <View style={styles.sectionContent}>
                  <ImagePreview imageUrls={user.imageUrls} navigation={navigation} />
               </View>
            </View>
         }

         {
            user.videoUrl &&
            <View style={styles.sectionContainer}>
               <Text style={styles.sectionTitle}>Video</Text>
               <View style={styles.sectionContent}>
                  <Video
                     style={styles.video}
                     //source={{ uri: "https://bit.ly/swswift" }}
                     source={{ uri: user.videoUrl }}
                     resizeMode="contain"
                     controls
                     paused
                  />
               </View>
            </View>
         }
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
   divider: {
      marginVertical: 10,
   },
   sectionContainer: {
      marginHorizontal: 16,
      marginVertical: 10
   },
   sectionContent: {
      marginHorizontal: 10
   },
   sectionTitle: {
      opacity: 0.5
   },
   sectionLine: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5
   },
   video: {
      width: "100%",
      height: 200,
      marginBottom: 20,
   },
})

export default DetailsView