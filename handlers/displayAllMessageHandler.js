import { apiReq } from '../utils/fetchReq.js';
import { scrollToBottom } from '../app.js'
import { chatBox } from '../app.js';


export async function displayAllMessages(recieverId, loginUserId) {
    document.getElementById('conversations').innerHTML = ` `
    const getAllMessages = await apiReq('/getAllMessages', {
        recieverId: recieverId,
        loginUserId: loginUserId,
    })
    if (getAllMessages.ok) {

        getAllMessages.data.forEach(element => {
            const isthismyMessage = element.senderId == loginUserId ? (`
            <div id="informationAndMessagesRight" data-id="${element.senderId}">
                <div id="textMessagesRight">
                    <label id="textMessageDataRight">${element.message}</label>
                </div>
                <img id="senderUserImageRight" src="${element.senderImage}" alt="">

            </div>
            
            `) :
                (`
            <div id="informationAndMessagesLeft" data-id="${element.senderId}">
                <img id="senderUserImageLeft" src="${element.senderImage}" alt="">
                <div id="textMessagesLeft">
                    <label id="textMessageDataLeft">${element.message}</label>
                </div>
            </div>
            `)

            document.getElementById('conversations').innerHTML += `
            ${isthismyMessage}
            `

            scrollToBottom(chatBox)
            document.getElementById('loadingCircle').style.display = 'none'
        })
    } else {
        console.log('walang messages')
        document.getElementById('loadingCircle').style.display = 'none'
    }
}