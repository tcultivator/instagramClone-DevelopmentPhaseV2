import { apiReq } from '../utils/fetchReq.js';

export default async function displayNewMessageAtHistory(senderId, recieverId) {
    const getNewMessageToDisplayAtHistory = await apiReq('/getNewMessageToDisplayAtHistory', {
        senderId: senderId,
        recieverId: recieverId
    })
    if (getNewMessageToDisplayAtHistory.ok) {
        return getNewMessageToDisplayAtHistory.data
    } else {
        return null
    }
}