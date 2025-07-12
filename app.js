
import { apiReq } from './fetchReq.js';
document.getElementById('loadingBody').style = 'display:flex'
let userData;
let filename;
let loginUsername;
let loginUserId;
let loginProfileimage;


import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';

const socket = io('https://instagramclone-developmentphasev2.onrender.com');

socket.on('connect', () => {
    console.log('Socket connected from app.js!');
});



(async () => {

    const authenticate = await apiReq('/authenticate')
    if (authenticate.ok) {
        userData = authenticate.data.result
        loginProfileimage = userData.profileImage
        loginUsername = userData.username
        loginUserId = userData.id
        console.log('eto ung userid', loginUserId)
        document.getElementById('profileName').textContent = userData.username
        document.getElementById('changeProfile').src = userData.profileImage
        document.getElementById('imageOnaddStory').src = userData.profileImage
        document.getElementById('followersCount').textContent = userData.follower
        document.getElementById('followingCount').textContent = userData.following
        const getAlldataForWall = await fetch('http://localhost:8080/getAll', {
            method: 'POST'
        })
        const data = await getAlldataForWall.json()
        if (getAlldataForWall.ok) {
            let wallUpdate = data.dataa
            wallUpdate.forEach(async element => {
                const alreadyLikedData = await verifyIfAlreadyLike(element.id);
                const likeBtn = alreadyLikedData.alreadyLike == true ? (`
                    <button id="like" ><i id="likethisPost" style="color: red;" data-id="${element.id}" class="fa-solid fa-heart"></i></button>
                    `) :
                    (`
                     <button id="like" ><i id="likethisPost" data-id="${element.id}" class="fa-solid fa-heart"></i></button>
                    `)
                const isVideo = element.secure_url.match(/\.(mp4|webm|ogg)$/i);
                const mediaTag = isVideo
                    ? `<video autoplay muted width="100%" id="postVid" controls>
                <source id="vidSource" src="${element.secure_url}" type="video/mp4" >
                Your browser does not support the video tag.
                
           </video>
           
           `


                    : `<img src="${element.secure_url}" alt="User post">`;
                const alreadyFollowData = await verifyIfAlreadyfollow(element.userId);
                const followBtn = alreadyFollowData.alreadyFollow == true ? (
                    `<button id="followBTN" data-userid="${element.userId}">unfollow</button>`
                ) : (`<button id="followBTN" data-userid="${element.userId}">follow</button>`)

                const followVisible = element.userId == loginUserId ? (``)
                    : (`${followBtn}`)
                document.getElementById('userPost').innerHTML += `
                        <div id="postcontent" data-id="${element.id}">  
                            <div id="userProfilePost">
                            <div>

                                ${followVisible}
                            </div>
                            <button><i class="fa-solid fa-ellipsis"></i></button>

                        </div>
                        <div id="userPostContent">
                            ${mediaTag}
                        </div>
                        <div id="likecommentshare">
                            ${likeBtn}
                            <button id="comment"><i id="commentthispost" data-id="${element.id}" class="fa-solid fa-comment"></i></button>
                            <button id="share"><i class="fa-solid fa-paper-plane"></i></button>
                        </div>
                        <div id="valueoflikecommentshare">
                            <label id="likeCount" data-likecount="${element.likeCount}">${element.likeCount} <span>Likes</span></label>
                            <label id="commentCount" data-commentcount="${element.commentCount}">${element.commentCount} <span>Comments</span></label>
                        </div>
                         <div id="postlabel">

                            <label id="userThatPost" data-userid="${element.userId}">${element.username} <span>${element.caption}</span></label>
                        </div>

                    </div>
                `
            });
            document.getElementById('loadingBody').style = 'display:flex'
        } else {
            console.log('walang nakuha')
        }

    } else {
        console.log('hindi gumana')
        document.getElementById('loadingBody').style = 'display:flex'
        setTimeout(() => {
            window.location.replace('index.html')
        }, 1500);
    }
    document.getElementById('loadingBody').style = 'display:none'
})();


