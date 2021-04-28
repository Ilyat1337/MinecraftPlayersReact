import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { MainStackParamList } from "../routes/MainRoutes";

type ImagePreviewProps = {
   imageUrls: string[]
   navigation: StackNavigationProp<MainStackParamList, "Details">
}

const ImagePreview = (props: ImagePreviewProps) => {
   const { imageUrls } = props;

   return (
      <View style={styles.container}>
         {
            imageUrls.slice(0, 4).map((imageUrl, i) => (
               <TouchableOpacity
                  key={i}
                  onPress={() =>
                     props.navigation.navigate("Gallery", { imageUrls: imageUrls, startIndex: i })
                  }
                  style={styles.imageContainer}
               >
                  <Image style={styles.image} source={{ uri: imageUrl }} />
               </TouchableOpacity>
            ))
         }
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      width: "100%",
      marginTop: 10,
      display: "flex",
      flexDirection: "row",
      marginBottom: 10,
      //justifyContent: "space-between"
   },
   imageContainer: {
      width: "25%"
   },
   image: {
      //width: Dimensions.get("screen").width / 5,
      height: 50,
      borderRadius: 8,
      //
      marginHorizontal: 5
   },
});

export default ImagePreview