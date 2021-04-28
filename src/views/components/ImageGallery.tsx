import { RouteProp } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";
import { MainStackParamList } from "../routes/MainRoutes";

type Props = {
   route: RouteProp<MainStackParamList, "Gallery">
};

const ImageGallery = (props: Props) => {
   const { params } = props.route

   return (
      <Carousel
         itemWidth={Dimensions.get("screen").width}
         sliderWidth={Dimensions.get("screen").width}
         data={params.imageUrls}
         firstItem={params.startIndex}
         initialScrollIndex={params.startIndex}
         renderItem={({ item }) => (
            <Image
               style={styles.image}
               source={{ uri: item }}
               resizeMethod="resize"
               resizeMode="contain"
            />
         )}
      />
   );
}

const styles = StyleSheet.create({
   image: {
      width: "100%",
      height: "100%",
   },
});

export default ImageGallery