async function getAllStories() {
    try {
        document.getElementById('imageOnaddStory').src = loginProfileimage
        const getStories = await apiReq('/getStories')
        if (getStories.ok) {
            console.log(getStories.data)
            getStories.data.forEach(element => {
                const isVideo = element.secure_url.match(/\.(mp4|webm|ogg)$/i);
                const media = isVideo ? (`
                    <video id="storyView" src="${element.secure_url}"  data-id="${element.id}"></video>
                    `) :
                    (`<img id="storyView" src="${element.secure_url}" alt="Your Story" data-id="${element.id}">`)
                document.getElementById('stories').innerHTML += `
                 <div id="addStories" data-id="${element.id}">
                    <div id="storyBod" class="story-thumbnail">
                            ${media}
                        <div id="story-label" data-id="${element.id}">${element.username}</div>
                    </div>
                </div>
                `
            })
        } else {
            console.log('error')
        }
    }
    catch (err) {
        console.log('error 2')
    }
}

getAllStories();

document.addEventListener('click', (e) => {
    if (e.target.matches('#storyView')) {
        const idOfElemt = e.target.dataset.id;
        const elementOfStory = document.querySelector(`#addStories[data-id="${idOfElemt}"]`)
        console.log('eto ung id ng elemt ', idOfElemt)
        console.log('eto ung element mismo ', elementOfStory)
        const srcOfIMG = document.querySelector(`#storyView[data-id="${idOfElemt}"]`)
        console.log(srcOfIMG.src)
        const isVideo = srcOfIMG.src.match(/\.(mp4|webm|ogg)$/i);
        if (isVideo) {
            document.getElementById('previewOfStoryIMG').style.display = 'none'
            document.getElementById('previewOfStoryVID').style.display = 'block'
            document.getElementById('previewOfStoryVID').autoplay = true
            document.getElementById('previewOfStoryVID').src = srcOfIMG.src
            document.getElementById('viewStoryBody').style.display = 'flex'
            const usernameOfStory = document.querySelector(`#story-label[data-id="${idOfElemt}"]`)
            document.getElementById('usernameOfStoryview').textContent = usernameOfStory.textContent

        } else {
            document.getElementById('previewOfStoryIMG').style.display = 'block'
            document.getElementById('previewOfStoryVID').style.display = 'none'
            document.getElementById('previewOfStoryIMG').src = srcOfIMG.src
            document.getElementById('viewStoryBody').style.display = 'flex'
            const usernameOfStory = document.querySelector(`#story-label[data-id="${idOfElemt}"]`)
            document.getElementById('usernameOfStoryview').textContent = usernameOfStory.textContent
        }


    }

})

document.getElementById('closeViewStory').addEventListener('click', () => {
    document.getElementById('viewStoryBody').style.display = 'none'

})

// document.addEventListener('mouseover', (e) => {
//     if (e.target.matches('#postVid')) {
//         console.log('na hover mo to')
//         const vid = e.target.closest('#postcontent').querySelector('#postVid')
//         const vidd = e.target.closest('#postcontent').querySelector('#vidSource')
//         console.log(vidd)
//         vid.controls = true
//     }
// })

document.getElementById('footerNav').addEventListener('click', (e) => {
    try {
        const clickBtn = e.target.closest('button')
        const nav = clickBtn.id
        switch (nav) {
            case 'home':
                console.log('this is home')
                window.location.reload()
                break;
            case 'search':
                console.log('this is search')
                break;
            case 'create':
                console.log('this is create')
                document.getElementById('createPost').style.display = 'flex'
                document.getElementById('profileBody').style = 'display:none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('viewPostBody').style.display = 'none'
                break;
            case 'notif':
                console.log('this is notif')
                document.getElementById('viewPostBody').style.display = 'none'
                break;
            case 'profile':
                document.getElementById('imgGrid').innerHTML = ''
                console.log('this is profile')
                viewProfile()
                document.getElementById('profileBody').style = 'display:block'
                document.getElementById('createPost').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('viewPostBody').style.display = 'none'
                break;

            default:
                break;
        }
    } catch (err) {
        console.log('no element')
    }
})


