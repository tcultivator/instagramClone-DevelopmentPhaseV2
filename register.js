import { apiReq } from './utils/fetchReq.js';


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




let postRegisterEmail;
let verificationCode;
let postRegisterPassword;
let postRegisterUsername;
document.getElementById('submitBtn').addEventListener('click', async (e) => {
    e.preventDefault()
    try {
         console.log(username)
            console.log(email.value)
            console.log(password.value)
            console.log(confirmpassword.value)
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
            console.log('gumana 1')
            document.getElementById('serverLoadingBody').style.display = 'flex'
            console.log('gumana 2')
            const username = email.value.split('@')[0];
            console.log('gumana 3')
            extractedUsername = email.value.split('@')[0];
            console.log('gumana 4')
            console.log(username)
            console.log(username)
            console.log(email.value)
            console.log(password.value)
            console.log(confirmpassword.value)
            const register = await apiReq('/register', {
                email: email.value, password: password.value,
                username: username
            })
            if (register.ok) {
                successNotif.style.display = 'flex'
                document.getElementById('loading').style.display = 'flex'
                document.getElementById('serverLoadingBody').style.display = 'none'
                successmessage.textContent = register.data.message
                timeoutInterval = setTimeout(() => {
                    successNotif.style.display = 'none'
                    document.getElementById('loading').style.display = 'none'
                    document.getElementById('verifBody').style.display = 'flex'
                    console.log(register.data)
                    userName.value = username
                    registeredEmail = email.value

                    postRegisterEmail = register.data.email
                    postRegisterPassword = register.data.password
                    postRegisterUsername = register.data.username
                    verificationCode = register.data.digitcode6



                }, 3000);
            } else {
                errorNotif.style.display = 'flex'
                document.getElementById('serverLoadingBody').style.display = 'none'
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







const input1 = document.getElementById('verif1')
document.getElementById('verif1').addEventListener('input', () => {
    if (input1.value.length > 1) {
        input1.value = input1.value.slice(0, 1)
    }
    input2.focus();
})

const input2 = document.getElementById('verif2')
document.getElementById('verif2').addEventListener('input', () => {
    if (input2.value.length > 1) {
        input2.value = input2.value.slice(0, 1)
    }
    input3.focus();
})

const input3 = document.getElementById('verif3')
document.getElementById('verif3').addEventListener('input', () => {
    if (input3.value.length > 1) {
        input3.value = input3.value.slice(0, 1)
    }
    input4.focus();
})

const input4 = document.getElementById('verif4')
document.getElementById('verif4').addEventListener('input', () => {
    if (input4.value.length > 1) {
        input4.value = input4.value.slice(0, 1)
    }
    input5.focus();
})

const input5 = document.getElementById('verif5')
document.getElementById('verif5').addEventListener('input', () => {
    if (input5.value.length > 1) {
        input5.value = input5.value.slice(0, 1)
    }
    input6.focus();
})
const input6 = document.getElementById('verif6')
document.getElementById('verif6').addEventListener('input', () => {
    if (input6.value.length > 1) {
        input6.value = input6.value.slice(0, 1)
    }
})

document.getElementById('verifBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const userInputVerification = input1.value + input2.value + input3.value + input4.value + input5.value + input6.value
    console.log(userInputVerification)
    if (userInputVerification == verificationCode) {
        console.log('match ung code')
        const submitRegister = await apiReq('/submitRegister', {
            postRegisterEmail: postRegisterEmail,
            postRegisterPassword: postRegisterPassword,
            postRegisterUsername: postRegisterUsername
        })
        if (submitRegister.ok) {
            document.getElementById('setupPersoInfo').style.display = 'flex'
        } else {

        }
    } else {
        console.log('hindi match ung code')
        errorNotif.style.display = 'flex'
        errormessage.textContent = 'Verification Code not Match'
        timeoutInterval = setTimeout(() => {
            errorNotif.style.display = 'none'
        }, 4000);
    }
})


