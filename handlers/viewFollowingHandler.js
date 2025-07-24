import { apiReq } from '../fetchReq.js';


export async function followingHandler(loginUserId, elementUserId) {

    document.getElementById('showFollowersContent').innerHTML = ''
    document.getElementById('showFollowersBody').style.display = 'block'
    if (loginUserId == elementUserId) {
        document.getElementById('showFollowersBodyLabel').textContent = 'Following'
        console.log('na clik ung show followers')
        const displayFollowers = await apiReq('/displayFollowing', { userId: loginUserId })
        if (displayFollowers.ok) {
            console.log('merong nakuha follower')
            console.log(displayFollowers.data)
            displayFollowers.data.forEach(element => {
                document.getElementById('showFollowersContent').innerHTML += `
                
                <div id="followersContent" data-userid="${element.id}">
                    <div>
                        <img id="followersUserProfile" src="${element.profileImage}" alt="" data-userid="${element.id}">
                        <label id="followersInfo" data-userid="${element.id}">${element.username}</label>
                    </div>
                   <button id="unfollowBtn" data-userid="${element.id}">unfollow</button>
                </div>
                `
            })
        } else {
            console.log('error ka')
        }
    } else {
        document.getElementById('showFollowersContent').innerHTML = ''
        document.getElementById('showFollowersBody').style.display = 'block'
        document.getElementById('showFollowersBodyLabel').textContent = 'Following'
        console.log('na clik ung show followers')
        const displayFollowers = await apiReq('/displayFollowing', { userId: elementUserId })
        if (displayFollowers.ok) {
            console.log('merong nakuha follower')
            console.log(displayFollowers.data)
            displayFollowers.data.forEach(element => {
                document.getElementById('showFollowersContent').innerHTML += `

            <div id="followersContent" data-userid="${element.id}">
                <div>
                    <img src="${element.profileImage}" alt="" data-userid="${element.id}">
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