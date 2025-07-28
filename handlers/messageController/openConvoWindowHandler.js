import { apiReq } from "../../utils/fetchReq.js"
import { displayAllMessages } from "./displayAllMessageHandler.js"
export default async function openConvoWindow(recieverId, loginUserId, loginUsername, loginProfileimage, socket) {

    document.getElementById('loadingCircle').style.display = 'flex'
    const findConvoData = await apiReq('/findConvoData', {
        recieverId: recieverId,
        loginUserId: loginUserId,
        loginUsername: loginUsername,
        loginProfileimage: loginProfileimage
    })
    if (findConvoData.ok) {
        console.log(findConvoData.data)
        displayAllMessages(recieverId, loginUserId)
        socket.emit('seenThisMessage', { recieverId, loginUserId })
        document.getElementById('conversationBody').style.display = 'flex'

        const ifRecieverIsYou = findConvoData.data[0].recieverUsername == loginUsername ? (

            findConvoData.data[0].senderUsername
        ) : (

            findConvoData.data[0].recieverUsername
        )
        document.getElementById('usernameInconversationHeader').textContent = ifRecieverIsYou
    } else {
        console.log('sa frontend error')
    }
}
