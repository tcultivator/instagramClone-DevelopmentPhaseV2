import { apiReq } from "../../utils/fetchReq.js";
import { openMessageWindow } from './index.js'

export default async function acceptMessageRequest(messageReqId, loginUserId) {
    try {
        const acceptMessageReq = await apiReq('/acceptMessageRequest', {
            messageReqId: messageReqId.dataset.id
        })
        if (acceptMessageReq.ok) {
            console.log('success accepting message request')
            openMessageWindow(loginUserId)
            const messageReqElement = messageReqId.closest(`#messageRequestDetails`)
            console.log('this is the message req element', messageReqElement)
            messageReqElement.style = 'display:none'
            const messageReqCount = Number(document.getElementById('newMessReqIndicator').textContent)
            document.getElementById('newMessReqIndicator').textContent = messageReqCount - 1
        } else {
            console.log('error accepting message request')
        }
    }
    catch (err) {
        console.log('request error on accepting message request')
    }
}