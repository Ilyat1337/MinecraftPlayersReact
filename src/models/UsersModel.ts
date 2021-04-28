import { StateSetter } from "../CommonTypes"
import { Point, User } from "./Model"
import { getExampleUsers } from "../_dev"
import app from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { mediaService } from "../services/MediaService";


class UsersModel {
   private static readonly USERS_COLLECTION_NAME = "users"  
   private userCollection = firestore().collection(UsersModel.USERS_COLLECTION_NAME)

   private users: User[] = []
   private setUsers: StateSetter<User[]> = () => { }

   private loggedUserId: string = ""
   private setLoggedUserId: StateSetter<string> = () => { }

   public setUsersState(users: User[], setUsers: StateSetter<User[]>): void {
      this.users = users
      this.setUsers = setUsers
   }

   public setLoggedUserSate(loggedUserId: string, setLoggedUserId: StateSetter<string>): void {
      this.loggedUserId = loggedUserId
      this.setLoggedUserId = setLoggedUserId
   }

   public loadUsers(): Promise<void> {
      console.log("Loading users")

      return new Promise((resolve, reject) => {
         setTimeout(() => {
            console.log("Users loaded!")
            this.setUsers(getExampleUsers())
            resolve();
         }, 0);
      });
   }

   public subscribeOnUserChanges(): () => void {
      return this.userCollection.onSnapshot(snapshot => {
         console.log("Received users snapshot. Users count: " + snapshot.docs.length)
         let users = snapshot.docs
            .map(doc => User.fromData(doc.data()))
            .sort((firstUser, secondUser) => 
               (firstUser.nickname > secondUser.nickname) ? 1 : ((secondUser.nickname > firstUser.nickname) ? -1 : 0))
         this.setUsers(users)
      })
   }

   public addUser(id: number): void {
      let newUser = JSON.parse(JSON.stringify(getExampleUsers()[0])) as User
      newUser.id = id.toString()
      newUser.coordinates = new Point(Math.random() * 100, Math.random() * 100)
      this.setUsers(this.users.concat(newUser))      
   }

   public async updateUser(user: User): Promise<void> {
      await this.userCollection.doc(user.id).set(user)
   }

   public async signIn(email: string, password: string): Promise<void> {
      if (!(email && password)) {
         throw new Error("Email and password must be not empty.")
      }

      const credentials = await auth().signInWithEmailAndPassword(email, password)
      this.setLoggedUserId(credentials.user.uid)
   }

   public async signUp(user: User): Promise<void> {
      if (!(user.email && user.password)) {
         throw new Error("Email and password must be not empty.")
      }

      const credentials = await auth().createUserWithEmailAndPassword(user.email, user.password)
      user.id = credentials.user.uid

      const avatarData = await (await fetch(user.avatarUrl)).blob()
      const avatarUrl = await mediaService.uploadAvatar(user.id, avatarData)
      user.avatarUrl = avatarUrl

      await this.userCollection.doc(user.id).set(user)
      this.setLoggedUserId(user.id)
   }

   public getUserById(userId: string): User {
      return this.users.find(user => user.id == userId)
   }
}

export const usersModel = new UsersModel()