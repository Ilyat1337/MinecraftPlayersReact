import React, { useContext, useRef, useState } from 'react';
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button, Divider, IconButton } from "react-native-paper";
import { MainStackParamList } from "./routes/MainRoutes";
import { usersModel } from '../models/UsersModel';
import { MobType, OccupationType, Point, PrivilegeType, User } from '../models/Model';
import OkDialog, { DialogData } from './components/OkDialog';
import { Image, PermissionsAndroid, ScrollView, StyleSheet, View } from 'react-native';
import Dropdown, { enumToDropdownElements } from './components/DropDown';
import { launchImageLibrary } from 'react-native-image-picker';
import { mediaService } from '../services/MediaService';
import RNFetchBlob from 'rn-fetch-blob'
import Text from './components/Text';
import TextInput from './components/TextInput';
import { localize } from '../localization/Localization';
import { UsersContext } from '../states/UsersState';

type Props = {
   navigation: StackNavigationProp<MainStackParamList, "Edit">
   route: RouteProp<MainStackParamList, "Edit">
};

class DisplayedImage {
   constructor(public imageUrl: string, public isUploaded: boolean = true) { }
}

type ImagesEditorProps = {
   displayedImages: DisplayedImage[]
   setDisplayedImages: (images: DisplayedImage[]) => void
   addDeletedImage: (imageUrl: string) => void
}

const ImagesEditor = (props: ImagesEditorProps) => {
   const { displayedImages, setDisplayedImages, addDeletedImage } = props

   const deleteImage = (imageIndex: number) => {
      const imageToDelete = displayedImages[imageIndex]
      if (imageToDelete.isUploaded) {
         addDeletedImage(imageToDelete.imageUrl)
      }

      setDisplayedImages(displayedImages.filter((_, index) => index != imageIndex))
   }

   const handleAddImage = () => {
      launchImageLibrary({ mediaType: "photo" }, ({ didCancel, uri }) => {
         if (didCancel) { return }

         setDisplayedImages(displayedImages.concat(new DisplayedImage(uri, false)))
      })
   }

   return (
      <View>
         {
            displayedImages.map((displayedImage, index) => {
               return (
                  <View key={index}>
                     <View style={styles.imageLine}>
                        <Image
                           source={{
                              uri: displayedImage.imageUrl
                           }}
                           style={styles.image}
                        />

                        <Button onPress={() => deleteImage(index)}>{localize("Delete")}</Button>
                     </View>
                     {
                        index < displayedImages.length - 1 &&
                        <Divider />
                     }
                  </View>
               )
            })
         }

         <View style={styles.centeredContainer}>
            <Button
               onPress={handleAddImage}
               style={styles.editButton}
               mode="contained"
            >
               {localize("Add image")}
            </Button>
         </View>
      </View>
   )
}

type VideoEditorProps = {
   videoUrl: string | undefined
   setVideoUrl: (videoUrl: string | undefined) => void
   setVideoNeedsDeleting: (videoNeedsDeleting: boolean) => void
}

const VideoEditor = (props: VideoEditorProps) => {
   const { videoUrl, setVideoUrl, setVideoNeedsDeleting } = props

   const handleAddVideo = () => {
      launchImageLibrary({ mediaType: "video" }, ({ didCancel, uri }) => {
         if (didCancel) { return }

         setVideoUrl(uri)
      })
   }

   const handleDeleteVideo = () => {
      setVideoUrl(undefined)
      setVideoNeedsDeleting(true)
   }

   return (
      <View style={styles.centeredContainer}>
         {
            videoUrl ? (
               <Button
                  onPress={handleDeleteVideo}
                  style={styles.editButton}
                  mode="contained"
                  color="red"
               >
                  {localize("Delete video")}
               </Button>

            ) : (
               <Button
                  onPress={handleAddVideo}
                  style={styles.editButton}
                  mode="contained"
               >
                  {localize("Add video")}
               </Button>
            )
         }
      </View>
   )
}

