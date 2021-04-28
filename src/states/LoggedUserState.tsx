import React, { useState } from "react"
import { StateSetter } from "../CommonTypes"

type ContextProps = {
   children: React.ReactNode
}

export class LoggedUserState {
   public loggedUserId: string = ""
   public setLoggedUserId: StateSetter<string> = () => { }
}

export const LoggedUserContext = React.createContext(new LoggedUserState())
export const LoggedUserContextProvider = ({ children }: ContextProps) => {
   const [loggedUserId, setLoggedUserId] = useState<string>("")

   return (
      <LoggedUserContext.Provider
         value={{
            loggedUserId: loggedUserId,
            setLoggedUserId: setLoggedUserId
         }}
      >
         {children}
      </LoggedUserContext.Provider>
   )
}
