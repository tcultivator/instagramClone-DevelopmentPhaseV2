import { apiReq } from '../utils/fetchReq.js';


export async function followBtnFunction(selectedHtmlElement) {
    if (selectedHtmlElement.textContent == 'unfollow') {
        console.log('na click ung unfollow')
        const followUserId = selectedHtmlElement.dataset.userid
        console.log('eto ung laman ng button ', selectedHtmlElement.textContent)
        console.log('eto ung userid ng gusto mo i unfollow ', followUserId)
        const follow = await apiReq('/unfollow', { followUserId: followUserId })
        if (follow.ok) {

            // this is the ui in user post
            const allPost = document.querySelectorAll(`#followBTN`)
            console.log(allPost)
            allPost.forEach(element => {
                if (element.dataset.userid == followUserId) {
                    element.innerHTML = 'follow'
                }
            })
            const followingCount = Number(document.getElementById('followingCount').textContent)
            document.getElementById('followingCount').textContent = followingCount - 1

            //this is the ui in following list
            const elementOfWanttoUnfollow = document.querySelector(`#followersContent[data-userid = "${selectedHtmlElement.dataset.userid}"]`)
            if (elementOfWanttoUnfollow) {
                elementOfWanttoUnfollow.style.display = 'none'
            }

            // this is the ui in search
            if (selectedHtmlElement.id == 'followBtnInSearch') {
                selectedHtmlElement.innerHTML = 'follow'
            }

            // this is the ui in visitprofile
            document.getElementById('visitprofileFollow').textContent = 'follow'

        } else {
            console.log('error sa unfoloow')
        }

    } else {
        console.log('na click ung follow')
        const followUserId = selectedHtmlElement.dataset.userid
        console.log('eto ung laman ng button ', selectedHtmlElement.textContent)
        console.log('eto ung userid ng gusto mo i follow ', followUserId)
        const follow = await apiReq('/follow', { followUserId: followUserId })
        if (follow.ok) {

            // this is the ui in user post
            const allPost = document.querySelectorAll(`#followBTN`)
            console.log(allPost)
            allPost.forEach(element => {
                if (element.dataset.userid == followUserId) {
                    element.innerHTML = 'unfollow'
                }

            })
            const followingCount = Number(document.getElementById('followingCount').textContent)
            document.getElementById('followingCount').textContent = followingCount + 1

            // this is the ui in visitprofile
            document.getElementById('visitprofileFollow').textContent = 'unfollow'


            // this is the ui in search
            if (selectedHtmlElement.id == 'followBtnInSearch') {
                selectedHtmlElement.innerHTML = 'unfollow'
            }

        } else {
            console.log('error sa foloow')
        }
    }
}