import { apiReq } from '../../utils/fetchReq.js';
import { scrollToBottom } from '../../app.js'
import { chatBox } from '../../app.js';


export async function displayAllMessages(recieverId, loginUserId) {
    document.getElementById('conversations').innerHTML = ` `
    const getAllMessages = await apiReq('/getAllMessages', {
        recieverId: recieverId,
        loginUserId: loginUserId,
    })
    if (getAllMessages.ok) {

        getAllMessages.data.forEach(element => {
            const isMedia = element.message.match(/\.(mp4|webm|ogg|jpg|jpeg|png|gif|webp)$/i);
            if (isMedia) {
                const isImage = element.message.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                if (isImage) {
                    console.log('eti ung seen', element.seen)
                    const isSeen = element.seen == true ? (`<label id="seenLabel">seen</label>`) :
                        (`<label id="seenLabel"></label>`)
                    const isthismyMessage = element.senderId == loginUserId ? (`
                    <div id="informationAndMessagesRight" data-id="${element.senderId}">
                        
                        <div id="textMessagesRightImg">
                            <img id="sendfileMessage" src="${element.message}" alt="">
                            ${isSeen}
                        </div>
                        <img id="senderUserImageRight" src="${element.senderImage}" alt="">

                    </div>
            
                    `) :
                        (`
                    <div id="informationAndMessagesLeft" data-id="${element.senderId}">
                        <img id="senderUserImageLeft" src="${element.senderImage}" alt="">
                        <div id="textMessagesLeftImg">
                            <img id="sendfileMessage" src="${element.message}" alt="">
                        </div>
                    </div>
                    `)

                    document.getElementById('conversations').innerHTML += `
                    ${isthismyMessage}
                    `

                    scrollToBottom(chatBox)
                    document.getElementById('loadingCircle').style.display = 'none'
                } else {
                    const isSeen = element.seen == true ? (`<label id="seenLabel">seen</label>`) :
                        (`<label id="seenLabel"></label>`)
                    const isthismyMessage = element.senderId == loginUserId ? (`
                    <div id="informationAndMessagesRight" data-id="${element.senderId}">
                    
                        <div id="textMessagesRightImg">
                            <video controls preload="metadata" loading="lazy" poster="assets/posterForVid.jpg" id="sendfileMessage" src="${element.message}"></video>
                            ${isSeen}
                        </div>
                        <img id="senderUserImageRight" src="${element.senderImage}" alt="">

                    </div>
            
                    `) :
                        (`
                    <div id="informationAndMessagesLeft" data-id="${element.senderId}">
                        <img id="senderUserImageLeft" src="${element.senderImage}" alt="">
                        <div id="textMessagesLeftImg">
                            <video controls preload="metadata" loading="lazy" poster="assets/posterForVid.jpg" id="sendfileMessage" src="${element.message}"></video>
                        </div>
                    </div>
                    `)

                    document.getElementById('conversations').innerHTML += `
                    ${isthismyMessage}
                    `

                    scrollToBottom(chatBox)
                    document.getElementById('loadingCircle').style.display = 'none'
                }
            }
            else {
                const isSeen = element.seen == true ? (`<label id="seenLabel">seen</label>`) :
                    (`<label id="seenLabel"></label>`)
                const isthismyMessage = element.senderId == loginUserId ? (`
            <div id="informationAndMessagesRight" data-id="${element.senderId}">
                
                <div id="textMessagesRight">
                    <label id="textMessageDataRight">${element.message}</label>
                    ${isSeen}
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
            }


        })
    } else {
        console.log('walang messages')
        document.getElementById('loadingCircle').style.display = 'none'
    }
}