document.getElementById('sidebar').addEventListener('click', (e) => {
    try {
        const clickBtn = e.target.closest('button')
        const nav = clickBtn.id
        switch (nav) {
            case 'homeS':
                console.log('this is home')
                window.location.reload()
                break;
            case 'searchS':
                console.log('this is search')
                document.getElementById('viewPostBody').style.display = 'none'
                break;
            case 'createS':
                console.log('this is create')
                document.getElementById('createPost').style.display = 'flex'
                document.getElementById('profileBody').style = 'display:none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('viewPostBody').style.display = 'none'
                break;
            case 'notifS':
                console.log('this is notif')
                document.getElementById('viewPostBody').style.display = 'none'
                break;
            case 'profileS':
                document.getElementById('imgGrid').innerHTML = ''
                console.log('this is profile')
                viewProfile()
                document.getElementById('profileBody').style = 'display:block'
                document.getElementById('createPost').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('viewPostBody').style.display = 'none'
                break;

            default:
                break;
        }
    } catch (err) {
        console.log('no element')
    }
})

document.getElementById('backBtnonProfile').addEventListener('click', (e) => {

    document.getElementById('profileBody').style = 'display: none;'
    console.log('asdasdasdasdasd')
    document.getElementById('imgGrid').innerHTML = ''

})





const fileUploaded = document.getElementById('fileUp')
const preview = document.getElementById('preview')

fileUploaded.addEventListener('change', () => {
    preview.innerHTML = '';
    const file = fileUploaded.files[0]
    console.log(file.type)
    if (file.type == 'video/mp4') {
        console.log('video to')
        const fileUrl = URL.createObjectURL(file)
        const vid = document.createElement('video')
        vid.src = fileUrl
        vid.autoplay = true
        vid.muted = true
        vid.loop = true
        vid.controls = true
        vid.style.maxHeight = "350px"
        vid.style.maxWidth = "90%"
        preview.append(vid)
    } else {
        const fileUrl = URL.createObjectURL(file)
        const img = document.createElement('img')
        img.src = fileUrl
        img.style.maxHeight = "350px"
        img.style.maxWidth = "90%"
        preview.append(img)
    }


})
const caption = document.getElementById('caption')
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    document.getElementById('loadingCircle').style.display = 'flex'
    const formData = new FormData()
    formData.append('image', fileUploaded.files[0])
    formData.append('username', loginUsername)
    formData.append('caption', caption.value)
    formData.append('userId', loginUserId)

    try {
        const upload = await fetch('https://instagramclone-developmentphasev2.onrender.com/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        const data = await upload.json()
        if (upload.ok) {
            window.location.reload()
            document.getElementById('loadingCircle').style.display = 'none'
        } else {
            alert(data.message)
        }
    } catch (err) {
        console.log('err')
    }

})


document.getElementById('closeCreatePost').addEventListener('click', () => {
    document.getElementById('createPost').style.display = 'none'
    document.getElementById('preview').innerHTML = ''
})

document.getElementById('editProfile').addEventListener('click', () => {
    console.log('naclick ung profile')
    document.getElementById('updateProfilePic').style.display = 'flex'

})

const profilePicUpload = document.getElementById('profilefile')
const previewProfile = document.getElementById('previewProfile')

profilePicUpload.addEventListener('change', () => {
    previewProfile.innerHTML = '';
    const file = profilePicUpload.files[0]
    const fileUrl = URL.createObjectURL(file)
    const img = document.createElement('img')
    img.src = fileUrl
    img.style.maxHeight = "90%"
    img.style.maxWidth = "90%"
    previewProfile.append(img)

})

