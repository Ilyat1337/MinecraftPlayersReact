import React, { useState } from "react";
import { User } from "../models/Model";

type ContextProps = {
   children: React.ReactNode
}

export class UsersState {
   public users: User[] = []
   public setUsers: (users: User[]) => void = () => { }
}

export const UsersContext = React.createContext(new UsersState())
export const UsersContextProvider = ({ children }: ContextProps) => {
   const [users, setUsers] = useState<User[]>([])

   return (
      <UsersContext.Provider
         value={{
            users: users,
            setUsers: setUsers
         }}
      >
         {children}
      </UsersContext.Provider>
   )
}