import { apiReq } from '../fetchReq.js';


export async function followersHandler(loginUserId, elementUserId) {

    document.getElementById('showFollowersContent').innerHTML = ''
    document.getElementById('showFollowersBody').style.display = 'block'
    document.getElementById('showFollowersBodyLabel').textContent = 'Followers'
    if (loginUserId == elementUserId) {
        const displayFollowers = await apiReq('/displayFollowers', { userId: loginUserId })
        if (displayFollowers.ok) {
            console.log('merong nakuha follower')
            console.log(displayFollowers.data)
            displayFollowers.data.forEach(element => {
                document.getElementById('showFollowersContent').innerHTML += `
            
            <div id="followersContent" data-userid="${element.id}">
                <div>
                    <img id="followersUserProfile" src="${element.profileImage}" alt="">
                    <label id="followersInfo" data-userid="${element.id}">${element.username}</label>
                </div>
               
            </div>
            `
            })
        } else {
            console.log('error ka')
        }
    } else {
        console.log('na clik ung show followers')
        const displayFollowers = await apiReq('/displayFollowers', { userId: elementUserId })
        if (displayFollowers.ok) {
            console.log('merong nakuha follower')
            console.log(displayFollowers.data)
            displayFollowers.data.forEach(element => {
                document.getElementById('showFollowersContent').innerHTML += `

            <div id="followersContent" data-userid="${element.id}">
                <div>
                    <img data-userid="${element.id}" src="${element.profileImage}" alt="">
                    <label id="followersInfo" data-userid="${element.id}">${element.username}</label>
                </div>

            </div>
            `
            })
        } else {
            console.log('error ka')
        }
    }
}