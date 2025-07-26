import { apiReq } from '../utils/fetchReq.js';
import { displayNewMessageAtHistory } from '../helper/displayNewMessageAtHistory.js'

export async function openMessageWindow(loginUserId) {
    document.getElementById('loadingCircle').style.display = 'flex'
    const displayAllMessageHistory = await apiReq('/displayAllMessageHistory', {
        loginUserId: loginUserId
    })

    if (displayAllMessageHistory.ok) {
        document.getElementById('loadingCircle').style.display = 'none'
        document.getElementById('messageBody').style.display = 'flex'
        displayAllMessageHistory.data.forEach(async element => {
            let senderIdIsMe;
            const newMessage = await displayNewMessageAtHistory(element.senderId, element.recieverId)

            if (newMessage) {
                const isMedia = newMessage.message.match(/\.(mp4|webm|ogg|jpg|jpeg|png|gif|webp)$/i);
                if (isMedia) {
                    senderIdIsMe = newMessage.senderId == loginUserId ? (
                        `
                <label data-id="${newMessage.senderId}" id="latestMessageInHistory">You: <span>Sent File</span></label>
                `
                    ) :
                        (`
                <label data-id="${newMessage.senderId}" id="latestMessageInHistory">${newMessage.senderUsername}: <span>Sent File</span></label>
                
                `)
                } else {
                    senderIdIsMe = newMessage.senderId == loginUserId ? (
                        `
                <label data-id="${newMessage.senderId}" id="latestMessageInHistory">You: <span>${newMessage.message}</span></label>
                `
                    ) :
                        (`
                <label data-id="${newMessage.senderId}" id="latestMessageInHistory">${newMessage.senderUsername}: <span>${newMessage.message}</span></label>
                
                `)
                }

            } else {
                senderIdIsMe = `<label id="latestMessageInHistory"><span>No messages</span></label>`
            }



            const isMeSender = element.senderId == loginUserId ? (`
            <div id="convoContent" data-id="${element.recieverId}">
                <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                <div>
                    <label data-id="${element.recieverId}">${element.recieverUsername}</label>
                    ${senderIdIsMe}
                </div>
            </div>
                `) :
                (`
            <div id="convoContent" data-id="${element.senderId}">
                <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                <div>
                    <label data-id="${element.senderId}">${element.senderUsername}</label>
                    ${senderIdIsMe}
                </div>
            </div>
                
                
                `)

            document.getElementById('listOfconvoBody').innerHTML += `
            ${isMeSender}
            `
        })
    } else {
        console.log('error sa frontend message button')
        document.getElementById('loadingCircle').style.display = 'none'
    }
}