document.getElementById('updateProfilePicForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('loadingCircle').style.display = 'flex'
    const formData = new FormData()
    formData.append('image', profilePicUpload.files[0])
    formData.append('userId', loginUserId)
    try {
        const uploadProfilePicture = await fetch('https://instagramclone-developmentphasev2.onrender.com/uploadProfilePic', {
            method: 'PUT',
            body: formData
        })
        const data = await uploadProfilePicture.json()
        if (uploadProfilePicture.ok) {
            console.log('success updating profile')
            window.location.reload()
        } else {
            console.log('error updating profile')
        }
    } catch (err) {
        console.log('request failed')
    }
})





document.getElementById('closeUpdateProfile').addEventListener('click', () => {
    document.getElementById('updateProfilePic').style.display = 'none'
})






let idOfVisitProfile;
document.addEventListener('click', async (e) => {
    if (e.target.matches('#userThatPost') || e.target.matches('#followersInfo')) {
        document.getElementById('showFollowersBody').style.display = 'none'
        document.getElementById('showFollowersContent').innerHTML = ''
        document.getElementById('imgGrid').innerHTML = ''
        document.getElementById('profileBody').style = 'display:none'
        document.getElementById('visitprofileBody').style = 'display:none'
        const userId = e.target.dataset.userid;
        idOfVisitProfile = e.target.dataset.userid;
        console.log(userId)
        if (loginUserId == userId) {
            document.getElementById('profileBody').style = 'display:block'
            viewProfile()
        } else {
            document.getElementById('visitprofileBody').style.display = 'block'
            const visitOtherProfile = await apiReq('/visitOtherProfile', { userId: userId })
            if (visitOtherProfile.ok) {
                console.log(visitOtherProfile.data.result)
                document.getElementById('visitprofileName').textContent = visitOtherProfile.data.result.username
                document.getElementById('visitchangeProfile').src = visitOtherProfile.data.result.profileImage
                document.getElementById('visitFollowerCount').textContent = visitOtherProfile.data.result.follower
                document.getElementById('visitfollowingCount').textContent = visitOtherProfile.data.result.following
                const viewProfileReq = await apiReq('/viewProfileReq', { userId: userId })
                if (viewProfileReq.ok) {
                    userData = viewProfileReq.data.result
                    console.log(userData)
                    userData.forEach(element => {
                        const isVideo = element.secure_url.match(/\.(mp4|webm|ogg)$/i);
                        const mediaTag = isVideo
                            ? `<video autoplay width="100%">
                <source id="imageOnPost" data-secure_url="${element.secure_url}" src="${element.secure_url}" type="video/mp4" >
                Your browser does not support the video tag.
           </video>`
                            : `<img id="imageOnPost" data-secure_url="${element.secure_url}" src=${element.secure_url} alt="">`;
                        document.getElementById('visitimgGrid').innerHTML += `
             <div>
                    ${mediaTag}
                </div>
            `
                    });
                }
                document.getElementById('visitPostCount').textContent = userData.length
            }
            else {
                console.log('may error sa pag visit')
            }
        }

    }
});

document.getElementById('visitbackBtnonProfile').addEventListener('click', () => {
    document.getElementById('visitprofileBody').style.display = 'none'
    document.getElementById('visitimgGrid').innerHTML = ''
})


async function viewProfile() {
    const viewProfileReq = await apiReq('/viewProfileReq', { userId: loginUserId })
    if (viewProfileReq.ok) {
        userData = viewProfileReq.data.result
        console.log('eto ung data sa profile')
        userData.forEach(element => {
            const isVideo = element.secure_url.match(/\.(mp4|webm|ogg)$/i);
            const mediaTag = isVideo
                ? `<video autoplay muted controls width="100%" id="imageOnPost" data-secure_url="${element.secure_url}">
                <source  src="${element.secure_url}" type="video/mp4" >
                Your browser does not support the video tag.
           </video>`
                : `<img id="imageOnPost" data-secure_url="${element.secure_url}" src=${element.secure_url} alt="">`;
            document.getElementById('imgGrid').innerHTML += `
             <div>
                    ${mediaTag}
                </div>
            `
        });

        document.getElementById('postsCount').textContent = userData.length

    }
}

