import React from 'react';
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../routes/MainRoutes";
import MapView, { MapEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import { LogBox, StyleSheet, View } from 'react-native';
import { mapRegion } from '../../app/Constants';
import { RouteProp } from '@react-navigation/native';
import { Point } from '../../models/Model';

type Props = {
   navigation: StackNavigationProp<MainStackParamList, "CoordinatesPicker">
   route: RouteProp<MainStackParamList, "CoordinatesPicker">
};

const CoordinatesPicker = ({ navigation, route }: Props) => {
   const handleMapPress = (mapEvent: MapEvent) => {
      let coordinates = mapEvent.nativeEvent.coordinate
      route.params.setCoordinates(new Point(coordinates.latitude, coordinates.longitude))
      navigation.goBack()
   }

   return (
      <View style={styles.container}>
         <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
            onPress={(mapEvent: MapEvent) => handleMapPress(mapEvent)}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      height: '100%',
   },
   map: {
      ...StyleSheet.absoluteFillObject,
   },
});

LogBox.ignoreLogs([
   'Non-serializable values were found in the navigation state',
]);

export default CoordinatesPicker