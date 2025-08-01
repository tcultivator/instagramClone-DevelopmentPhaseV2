import { apiReq } from "../../utils/fetchReq.js";

export async function getUnreadNotif() {
    try {
        const getAllUnreadNotif = await apiReq('/getAllUnreadNotif')
        if (getAllUnreadNotif.ok) {
            console.log('eto ung count ', getAllUnreadNotif.data.unreadNotifCount)
            document.getElementById('unreadNotifCount').textContent = getAllUnreadNotif.data.unreadNotifCount;
            document.getElementById('unreadNotifSCount').textContent = getAllUnreadNotif.data.unreadNotifCount;
        } else {
            console.log('error counting unread notificaiton')
        }
    } catch (err) {
        console.log('error sending request in counting unread notification')
    }
}