document.addEventListener('click', (e) => {
    if (e.target.matches("#imageOnPost")) {
        console.log('naclikc')
        const urlofImg = e.target.dataset.secure_url
        const isVideo = urlofImg.match(/\.(mp4|webm|ogg)$/i);
        const mediaTag = isVideo
            ? `<video autoplay width="100%">
                <source src="${urlofImg}" type="video/mp4" >
                Your browser does not support the video tag.
           </video>`
            : `<img  src=${urlofImg} alt="">`;
        document.getElementById('previewOfPost').innerHTML = `
        ${mediaTag}
        `
        document.getElementById('previewofImageInPost').style.display = 'flex'

    }
})


document.getElementById('closepreviewofImageInPost').addEventListener('click', () => {
    document.getElementById('previewofImageInPost').style.display = 'none'
})


document.addEventListener('click', async (e) => {
    if (e.target.matches('#likethisPost')) {
        const likeIcon = e.target.closest('#postcontent').querySelector('#likethisPost')
        let likeTarget = e.target
        if (likeIcon.style.color == 'red') {
            console.log('na like mo nato')
            const likeCountLabel = e.target.closest('#postcontent').querySelector('#likeCount')
            let likeCount = Number(likeCountLabel.dataset.likecount)
            likeCount -= 1
            likeCountLabel.dataset.likecount = likeCount
            likeCountLabel.innerHTML = `${likeCount} <span>Likes</span>`

            likeIcon.style = 'color:rgb(112, 112, 112)'
            const postId = e.target.dataset.id
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
            const likeCountLabel = e.target.closest('#postcontent').querySelector('#likeCount')
            let likeCount = Number(likeCountLabel.dataset.likecount)
            likeCount += 1
            likeCountLabel.dataset.likecount = likeCount
            likeCountLabel.innerHTML = `${likeCount} <span>Likes</span>`

            likeIcon.style = 'color:red'
            const postId = e.target.dataset.id
            console.log(loginUserId)
            console.log(postId)
            const likeThisPost = await apiReq('/likeThisPost', { postId: postId, userId: loginUserId })
            if (likeThisPost.ok) {
                console.log('you like this post that id is ', postId)
                console.log(likeIcon.style.color)
                console.log(likeCountLabel)
                socket.emit('userLikeThisPost', { postId, likeCount })

            } else {

                console.log('error sa like')
            }
        }


    }
})

socket.on('userLikeFromIO', ({ postId, likeCount }) => {
    console.log({ postId, likeCount })
    const postElement = document.querySelector(`#postcontent[data-id="${postId}"]`)
    const likeLabel = postElement.querySelector('#likeCount');
    likeLabel.dataset.likecount = likeCount
    likeLabel.innerHTML = `${likeCount} <span>Likes</span>`
})
socket.on('userunLikeFromIO', ({ postId, likeCount }) => {
    console.log({ postId, likeCount })
    const postElement = document.querySelector(`#postcontent[data-id="${postId}"]`)
    const likeLabel = postElement.querySelector('#likeCount');
    likeLabel.dataset.likecount = likeCount
    likeLabel.innerHTML = `${likeCount} <span>Likes</span>`

})
let postIdOfyouwantToComment;
let commentTarget;
document.addEventListener('click', async (e) => {
    if (e.target.matches('#commentthispost')) {
        postIdOfyouwantToComment = e.target.dataset.id
        console.log(postIdOfyouwantToComment)
        commentTarget = e
        const likeCountLabel = e.target.closest('#postcontent').querySelector('#likeCount')
        const likeCount = Number(likeCountLabel.dataset.likecount)
        document.getElementById('likeCountsInComments').innerHTML = `${likeCount} <span>Likes</span>`
        document.getElementById('viewPostBody').style.display = 'block'
        document.getElementById('commentsBody').style.bottom = 0


        viewComments(postIdOfyouwantToComment)


    }
})

