import { apiReq } from "../../utils/fetchReq.js";

export async function deleteNotif(notifId) {
    try {
        const deleteNotif = await apiReq('/deleteNotif', {
            notifId: notifId
        })
        if (deleteNotif.ok) {
            console.log('success ung delete ng notif')
            const element = document.querySelector(`#notifContentDetails[data-id="${notifId}"]`)
            console.log('eto ung element na dapat ma delete! ', element)
            element.remove();
        } else {
            console.log('hindi na delete ung notif')
        }
    } catch (err) {
        console.log('error sa request ung sending req')
    }
}