const EditView = ({ navigation, route }: Props) => {
   let { users } = useContext(UsersContext)
   const user = users.find(user => user.id === route.params.userId)

   const [nickname, setNickname] = useState<string>(user.nickname)
   const [occupation, setOccupation] = useState<OccupationType>(user.occupation)
   const [favouriteMob, setFavouriteMob] = useState<MobType>(user.favouriteMob)

   const [favouriteServerAddress, setFavouriteServerAddress] = useState<string>(user.favouriteServerAddress)
   const [privilege, setPrivilege] = useState<PrivilegeType>(user.privilege)

   const [realworldName, setRealworldName] = useState<string>(user.realworldName)
   const [country, setCountry] = useState<string>(user.country)
   const [city, setCity] = useState<string>(user.city)
   const [age, setAge] = useState<string>(user.age.toString())

   const [coordinates, setCoordinates] = useState<Point | undefined>(user.coordinates)

   const [displayedImages, setDisplayedImages] = useState<DisplayedImage[]>(() =>
      user.imageUrls.map(imgeUrl => new DisplayedImage(imgeUrl)))
   const imagesToDelete = useRef<string[]>([])

   const [videoUrl, setVideoUrl] = useState<string | undefined>(user.videoUrl)
   const videoNeedsDeleting = useRef<boolean>(false)
   const videoHasChanged = useRef<boolean>(false)

   const [isSaving, setIsSaving] = useState<boolean>(false)

   const [isShowingDialog, setIsShowingDialog] = useState<boolean>(false)
   const dialogData = useRef<DialogData>(new DialogData("", ""))

   const getMergedDisplayedImages: (displayedImages: DisplayedImage[], uploadedImageUrls: string[]) => DisplayedImage[]
      = (displayedImages: DisplayedImage[], uploadedImageUrls: string[]) => {
         let mergedDisplayedImages: DisplayedImage[] = []

         let uploadedImageIndex = 0
         for (let displayedImage of displayedImages) {
            if (displayedImage.isUploaded) {
               mergedDisplayedImages.push(displayedImage)
            } else {
               mergedDisplayedImages.push(new DisplayedImage(uploadedImageUrls[uploadedImageIndex++]))
            }
         }

         return mergedDisplayedImages
      }

   const deleteAndUploadImages: () => Promise<string[]> = async () => {
      await mediaService.deleteImages(imagesToDelete.current)
      console.log(`Deleted ${imagesToDelete.current.length} images`)
      imagesToDelete.current = []

      let uploadedImageUrls = await mediaService.uploadImages(user.id, displayedImages
         .filter(image => !image.isUploaded)
         .map(image => image.imageUrl))
      console.log(`Uploaded ${uploadedImageUrls.length} images`)
      let newDisplayedImages = getMergedDisplayedImages(displayedImages, uploadedImageUrls)
      setDisplayedImages(newDisplayedImages)

      return Promise.resolve(newDisplayedImages.map(displayedImage => displayedImage.imageUrl))
   }

   const deleteAndUploadVideo: () => Promise<string | undefined> = async () => {
      let uploadedVideoUrl: string | undefined = user.videoUrl

      if (uploadedVideoUrl && videoNeedsDeleting.current) {
         await mediaService.deleteVideo(uploadedVideoUrl)
         uploadedVideoUrl = undefined
         console.log("Deleted user's video")
      }

      if (videoUrl && videoHasChanged.current) {
         const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
         );

         if (result === PermissionsAndroid.RESULTS.GRANTED) {
            let videoPath = (await RNFetchBlob.fs.stat(videoUrl)).path
            uploadedVideoUrl = await mediaService.uploadVideo(user.id, videoPath)

            console.log("Uploaded video. Url: " + uploadedVideoUrl)
         }
      }

      videoNeedsDeleting.current = false
      videoHasChanged.current = false
      setVideoUrl(uploadedVideoUrl)

      return Promise.resolve(uploadedVideoUrl)
   }

   const createUpdatedUser: (imageUrls: string[], videoUrl?: string) => User
      = (imageUrls: string[], videoUrl?: string) => {
         let updatedUser = new User(user.id, user.email, user.password, nickname, occupation, favouriteMob,
            favouriteServerAddress, privilege, realworldName, country, city, parseInt(age) ?? 0, user.avatarUrl)

         updatedUser.coordinates = coordinates
         updatedUser.imageUrls = imageUrls
         updatedUser.videoUrl = videoUrl

         return updatedUser
      }

   const handleSave = async () => {
      setIsSaving(true)

      try {
         let imageUrls = await deleteAndUploadImages()
         let uploadedVideoUrl = await deleteAndUploadVideo()
         let updatedUser = createUpdatedUser(imageUrls, uploadedVideoUrl)
         usersModel.updateUser(updatedUser)
         console.log("Successfuly updated player")
      } catch (e) {
         console.log(e)
         handleError(e)
      } finally {
         setIsSaving(false)
      }
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

   React.useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <Button loading={isSaving} onPress={handleSave} >
               {localize("Save")}
            </Button >
         ),
      });
   });

   return (
      <ScrollView>
         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{localize("Ingame")}</Text>
            <TextInput
               value={nickname}
               mode="outlined"
               onChangeText={(data: string) => setNickname(data)}
               label={localize("Nickname")}
               autoCorrect={false}
               style={styles.sectionLine}
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

         <View style={styles.sectionContainer}>
            <View style={styles.coordinatesLine}>
               <Text style={styles.sectionTitle}>{localize("Coordinates")}</Text>
               <View style={styles.coordinatesEdit}>
                  <IconButton
                     icon="plus-circle"
                     size={25}
                     onPress={() => navigation.navigate("CoordinatesPicker", { setCoordinates: setCoordinates })}
                     color={"grey"}
                     style={{ margin: 0 }}

                  />
                  <IconButton
                     icon="minus-circle"
                     size={25}
                     onPress={() => setCoordinates(undefined)}
                     color={"grey"}
                     style={{ margin: 0 }}
                  />
               </View>
            </View>

            <TextInput
               value={coordinates ? coordinates.latitude.toPrecision(5) : ""}
               mode="outlined"
               editable={false}
               label={localize("Latitude")}
               style={styles.sectionLine}
            />
            <TextInput
               value={coordinates ? coordinates.longitude.toPrecision(5) : ""}
               mode="outlined"
               editable={false}
               label={localize("Longitude")}
               style={styles.sectionLine}
            />
         </View>

         <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{localize("Images")}</Text>

            <ImagesEditor
               displayedImages={displayedImages}
               setDisplayedImages={setDisplayedImages}
               addDeletedImage={(imageUrl: string) => imagesToDelete.current.push(imageUrl)}
            />
         </View>

         <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
            <Text style={styles.sectionTitle}>{localize("Video")}</Text>

            <VideoEditor
               videoUrl={videoUrl}
               setVideoUrl={(videoUrl: string | undefined) => {
                  setVideoUrl(videoUrl)
                  videoHasChanged.current = true
               }}
               setVideoNeedsDeleting={(needsDeleting: boolean) => {
                  videoNeedsDeleting.current = needsDeleting
                  videoHasChanged.current = true
               }}
            />
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
      //fontSize: 15
      opacity: 0.5
   },
   sectionLine: {
      marginVertical: 5
   },
   coordinatesLine: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5
   },
   coordinatesEdit: {
      display: "flex",
      flexDirection: "row",
   },
   editButton: {
      width: 240,
      marginTop: 20
   },
   image: {
      width: 100,
      height: 70,
      borderRadius: 8,
      marginVertical: 10
   },
   imageLine: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      // marginBottom: 10,
   },
})

export default EditView