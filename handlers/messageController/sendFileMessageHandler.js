
import { scrollToBottom } from "../../app.js";
import { chatBox } from "../../app.js";


export default async function sendFileAsMessage(selectedFileMessage, loginUsername, loginUserId, recieverId, loginProfileimage,socket) {
    try {
        document.getElementById('loadingCircle').style.display = 'flex'
        const formData = new FormData();
        console.log(selectedFileMessage)
        formData.append('image', selectedFileMessage)
        formData.append('username', loginUsername)
        formData.append('senderId', loginUserId)
        formData.append('recieverId', recieverId)
        formData.append('userImage', loginProfileimage)
        // display your message for you in realtime
        const sendImageUrl = URL.createObjectURL(selectedFileMessage)
        if (selectedFileMessage.type != 'video/mp4') {
            document.getElementById('conversations').innerHTML += `
             <div id="informationAndMessagesRight" data-id="${loginUserId}">
                <div id="textMessagesRightImg">
                    <img id="sendfileMessage" src="${sendImageUrl}" alt="">
                    <label id="seenLabel"></label>
                </div>
                <img id="senderUserImageRight" src="${loginProfileimage}" alt="">

            </div>
            `
        } else {
            document.getElementById('conversations').innerHTML += `
            <div id="informationAndMessagesRight" data-id="${sendImageUrl}">
                        <div id="textMessagesRightImg">
                            <video controls preload="metadata" loading="lazy" id="sendfileMessage" src="${sendImageUrl}"></video>
                            <label id="seenLabel"></label>
                        </div>
                        <img id="senderUserImageRight" src="${loginProfileimage}" alt="">

            </div>
            
            `
        }


        scrollToBottom(chatBox)
        const fakeElement = document.querySelector(`#convoContent[data-id="${recieverId}"]`)
        if (fakeElement) {
            const labelElementOnHistoryMessage = fakeElement.querySelector('#latestMessageInHistory')
            labelElementOnHistoryMessage.innerHTML = `<span>You Sent File Message</span>`
        }



        const sendThisFileMessage = await fetch('https://instagramclone-developmentphasev2.onrender.com/sendThisFileMessage', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        const data = await sendThisFileMessage.json()
        if (sendThisFileMessage.ok) {
            const message = data.message;
            console.log('success sending this message')
            document.getElementById('fileImageWantToSendPreview').style.display = 'none'
            inputFileMessage.value = ''
            socket.emit('displayNewMessage', { recieverId, loginUserId, loginProfileimage, message, loginUsername })
            document.getElementById('loadingCircle').style.display = 'none'
        } else {
            console.log('error sending this message')
            document.getElementById('loadingCircle').style.display = 'none'
        }
    }
    catch (err) {
        console.log('error in request sending message!')
        document.getElementById('loadingCircle').style.display = 'none'
    }
}
