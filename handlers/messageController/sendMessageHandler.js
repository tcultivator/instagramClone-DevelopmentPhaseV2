import { apiReq } from "../../utils/fetchReq.js";
import { scrollToBottom } from "../../app.js";
import { chatBox } from "../../app.js";

export default async function sendThisMessage(message, recieverId, loginUserId, loginUsername, loginProfileimage,socket) {
    document.getElementById('conversations').innerHTML += `
             <div id="informationAndMessagesRight" data-id="${loginUserId}">
                <div id="textMessagesRight">
                    <label id="textMessageDataRight">${message}</label>
                    <label id="seenLabel"></label>
                </div>
                <img id="senderUserImageRight" src="${loginProfileimage}" alt="">

            </div>
            `
    scrollToBottom(chatBox)

    document.getElementById('emojiList').style.display = 'none'
    const fakeElement = document.querySelector(`#convoContent[data-id="${recieverId}"]`)
    if (fakeElement) {
        const labelElementOnHistoryMessage = fakeElement.querySelector('#latestMessageInHistory')
        labelElementOnHistoryMessage.innerHTML = `You: <span>${message}</span>`
    }

    document.getElementById('sendNewMessageInput').value = ''
    document.getElementById('sendNewMessageButton').style.display = 'none'
    document.getElementById('sendLikeMessage').style.display = 'flex'
    const sendNewMessage = await apiReq('/sendNewMessage', {
        recieverId: recieverId,
        loginUserId: loginUserId,
        senderUsername: loginUsername,
        loginProfileimage: loginProfileimage,
        message: message
    })
    if (sendNewMessage.ok) {
        console.log('success sent')
        socket.emit('displayNewMessage', { recieverId, loginUserId, loginProfileimage, message, loginUsername })

    } else {
        console.log('error sent')
    }
}
