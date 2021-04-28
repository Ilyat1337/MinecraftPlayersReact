import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

class MediaService {
   private static readonly AVATARS_STORAGE_NAME = "avatars"
   private static readonly USERS_STORAGE_NAME = "users"
   private static readonly GALLERY_FOLDER_NAME = "gallery"
   private static readonly VIDEOS_FOLDER_NAME = "videos"

   private avatarStorage = storage().ref(MediaService.AVATARS_STORAGE_NAME)
   private userStorage = storage().ref(MediaService.USERS_STORAGE_NAME)

   public async uploadAvatar(userId: string, avatarData: Blob): Promise<string> {
      const avatarReference = this.avatarStorage.child(userId)
      await avatarReference.put(avatarData).then()
      return await avatarReference.getDownloadURL()
   }

   public async uploadImages(userId: string, localImageUrls: string[]): Promise<string[]> {
      const galleryRef = this.getUserGalleyReference(userId)
      const promises = localImageUrls.map(async imageUrl => {
         const imageRef = galleryRef.child(uuid())
         await imageRef.putFile(imageUrl)
         return await imageRef.getDownloadURL()
      })

      return await Promise.all(promises)
   }

   public async deleteImages(imageUrls: string[]): Promise<void> {
      const promises = imageUrls.map(async imageUrl => {
         const imageRef = storage().refFromURL(imageUrl)
         await imageRef.delete()
      })

      await Promise.all(promises)
   }

   public async uploadVideo(userId: string, localVideoUrl: string): Promise<string> {
      const videoRef = this.getUserVideosReference(userId).child(uuid())
      await videoRef.putFile(localVideoUrl)
      return await videoRef.getDownloadURL()
   }

   public async deleteVideo(videoUrl: string): Promise<void> {
      const videoRef = storage().refFromURL(videoUrl)
      return await videoRef.delete()
   }

   private getUserGalleyReference(userId: string): FirebaseStorageTypes.Reference {
      return this.userStorage.child(userId).child(MediaService.GALLERY_FOLDER_NAME)
   }

   private getUserVideosReference(userId: string): FirebaseStorageTypes.Reference {
      return this.userStorage.child(userId).child(MediaService.VIDEOS_FOLDER_NAME)
   }
}

export const mediaService = new MediaService()