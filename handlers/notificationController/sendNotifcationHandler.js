import { apiReq } from "../../utils/fetchReq.js";


export async function sendNotif(recieverId, senderId, senderUsername, senderImage, notifMessage) {
    try {
        const sendNotifications = await apiReq('/sendNotif', {
            recieverId: recieverId,
            senderId: senderId,
            senderUsername: senderUsername,
            senderImage: senderImage,
            notifMessage: notifMessage
        })
        if (sendNotifications.ok) {
            console.log('success sending notifcation')
        } else {
            console.log('error sa sending notifcation')
        }


    } catch (err) {
        console.log('error attempting send notif request')
    }
}