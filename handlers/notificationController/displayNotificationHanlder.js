import { apiReq } from "../../utils/fetchReq.js";



export async function displayNotifications() {
    try {
        document.getElementById('notificationContentBody').innerHTML = ''
        const displayNotif = await apiReq('/displayAllNotifications')
        if (displayNotif.ok) {
            console.log(displayNotif)
            displayNotif.data.forEach(element => {

                const isRead = element.status == false ? (`
                <div style="background-color: #b6b6b6;" id="notifContentDetails" data-id ="${element.id}">
                    <img id="notifImage" src="${element.senderImage}" alt="">
                    <div id="notifDetails">
                        <label id="notificationUsernameLabel">${element.senderUsername}</label>
                        <label id="notificationContentLabel">${element.notifMessage}</label>
                    </div>
                    <button id="markReadThisNotif" data-id="${element.id}">Mark Read</button>
                    <button id="notificationMenu" data-id = "${element.id}"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
                    
                    
                    
                    `)
                    : (`
                    
                <div style="background-color: #eaeaea;" id="notifContentDetails" data-id ="${element.id}">
                    <img id="notifImage" src="${element.senderImage}" alt="">
                    <div id="notifDetails">
                        <label id="notificationUsernameLabel">${element.senderUsername}</label>
                        <label id="notificationContentLabel">${element.notifMessage}</label>
                    </div>
                    <button disabled id="markReadThisNotif">Mark Read</button>
                    <button id="notificationMenu" data-id = "${element.id}"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
                    
                    
                    `)
                document.getElementById('notificationContentBody').innerHTML += `
                        ${isRead}
                `
            });
        } else {
            console.log('error getting notifications')
        }
    } catch (err) {
        console.log('error notification request')
    }
}