socket.on('idOfCommentFromIO', ({ postIdOfyouwantToComment, commentCount }) => {
    viewComments(postIdOfyouwantToComment)
    const postElement = document.querySelector(`#postcontent[data-id="${postIdOfyouwantToComment}"]`)
    const commentCountLabel = postElement.querySelector('#commentCount')
    commentCountLabel.dataset.commentcount = commentCount
    commentCountLabel.innerHTML = `${commentCount} <span>Comments</span>`
})

async function viewComments(postIdOfyouwantToComment) {
    document.getElementById('loadingBarInComment').style.display = 'block'
    document.getElementById('commentsContents').innerHTML = ''
    const viewCommentInPost = await apiReq('/viewCommentInPost', { postId: postIdOfyouwantToComment })
    if (viewCommentInPost.ok) {
        console.log('success sa pagkuha sa comment')
        console.log(viewCommentInPost.data.result)
        const userComments = viewCommentInPost.data.result
        userComments.forEach(element => {
            const labelComments = element.username == loginUsername ? (
                `
                    <div id="commentDetails" style="background-color:#ade8f4">
                        <label id="userThatComment">${element.username}</label>
                        <label for="">${element.comment}</label>
                    </div>
                `
            ) :
                (
                    `
                   
                    <div id="commentDetails">
                        <label id="userThatComment">${element.username}</label>
                        <label for="">${element.comment}</label>
                    </div>
                
                    `
                )
            document.getElementById('commentsContents').innerHTML += `
                <div id="commentsOnPost">
                <img src="${element.profileImage}" alt="">
                    ${labelComments}
                </div>
                `
        })
        document.getElementById('loadingBarInComment').style.display = 'none'
    } else {
        console.log('error sa pagkuha')
    }
}

document.getElementById('closeComment').addEventListener('click', () => {
    document.getElementById('viewPostBody').style.display = 'none'

})

async function verifyIfAlreadyLike(postId) {
    const verifyLike = await apiReq('/verifyIfAlreadyLike', { postId: postId, userId: loginUserId })
    if (verifyLike.ok) {
        return verifyLike.data

    } else {
        console.log('errrrrrr')
        return null
    }

}
const inputComment = document.getElementById('inputComment')
document.getElementById('submitComment').addEventListener('click', async () => {
    const commentCountLabel = commentTarget.target.closest('#postcontent').querySelector('#commentCount')
    let commentCount = Number(commentCountLabel.dataset.commentcount)
    console.log('eto ung count ng comment dito ', commentCount)
    commentCount += 1
    commentCountLabel.dataset.commentcount = commentCount
    commentCountLabel.innerHTML = `${commentCount} <span>Comments</span>`
    console.log('eto ung sa comment')
    console.log(inputComment.value)
    console.log(postIdOfyouwantToComment)
    console.log('may laman ba? ', userData)
    if (!inputComment.value) {
        console.log('please type something')
    } else {
        document.getElementById('loadingBarInComment').style.display = 'block'
        const submitComment = await apiReq('/addComment', { postId: postIdOfyouwantToComment, comment: inputComment.value, username: loginUsername, profileImage: loginProfileimage })
        if (submitComment.ok) {
            viewComments(postIdOfyouwantToComment)
            socket.emit('idOfThis', { postIdOfyouwantToComment, commentCount })
            console.log('success ung comment')
            inputComment.value = ''
        } else {
            console.log('error sa comment')
        }
    }

})


