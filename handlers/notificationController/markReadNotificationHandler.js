import { apiReq } from "../../utils/fetchReq.js";
import { getUnreadNotif } from './getUnreadNotifCount.js'
export async function markReadThisNotif(notifId) {
    try {
        document.getElementById('clickSound').play();
        const elementThatMarkRead = document.querySelector(`#notifContentDetails[data-id="${notifId}"]`)
        const buttonMarkRead = document.querySelector(`#markReadThisNotif[data-id="${notifId}"]`)
        console.log('eto ung element na mark read, ', elementThatMarkRead)
        elementThatMarkRead.style = 'background-color: #eaeaea;'
        buttonMarkRead.disabled = true
        const markRead = await apiReq('/markReadThisNotif', {
            notifId: notifId
        })
        if (markRead.ok) {
            console.log('success markread')
            getUnreadNotif();
        } else {
            console.log('error mark read')
        }
    } catch (err) {
        console.log('error request in mark read')
    }
}

