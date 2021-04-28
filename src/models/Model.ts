export class Point {
   latitude: number;
   longitude: number;

   constructor(lat: number, lng: number) {
      this.latitude = lat;
      this.longitude = lng;
   }
}

export enum OccupationType {
   Survival = "Survival",
   Rredstone = "Redstone",
   Building = "Building",
   Pvp = "PvP",
   MapArt = "Map art",
   Speedrun = "Speedrun",
   Hardcore = "Hardcore",
}

export enum PrivilegeType {
   Player = "Player",
   Moderator = "Moderator",
   Admin = "Admin",
   Vip = "VIP",
   VipPlus = "VIP+",
   Mvp = "MVP",
   MvpPlus = "MVP+"
}

export enum MobType {
   Creeper = "Creeper",
   Zombie = "Zombie",
   Skeleton = "Skeleton",
   Spider = "Spider",
   Eenderman = "Enderman",
   Blaze = "Blaze",
   Slime = "Slime",
   MagmaCube = "Magma cube"
}

export enum Gender {
   MAN,
   WOMAN,
}

export class User {
   public coordinates?: Point
   public imageUrls: string[] = []
   public videoUrl?: string

   constructor(
      public id: string,
      public email: string,      
      public password: string,

      public nickname: string,
      public occupation: OccupationType,
      public favouriteMob: MobType,

      public favouriteServerAddress: string,
      public privilege: PrivilegeType,

      public realworldName: string,
      public country: string,
      public city: string,
      public age: number,

      public avatarUrl: string
   ) {
   }

   public static fromData(data: any): User {
      let user = new User(data.id, data.email, data.password, data.nickname, data.occupation, data.favouriteMob,
         data.favouriteServerAddress, data.privilege, data.realworldName, data.country, data.city, parseInt(data.age) ?? 0, data.avatarUrl)
      
      user.coordinates = data.coordinates
      user.imageUrls = data.imageUrls
      user.videoUrl = data.videoUrl

      return user
   }
}
