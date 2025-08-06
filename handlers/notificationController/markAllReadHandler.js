import { apiReq } from "../../utils/fetchReq.js";
import { getUnreadNotif } from './getUnreadNotifCount.js'
export async function markAllRead() {
    try {
        document.getElementById('clickSound').play();
        const allNotifElement = document.querySelectorAll('#notifContentDetails')
        allNotifElement.forEach(element => {
            element.style = 'background-color: #eaeaea;'
        })
        const allNotifButtonElement = document.querySelectorAll('#markReadThisNotif')
        allNotifButtonElement.forEach(element => {
            element.disabled = true
        })


        const markAllRead = await apiReq('/markAllRead')
        if (markAllRead.ok) {
            getUnreadNotif();
        } else {
            console.log('error on marking all read')
        }
    } catch (err) {
        console.log('request error on mark all read')
    }
}