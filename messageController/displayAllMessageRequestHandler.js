import { apiReq } from "../../utils/fetchReq.js";

export default async function displayMessageRequest(loginUserId) {
    try {
        document.getElementById('messageRequestContents').innerHTML = ''
        const displayAllMessageRequest = await apiReq('/displayAllMessageRequest')
        if (displayAllMessageRequest.ok) {
            console.log(displayAllMessageRequest.data)
            displayAllMessageRequest.data.forEach(element => {
                if (element.senderId != loginUserId) {
                    document.getElementById('messageRequestContents').innerHTML += `
            <div id="messageRequestDetails" data-id="${element.senderId}">
                <div id="messageRequestUserInfo" data-id="${element.senderId}">
                    <img id="messageRequestProfileImage" src="${element.senderImage}" alt="">
                    <label id="messageRequestUsername">${element.senderUsername}</label>
                </div>
                <button id="messageRequestAcceptBtn" data-id="${element.id}">Accept</button>

            </div>
                `
                }

            });

        } else {
            console.log('error ka gago sa displayAllMessageRequest')
        }
    } catch (err) {
        console.log('request error on displayAllMessageRequest')

    }
}