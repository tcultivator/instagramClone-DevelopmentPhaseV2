import { apiReq } from '../../utils/fetchReq.js';
import { displayNewMessageAtHistory } from '../../helper/index.js'

export default async function openMessageWindow(loginUserId) {
    document.getElementById('loadingCircle').style.display = 'flex'
    document.getElementById('listOfconvoBody').innerHTML = ''

    const displayAllMessageHistory = await apiReq('/displayAllMessageHistory', {
        loginUserId: loginUserId
    })

    if (displayAllMessageHistory.ok) {
        document.getElementById('loadingCircle').style.display = 'none'
        document.getElementById('messageBody').style.display = 'flex'

        displayAllMessageHistory.data.forEach(async element => {
            let senderIdIsMe;
            let isThisnewMessageEqualtoLoginId;
            let isThisnewMessage;

            if (element.isFriends == true || element.senderId == loginUserId) {
                const newMessage = await displayNewMessageAtHistory(element.senderId, element.recieverId)
                console.log('eto ung laman ng newMessage Request ', newMessage)

                if (newMessage) {
                    const isMedia = newMessage.message.match(/\.(mp4|webm|ogg|jpg|jpeg|png|gif|webp)$/i);

                    // --- Format Last Message Text ---
                    let messageText = isMedia ? 'Sent a file' : newMessage.message;
                    let prefix = newMessage.senderId == loginUserId ? 'You: ' : '';

                    // Construct the label HTML
                    senderIdIsMe = `
                        <label data-id="${newMessage.senderId}" id="latestMessageInHistory">
                            ${prefix}<span>${messageText}</span>
                        </label>
                    `;

                    // --- Determine Active/Unread State ---
                    // Using Instagram's subtle grey (#efefef) instead of dark grey for unread/active
                    const activeBg = "background-color: #efefef;";
                    const normalBg = "background-color: #ffffff;";

                    // Case 1: I am the Sender (Reciever is the contact)
                    if (newMessage.seen == false && newMessage.senderId != loginUserId) {
                        // Unread message for me
                        isThisnewMessageEqualtoLoginId = `
                        <div id="convoContent" data-id="${element.recieverId}" style="${activeBg}">
                            <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                            <div>
                                <label data-id="${element.recieverId}" style="font-weight:600;">${element.recieverUsername}</label>
                                ${senderIdIsMe}
                            </div>
                        </div>`;
                    } else {
                        // Read or I sent it
                        isThisnewMessageEqualtoLoginId = `
                        <div id="convoContent" data-id="${element.recieverId}" style="${normalBg}">
                            <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                            <div>
                                <label data-id="${element.recieverId}">${element.recieverUsername}</label>
                                ${senderIdIsMe}
                            </div>
                        </div>`;
                    }

                    // Case 2: I am the Receiver (Sender is the contact)
                    if (newMessage.seen == false && newMessage.senderId != loginUserId) {
                        isThisnewMessage = `
                        <div id="convoContent" data-id="${element.senderId}" style="${activeBg}">
                            <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                            <div>
                                <label data-id="${element.senderId}" style="font-weight:600;">${element.senderUsername}</label>
                                ${senderIdIsMe}
                            </div>
                        </div>`;
                    } else {
                        isThisnewMessage = `
                        <div id="convoContent" data-id="${element.senderId}" style="${normalBg}">
                            <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                            <div>
                                <label data-id="${element.senderId}">${element.senderUsername}</label>
                                ${senderIdIsMe}
                            </div>
                        </div>`;
                    }

                } else {
                    // --- No New Messages (Fallback) ---
                    senderIdIsMe = `<label id="latestMessageInHistory"><span>Start chatting</span></label>`;
                    const normalBg = "background-color: #ffffff;";

                    isThisnewMessageEqualtoLoginId = `
                    <div id="convoContent" data-id="${element.recieverId}" style="${normalBg}">
                        <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                        <div>
                            <label data-id="${element.recieverId}">${element.recieverUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>`;

                    isThisnewMessage = `
                    <div id="convoContent" data-id="${element.senderId}" style="${normalBg}">
                        <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                        <div>
                            <label data-id="${element.senderId}">${element.senderUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>`;
                }

                const isMeSender = element.senderId == loginUserId ? isThisnewMessageEqualtoLoginId : isThisnewMessage;

                document.getElementById('listOfconvoBody').innerHTML += isMeSender;
            }
        })
    } else {
        console.log('error sa frontend message button');
        document.getElementById('loadingCircle').style.display = 'none';
    }
}