import { apiReq } from './utils/fetchReq.js';

const getUrl = new URLSearchParams(window.location.search)
const actualUrl = getUrl.get('email')
console.log('eto ung email mo', actualUrl)

const newPass = document.getElementById('newPass')
const errorNotif = document.getElementById('errorNotif')
const errormessage = document.getElementById('errormessage')
const successNotif = document.getElementById('successNotif')
const successmessage = document.getElementById('successmessage')


document.getElementById('subBtn').addEventListener('click', async () => {
    const changePassword = await apiReq('/changePassword', {
        email: actualUrl,
        newPass: newPass.value
    })

    if (changePassword.ok) {
        successNotif.style.display = 'flex'
        successmessage.textContent = changePassword.data.message
        setTimeout(() => {
            successNotif.style.display = 'none'
            window.location.replace('index.html')
        }, 1500);
    } else {
        errorNotif.style.display = 'flex'
        errormessage.textContent = changePassword.data.message
        timeoutInterval = setTimeout(() => {
            errorNotif.style.display = 'none'
        }, 1500);
    }
})
