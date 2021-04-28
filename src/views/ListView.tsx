import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native"
import { List, Button } from "react-native-paper"
import { User } from "../models/Model";
import { MainStackParamList } from "./routes/MainRoutes";
import { UsersContext } from "../states/UsersState";
import Text from './components/Text';
import { SettingsContext } from "../states/SettingsState";
import { localize } from "../localization/Localization";

type Props = {
   navigation: StackNavigationProp<MainStackParamList, "Tabs">;
};

const ListView = ({ navigation }: Props) => {
   const context = useContext(UsersContext)
   useContext(SettingsContext)

   console.log("Rendering players list!")
   return (
      <View>
         <FlatList<User>
            //https://crafatar.com/avatars/c06f89064c8a49119c29ea1dbd1aab82?size=8&overlay
            data={context.users}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => (
               <List.Item
                  left={() => (
                     <Image
                        source={{
                           uri: item.avatarUrl
                        }}
                        style={styles.image}
                     />
                  )}
                  title={<Text>{item.nickname}</Text>}
                  description={<Text>{`${localize(item.occupation)} ${item.age}  ${localize("y.o.")}`}</Text>}
                  onPress={() => navigation.navigate("Details", { userId: item.id, userName: item.nickname })}
               />
            )}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   image: {
      height: 50,
      width: 50,
      margin: 8,
      borderRadius: 4,
   },
   row: {
      flexDirection: 'row',
   },
   column: {
      flexDirection: 'column',
   },
});

export default ListView