document.addEventListener('click', async (e) => {
    if (e.target.matches('#followBTN')) {
        if (e.target.textContent == 'unfollow') {
            console.log('na click ung unfollow')
            const followUserId = e.target.dataset.userid
            console.log('eto ung laman ng button ', e.target.textContent)
            console.log('eto ung userid ng gusto mo i unfollow ', followUserId)
            const follow = await apiReq('/unfollow', { followUserId: followUserId })
            if (follow.ok) {
                console.log('na unfollow mo')
                // e.target.textContent = `follow`
                const allPost = document.querySelectorAll('#followBTN')
                console.log(allPost)
                allPost.forEach(element => {

                    if (element.dataset.userid == followUserId) {
                        element.innerHTML = 'follow'
                    }
                })
                const followingCount = Number(document.getElementById('followingCount').textContent)
                document.getElementById('followingCount').textContent = followingCount - 1
            } else {
                console.log('error sa unfoloow')
            }

        } else {
            console.log('na click ung follow')
            const followUserId = e.target.dataset.userid
            console.log('eto ung laman ng button ', e.target.textContent)
            console.log('eto ung userid ng gusto mo i follow ', followUserId)
            const follow = await apiReq('/follow', { followUserId: followUserId })
            if (follow.ok) {
                console.log('na follow mo')
                const allPost = document.querySelectorAll('#followBTN')
                console.log(allPost)
                allPost.forEach(element => {
                    if (element.dataset.userid == followUserId) {
                        element.innerHTML = 'unfollow'
                    }

                })
                const followingCount = Number(document.getElementById('followingCount').textContent)
                document.getElementById('followingCount').textContent = followingCount + 1

            } else {
                console.log('error sa foloow')
            }
        }


    }
})

document.getElementById('followerBody').addEventListener('click', async () => {
    document.getElementById('showFollowersContent').innerHTML = ''
    document.getElementById('showFollowersBody').style.display = 'block'
    console.log('na clik ung show followers')
    const displayFollowers = await apiReq('/displayFollowers', { userId: loginUserId })
    if (displayFollowers.ok) {
        console.log('merong nakuha follower')
        console.log(displayFollowers.data)
        displayFollowers.data.forEach(element => {
            document.getElementById('showFollowersContent').innerHTML += `
            
            <div id="followersContent">
                <div>
                    <img src="${element.profileImage}" alt="">
                    <label id="followersInfo" data-userid="${element.id}">${element.username}</label>
                </div>
               
            </div>
            `
        })
    } else {
        console.log('error ka')
    }
})


document.addEventListener('click', async (e) => {
    if (e.target.matches('#visitfollowerBody') || e.target.matches('#visitFollowerCount')) {
        console.log('eto ung id nya ', idOfVisitProfile)
        document.getElementById('showFollowersContent').innerHTML = ''
        document.getElementById('showFollowersBody').style.display = 'block'
        console.log('na clik ung show followers')
        const displayFollowers = await apiReq('/displayFollowers', { userId: idOfVisitProfile })
        if (displayFollowers.ok) {
            console.log('merong nakuha follower')
            console.log(displayFollowers.data)
            displayFollowers.data.forEach(element => {
                document.getElementById('showFollowersContent').innerHTML += `

            <div id="followersContent">
                <div>
                    <img src="${element.profileImage}" alt="">
                    <label id="followersInfo" data-userid="${element.id}">${element.username}</label>
                </div>

            </div>
            `
            })
        } else {
            console.log('error ka')
        }
    }

})

document.getElementById('closeShowFollowers').addEventListener('click', () => {
    document.getElementById('showFollowersBody').style.display = 'none'
    document.getElementById('showFollowersContent').innerHTML = ''
})




async function verifyIfAlreadyfollow(followUserId) {
    const verifyFollow = await apiReq('/verifyIfAlreadyFollow', { followUserId: followUserId, userId: loginUserId })
    if (verifyFollow.ok) {


        return verifyFollow.data

    } else {
        console.log('errrrrrr')
        return null
    }

}











document.getElementById('followingBody').addEventListener('click', async () => {
    document.getElementById('showFollowersContent').innerHTML = ''
    document.getElementById('showFollowersBody').style.display = 'block'
    console.log('na clik ung show followers')
    const displayFollowers = await apiReq('/displayFollowing', { userId: loginUserId })
    if (displayFollowers.ok) {
        console.log('merong nakuha follower')
        console.log(displayFollowers.data)
        displayFollowers.data.forEach(element => {
            document.getElementById('showFollowersContent').innerHTML += `
            
            <div id="followersContent">
                <div>
                    <img src="${element.profileImage}" alt="">
                    <label id="followersInfo" data-userid="${element.id}">${element.username}</label>
                </div>
               <button id="unfollowBtn" data-userid="${element.id}">unfollow</button>
            </div>
            `
        })
    } else {
        console.log('error ka')
    }
})














