import { apiReq } from "../../utils/fetchReq.js";

export default async function checkIfHasNewMessage() {
    try {
        const checkNewMessage = await apiReq('/checkIfHasNewMessage')
        if (checkNewMessage.ok) {
            document.getElementById('SnewMessageIndicator').style.display = 'block'
            document.getElementById('newMessageIndicator').style.display = 'block'
        } else {
            document.getElementById('SnewMessageIndicator').style.display = 'none'
            document.getElementById('newMessageIndicator').style.display = 'none'
        }
    } catch (err) {
        console.log('error checking if there are new message to display message indicator')
    }
}