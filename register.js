import { apiReq } from './fetchReq.js';


const email = document.getElementById('email')
const password = document.getElementById('password')
const confirmpassword = document.getElementById('confirmpassword')
const userName = document.getElementById('username')
const address = document.getElementById('address')
const age = document.getElementById('age')
let registeredEmail;


function checkAllField() {
    if (email.value != '' && password.value != '' && confirmpassword.value != '') {
        document.getElementById('submitBtn').disabled = false
    } else {
        document.getElementById('submitBtn').disabled = true
    }
}

email.addEventListener('input', checkAllField)
password.addEventListener('input', checkAllField)
confirmpassword.addEventListener('input', checkAllField)




const errorNotif = document.getElementById('errorNotif')
const errormessage = document.getElementById('errormessage')
const successNotif = document.getElementById('successNotif')
const successmessage = document.getElementById('successmessage')
let extractedUsername;
let timeoutInterval;
document.getElementById('submitBtn').addEventListener('click', async (e) => {
    e.preventDefault()
    try {
        if (password.value != confirmpassword.value) {
            errorNotif.style.display = 'flex'
            errormessage.textContent = 'Password not match'
            password.style.boxShadow = '0px 0px 4px #E63946'
            confirmpassword.style.boxShadow = '0px 0px 4px #E63946'

            timeoutInterval = setTimeout(() => {
                errorNotif.style.display = 'none'
                password.style.boxShadow = "none"
                confirmpassword.style.boxShadow = "none"
            }, 4000);
        } else {
            const username = email.value.split('@')[0];
            extractedUsername = email.value.split('@')[0];
            console.log(username)
            const register = await apiReq('/register', {
                email: email.value, password: password.value,
                username: username
            })
            if (register.ok) {
                successNotif.style.display = 'flex'
                document.getElementById('loading').style.display = 'flex'
                successmessage.textContent = register.data.message
                timeoutInterval = setTimeout(() => {
                    successNotif.style.display = 'none'
                    document.getElementById('loading').style.display = 'none'
                    document.getElementById('setupPersoInfo').style.display = 'flex'
                    userName.value = username
                    registeredEmail = email.value
                }, 3000);
            } else {
                errorNotif.style.display = 'flex'
                errormessage.textContent = register.data.message
                email.style.boxShadow = '0px 0px 4px #E63946'
                timeoutInterval = setTimeout(() => {
                    errorNotif.style.display = 'none'
                    email.style.boxShadow = "none"
                }, 3000);
            }
        }
    } catch (err) {
        errorNotif.style.display = 'flex'
        errormessage.textContent = "Something went Wrong"
        timeoutInterval = setTimeout(() => {
            errorNotif.style.display = 'none'
        }, 3000);
    }
})


document.getElementById('closeNotifError').addEventListener('click', () => {
    errorNotif.style.display = 'none'
    password.style.boxShadow = "none"
    confirmpassword.style.boxShadow = "none"
    clearTimeout(timeoutInterval)
})




function checkAllFieldPerso() {
    if (userName.value != '' && address.value != '' && age.value != '') {
        document.getElementById('submitBtnInfo').disabled = false
    } else {
        document.getElementById('submitBtnInfo').disabled = true
    }
}

userName.addEventListener('input', checkAllFieldPerso)
address.addEventListener('input', checkAllFieldPerso)
age.addEventListener('input', checkAllFieldPerso)



document.getElementById('submitBtnInfo').addEventListener('click', async (e) => {
    e.preventDefault()
    try {
        const submitPersonalInfo = await apiReq('/submitPersonalInfo', {
            username: userName.value,
            address: address.value,
            age: age.value,
            email: registeredEmail
        })
        if (submitPersonalInfo.ok) {
            successNotif.style.display = 'flex'
            document.getElementById('loading').style.display = 'flex'
            successmessage.textContent = submitPersonalInfo.data.message
            timeoutInterval = setTimeout(() => {
                window.location.replace('index.html')
            }, 2000);
        } else {

        }
    } catch (err) {
        errorNotif.style.display = 'flex'
        errormessage.textContent = "Something went Wrong"
        timeoutInterval = setTimeout(() => {
            errorNotif.style.display = 'none'
        }, 4000);
    }
})