document.addEventListener('click', async (e) => {
    if (e.target.matches('#visitfollowingBody') || e.target.matches('#visitfollowingCount')) {
        console.log('eto ung id nya ', idOfVisitProfile)
        document.getElementById('showFollowersContent').innerHTML = ''
        document.getElementById('showFollowersBody').style.display = 'block'
        console.log('na clik ung show followers')
        const displayFollowers = await apiReq('/displayFollowing', { userId: idOfVisitProfile })
        if (displayFollowers.ok) {
            console.log('merong nakuha follower')
            console.log(displayFollowers.data)
            displayFollowers.data.forEach(element => {
                document.getElementById('showFollowersContent').innerHTML += `

            <div id="followersContent">
                <div>
                    <img src="${element.profileImage}" alt="">
                    <label id="followersInfo" data-userid="${element.id}">${element.username}</label>
                </div>

            </div>
            `
            })
        } else {
            console.log('error ka')
        }
    }

})





document.addEventListener('click', async (e) => {
    if (e.target.matches('#unfollowBtn')) {
        const elementOfButton = e.target
        const idOfFollowing = e.target.dataset.userid
        console.log('eto ung element ', elementOfButton)
        const elementOfWanttoUnfollow = elementOfButton.closest('#followersContent')
        console.log(elementOfWanttoUnfollow)
        const unfollowThisUser = await apiReq('/unfollow', { followUserId: idOfFollowing })
        if (unfollowThisUser.ok) {
            elementOfWanttoUnfollow.style.display = 'none'
            const followingCount = Number(document.getElementById('followingCount').textContent)
            document.getElementById('followingCount').textContent = followingCount - 1
        } else {
            alert('error')
        }

    }
})









const uploadNewStory = document.getElementById('inputnewStory')

document.addEventListener('click', (e) => {
    if (e.target.matches('#createNewStory')) {
        uploadNewStory.click()

    }

})
const previewNewStory = document.getElementById('storyPreview')
document.getElementById('inputnewStory').addEventListener('change', () => {
    console.log(uploadNewStory.files[0])
    document.getElementById('addNewStory').style.display = 'flex'
    previewNewStory.innerHTML = '';
    const file = uploadNewStory.files[0]
    console.log(file.type)
    if (file.type == 'video/mp4') {
        const fileUrl = URL.createObjectURL(file)
        const vid = document.createElement('video')
        vid.src = fileUrl
        vid.autoplay = true
        vid.style.maxHeight = "100%"
        vid.style.maxWidth = "100%"
        previewNewStory.append(vid)
    } else {
        const fileUrl = URL.createObjectURL(file)
        const img = document.createElement('img')
        img.src = fileUrl
        img.style.maxHeight = "100%"
        img.style.maxWidth = "100%"
        previewNewStory.append(img)
    }


})

document.getElementById('closeAddStory').addEventListener('click', () => {

    if (confirm('Are you sure you want to discard?')) {
        window.location.reload()

    }

})

document.getElementById('submitStory').addEventListener('click', async (e) => {
    console.log('na click ung share')
    const formData = new FormData()
    formData.append('image', uploadNewStory.files[0])
    formData.append('username', loginUsername)
    formData.append('userId', loginUserId)


    try {
        document.getElementById('loadingCircle').style.display = 'flex'
        const submitStory = await fetch('https://instagramclone-developmentphasev2.onrender.com/uploadStory', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        const data = await submitStory.json()
        if (submitStory.ok) {
            window.location.reload()
            console.log(data)
        } else {
            alert('error submiting story')
        }
    } catch (err) {
        console.log('erro ka')
    }

})
