import { apiReq } from "../../utils/fetchReq.js";
import { sendNotif } from "../notificationController/sendNotifcationHandler.js";
export default async function likeThisPost(targetElement, loginUserId, socket, loginUsername, loginProfileimage) {
    const likeIcon = targetElement.closest('#postcontent').querySelector('#likethisPost')
    if (likeIcon.style.color == 'red') {
        console.log('na like mo nato')
        const likeCountLabel = targetElement.closest('#postcontent').querySelector('#likeCount')
        let likeCount = Number(likeCountLabel.dataset.likecount)
        likeCount -= 1
        likeCountLabel.dataset.likecount = likeCount
        likeCountLabel.innerHTML = `${likeCount} <span>Likes</span>`

        likeIcon.style = 'color:rgb(36, 36, 36)'
        likeIcon.classList = 'fa-regular fa-heart'
        const postId = targetElement.dataset.id

        console.log(loginUserId)
        console.log(postId)
        const unlikeThisPost = await apiReq('/unlikeThisPost', { postId: postId, userId: loginUserId })
        if (unlikeThisPost.ok) {
            console.log('you like this post that id is ', postId)
            console.log(likeIcon.style.color)
            socket.emit('userunLikeThisPost', { postId, likeCount })


        } else {

            console.log('error sa like')
        }
    } else {
        const likeCountLabel = targetElement.closest('#postcontent').querySelector('#likeCount')
        let likeCount = Number(likeCountLabel.dataset.likecount)
        likeCount += 1
        likeCountLabel.dataset.likecount = likeCount
        likeCountLabel.innerHTML = `${likeCount} <span>Likes</span>`

        likeIcon.style = 'color:red'
        likeIcon.classList = 'fa-solid fa-heart'
        const postId = targetElement.dataset.id
        const userPostId = document.querySelector(`#postcontent[data-id="${postId}"]`).querySelector('#userThatPost')
        console.log('eto ung useId ng nag post ', userPostId.dataset.userid)
        const likeThisPost = await apiReq('/likeThisPost', { postId: postId, userId: loginUserId })
        if (likeThisPost.ok) {
            console.log('you like this post that id is ', postId)
            console.log(likeIcon.style.color)
            console.log(likeCountLabel)
            console.log(likeThisPost)
            socket.emit('userLikeThisPost', { postId, likeCount })
            sendNotif(userPostId.dataset.userid, loginUserId, loginUsername, loginProfileimage, likeThisPost.data.message)
        } else {

            console.log('error sa like')
        }
    }
}
