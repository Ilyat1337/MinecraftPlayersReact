import { Gender, MobType, OccupationType, Point, PrivilegeType, User } from './models/Model';

const exampleUser = new User(
   "1",
   "Ilya@email.com",
   "password",
   "Ilya",
   OccupationType.MapArt,
   MobType.Creeper,
   "mc.hypixel.net",
   PrivilegeType.VipPlus,
   "Ilya",
   "Belarus",
   "Minsk",
   19,
   "https://crafatar.com/avatars/c06f89064c8a49119c29ea1dbd1aab82?size=150&overlay"
)

export const getExampleUser = (): User => {
   return JSON.parse(JSON.stringify(exampleUser))
}

export const getExampleUsers = (): User[] => {
   return Array.from({length: 4}).map((_, index) =>{
      let user = getExampleUser()
      user.id = index.toString()
      user.coordinates = new Point(Math.random() * 100, Math.random() * 100)
      user.imageUrls = [
         "https://i.picsum.photos/id/429/150/300.jpg?hmac=Bh9wghd3kGclhTp0AmpMBonpCFpzEUCNGecLL7Sn7bI",
         "https://i.picsum.photos/id/22/300/300.jpg?hmac=hpHOD_a9-i6VAVANAhXPGG6fEyYK_-TNpMOM6aBQfgE",
         "https://i.picsum.photos/id/1012/300/150.jpg?hmac=eSEwHIgJQmTwGj3bbFui3Klo81t4jYYr61PxbqSht_0",
         "https://i.picsum.photos/id/429/150/300.jpg?hmac=Bh9wghd3kGclhTp0AmpMBonpCFpzEUCNGecLL7Sn7bI",
         "https://i.picsum.photos/id/22/300/300.jpg?hmac=hpHOD_a9-i6VAVANAhXPGG6fEyYK_-TNpMOM6aBQfgE",
         "https://i.picsum.photos/id/1012/300/150.jpg?hmac=eSEwHIgJQmTwGj3bbFui3Klo81t4jYYr61PxbqSht_0"
      ]
      user.videoUrl = "https://www.youtube.com/watch?v=5NV6Rdv1a3I"
      return user
   })
};
