import { apiReq } from './fetchReq.js';

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



document.getElementById('loginForm').addEventListener('submit', async (e) => {

    e.preventDefault()
    console.log(username.value)
    const loginReq = await apiReq('/loginReq', { username: username.value, password: password.value })
    if (loginReq.ok) {
        console.log(loginReq.data.message)

        document.getElementById('loadingBody').style = 'display:flex'
        setTimeout(() => {
            window.location.replace('app.html')
        }, 1500);
    } else {
        console.log(loginReq.data.message)

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
