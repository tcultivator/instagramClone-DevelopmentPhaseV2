import { apiReq } from "../../utils/fetchReq.js";

export async function markReadThisNotif(notifId) {
    try {
        const markRead = await apiReq('/markReadThisNotif', {
            notifId: notifId
        })
        if (markRead.ok) {
            console.log('success markread')
        } else {
            console.log('error mark read')
        }
    } catch (err) {
        console.log('error request in mark read')
    }
}