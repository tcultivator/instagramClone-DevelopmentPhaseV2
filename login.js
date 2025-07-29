import { apiReq } from './utils/fetchReq.js';

const username = document.getElementById('username')
const password = document.getElementById('password')

function checkifbtnenabled() {
    if (username.value != '' && password.value != '') {
        document.getElementById('submitBtn').disabled = false
        console.log('ewan')
    } else {
        document.getElementById('submitBtn').disabled = true
        console.log('ewan')
    }
}
username.addEventListener('input', checkifbtnenabled)
password.addEventListener('input', checkifbtnenabled)


const errorNotif = document.getElementById('errorNotif')
const errormessage = document.getElementById('errormessage')
const successNotif = document.getElementById('successNotif')
const successmessage = document.getElementById('successmessage')
document.getElementById('loginForm').addEventListener('submit', async (e) => {

    e.preventDefault()
    document.getElementById('serverLoadingBody').style.display = 'flex'
    console.log(username.value)
    const loginReq = await apiReq('/loginReq', { username: username.value, password: password.value })
    if (loginReq.ok) {
        console.log(loginReq.data.message)
        successNotif.style.display = 'flex'
        successmessage.textContent = loginReq.data.message
        document.getElementById('loadingBody').style = 'display:flex'
        document.getElementById('serverLoadingBody').style.display = 'none'
        setTimeout(() => {
            window.location.replace('app.html')
        }, 1500);
    } else {
        console.log(loginReq.data.message)
        errorNotif.style.display = 'flex'
        document.getElementById('serverLoadingBody').style.display = 'none'
        errormessage.textContent = loginReq.data.message
        timeoutInterval = setTimeout(() => {
            errorNotif.style.display = 'none'
        }, 3000);

    }
})



const forgotpassword = document.getElementById('forgotpasswordEnterEmail')
forgotpassword.addEventListener('click', (e) => {
    e.preventDefault()
    document.getElementById('enterEmailforPassword').style.display = 'flex'
})

document.getElementById('closeForgotpassword').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('enterEmailforPassword').style.display = 'none'
})


const inputEmailForgot = document.getElementById('inputEmailForgot')

document.getElementById('submitBtnForgot').addEventListener('click', async (e) => {
    e.preventDefault();
    const sendForgotpassword = await apiReq('/sendForgotpassword', {
        email: inputEmailForgot.value
    })
    if (sendForgotpassword.ok) {
        successNotif.style.display = 'flex'
        successmessage.textContent = sendForgotpassword.data.message
        setTimeout(() => {
            successNotif.style.display = 'none'
        }, 1500);
    } else {
        errorNotif.style.display = 'flex'
        errormessage.textContent = sendForgotpassword.data.message
        timeoutInterval = setTimeout(() => {
            errorNotif.style.display = 'none'
        }, 1500);
    }
})


document.getElementById('changePass').addEventListener('click', async (e) => {
    e.preventDefault()
    const changePassword = await apiReq('/sendchangePasswordReq', {
        email: inputEmailForgot.value,
        sendUrl: `https://tcultivator.github.io/instagramClone-DevelopmentPhaseV2/changePassword.html?email=${inputEmailForgot.value}`
    })
    if (changePassword.ok) {
        successNotif.style.display = 'flex'
        successmessage.textContent = changePassword.data.message
        setTimeout(() => {
            successNotif.style.display = 'none'
        }, 1500);
    } else {
        errorNotif.style.display = 'flex'
        errormessage.textContent = changePassword.data.message
        timeoutInterval = setTimeout(() => {
            errorNotif.style.display = 'none'
        }, 1500);
    }
})

































//darkmode
// let toggle = false
// document.getElementById('btnToggle').addEventListener('click', () => {
//     toggle = !toggle
//     toggle ? (document.getElementById('btnToggle').innerHTML = `<i class="fa-solid fa-moon"></i>`,
//         document.documentElement.style.setProperty('--bg-color', 'black'),
//         document.documentElement.style.setProperty('--primary-text-color', 'white'),
//         document.documentElement.style.setProperty('--btntoggle-color', 'white')

//     ) :
//         (document.getElementById('btnToggle').innerHTML = `<i class="fa-solid fa-sun"></i>`,
//             document.documentElement.style.setProperty('--bg-color', 'white'),
//             document.documentElement.style.setProperty('--primary-text-color', 'rgb(70, 70, 70)'),
//             document.documentElement.style.setProperty('--btntoggle-color', 'rgb(218, 173, 29)'))
// })
