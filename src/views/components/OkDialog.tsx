import React from "react"
import { Button, Dialog, Paragraph, Portal } from "react-native-paper"

export class DialogData {
   constructor(public title: string, public text: string) { }
}

type OkDialogProps = {
   isShowing: boolean
   setIsShowing: (boolean) => void
   dialogData: DialogData
}

const OkDialog = (props: OkDialogProps) => {
   return (
      <Portal>
         <Dialog visible={props.isShowing} onDismiss={() => props.setIsShowing(false)}>
            <Dialog.Title>{props.dialogData.title}</Dialog.Title>
            <Dialog.Content>
               <Paragraph>{props.dialogData.text}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
               <Button onPress={() => props.setIsShowing(false)}>Ok</Button>
            </Dialog.Actions>
         </Dialog>
      </Portal>
   )
}

export default OkDialog