import React, { useContext } from 'react';
import MapView, {  Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image, StyleSheet, View } from 'react-native';
import { UsersContext } from '../states/UsersState';
import { User } from '../models/Model';
import { Text } from 'react-native-paper';
import { mapRegion } from '../app/Constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from './routes/MainRoutes';

type UserMarkerProps = {
   user: User
}

const UserMapIcon = (props: UserMarkerProps) => {
   const { user } = props;

   return (
      <View style={styles.markerContainer}>
         <Text style={styles.markerText}>{user.nickname}</Text>
         <Image
            source={{
               uri: user.avatarUrl
            }}
            style={styles.image}
         />
      </View>
   )
}

type Props = {
   navigation: StackNavigationProp<MainStackParamList, "Tabs">;
};

const Map = ({ navigation }: Props) => {
   const context = useContext(UsersContext)

   return (
      <View style={styles.container}>
         <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={mapRegion}>
            {context.users.filter(user => user.coordinates).map((user, i) => (
               <Marker
                  coordinate={user.coordinates}
                  onPress={() => navigation.navigate("Details", { userId: user.id, userName: user.nickname })}
                  key={i}
               >
                  <UserMapIcon key={i} user={user} />
               </Marker>
            ))}
         </MapView>
      </View >
   )
}

const styles = StyleSheet.create({
   container: {
      height: '100%',
   },
   map: {
      ...StyleSheet.absoluteFillObject,
   },
   markerContainer: {
      alignContent: "center",
      alignItems: "center"
   },
   markerText: {
      padding: 3,
      backgroundColor: "#00000060",
   },
   image: {
      height: 25,
      width: 25,
      marginTop: 8,
      borderRadius: 4
   },
})

export default Map
