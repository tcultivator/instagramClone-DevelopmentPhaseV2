import { apiReq } from '../../utils/fetchReq.js';
import { displayNewMessageAtHistory } from '../../helper/index.js'

export default async function openMessageWindow(loginUserId) {
    document.getElementById('loadingCircle').style.display = 'flex'
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

                    // this run if there are new message// also this will check if the message is already seen or not

                    // this part is if the sender is you. meaning if the sender id is equal to your user id, means your the sender of the message
                    //int this part , you will be wondering why i say your sender, then displaying is reciever?, because if your the sender, you want to display the one you messsage not your profile, 
                    //so that's why in this part it will display the reciever instead of sender because your the sender, and you dont want to send to message to your self
                    isThisnewMessageEqualtoLoginId = newMessage.seen == false && newMessage.senderId != loginUserId ? (`
                    <div id="convoContent" data-id="${element.recieverId}" style="background-color: rgba(128, 128, 128, 1);" >
                        <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                        <div>
                            <label data-id="${element.recieverId}">${element.recieverUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>

                    `) :
                        (`
                    <div id="convoContent" data-id="${element.recieverId}" style="background-color: #eaeaea;" >
                        <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                        <div>
                            <label data-id="${element.recieverId}">${element.recieverUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>

                    `)

                    // this is the part where the sender id is not match to your user id, it means your the reciever of the message
                    isThisnewMessage = newMessage.seen == false && newMessage.senderId != loginUserId ? (`
                    <div id="convoContent" data-id="${element.senderId}" style="background-color: rgba(128, 128, 128, 1);" >
                        <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                        <div>
                            <label data-id="${element.senderId}">${element.senderUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>

                    `) :
                        (`
                    <div id="convoContent" data-id="${element.senderId}" style="background-color: #eaeaea;" >
                        <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                        <div>
                            <label data-id="${element.senderId}">${element.senderUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>

                    `)

                } else {
                    senderIdIsMe = `<label id="latestMessageInHistory"><span>No messages</span></label>`


                    // this is the default if no new message
                    isThisnewMessageEqualtoLoginId = `
                    <div id="convoContent" data-id="${element.recieverId}" style="background-color: #eaeaea;" >
                        <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                        <div>
                            <label data-id="${element.recieverId}">${element.recieverUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>

                    `



                    isThisnewMessage = `
                    <div id="convoContent" data-id="${element.senderId}" style="background-color: #eaeaea;" >
                        <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                        <div>
                            <label data-id="${element.senderId}">${element.senderUsername}</label>
                            ${senderIdIsMe}
                        </div>
                    </div>

                    `
                }



                const isMeSender = element.senderId == loginUserId ? (`
            ${isThisnewMessageEqualtoLoginId}
                `) :
                    (`
            
                ${isThisnewMessage}
                
                `)




                document.getElementById('listOfconvoBody').innerHTML += `
            ${isMeSender}
            `
            }

        })
    } else {
        console.log('error sa frontend message button')
        document.getElementById('loadingCircle').style.display = 'none'
    }
}