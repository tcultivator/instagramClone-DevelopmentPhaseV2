
import { apiReq } from './utils/fetchReq.js';
import { visitProfile, viewProfile } from './handlers/visitProfileHandler.js';
import { followingHandler } from './handlers/viewFollowingHandler.js'
import { followersHandler } from './handlers/viewFollowersHandler.js'
import { verifyIfAlreadyfollow } from './helper/verifyFollow.js'
import { followBtnFunction } from './handlers/followBtnHandler.js';
import { displayAllMessages } from './handlers/displayAllMessageHandler.js'
import { displayNewMessageAtHistory } from './helper/displayNewMessageAtHistory.js'

document.getElementById('loadingBody').style = 'display:flex'


let userData;
let filename;
let loginUsername;
let loginUserId;
let loginProfileimage;
let email;
let age;
let bio;
let address;


import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';


const socket = io('https://instagramclone-developmentphasev2.onrender.com', {
    withCredentials: true
});

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
        email = userData.email
        age = userData.age
        bio = userData.bio
        address = userData.address

        console.log('eto ung userid', loginUserId)
        document.getElementById('profileName').textContent = userData.username
        document.getElementById('changeProfile').src = userData.profileImage
        document.getElementById('imageOnaddStory').src = userData.profileImage
        document.getElementById('followersCount').textContent = userData.follower
        document.getElementById('followingCount').textContent = userData.following
        document.getElementById('bioInProfile').textContent = userData.bio

        document.getElementById('followerBody').dataset.userid = userData.id
        document.getElementById('followingBody').dataset.userid = userData.id

        const getAlldataForWall = await fetch('https://instagramclone-developmentphasev2.onrender.com/getAll', {
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
                     <button id="like" ><i id="likethisPost" data-id="${element.id}" class="fa-regular fa-heart"></i></button>
                    `)
                const isVideo = element.secure_url.match(/\.(mp4|webm|ogg)$/i);
                const mediaTag = isVideo
                    ? `<video autoplay muted width="100%" id="postVid" controls>
                <source id="vidSource" src="${element.secure_url}" type="video/mp4" >
                Your browser does not support the video tag.
                
           </video>
           
           `


                    : `<img src="${element.secure_url}" alt="User post">`;
                const alreadyFollowData = await verifyIfAlreadyfollow(element.userId, loginUserId);
                const followBtn = alreadyFollowData.alreadyFollow == true ? (
                    `<button id="followBTN" data-userid="${element.userId}">unfollow</button>`
                ) : (`<button id="followBTN" data-userid="${element.userId}">follow</button>`)

                const followVisible = element.userId == loginUserId ? (``)
                    : (`${followBtn}`)
                document.getElementById('userPost').innerHTML += `
                <div id="postcontent" data-id="${element.id}">  
                        <div id="userProfilePost">
                            <div>
                                <img id="userThatPostImage" data-userid="${element.userId}" src="${element.userProfile}" alt="">
                                <label id="userThatPostLabel" data-userid="${element.userId}">${element.username}</label>
                            </div>
                             <div>
                                ${followVisible}
                                <button><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            </div>
                            
                        </div>
                        <div id="userPostContent">
                            ${mediaTag}
                        </div>
                        <div id="likecommentshare">
                            ${likeBtn}
                            <button id="comment"><i id="commentthispost" data-id="${element.id}" class="fa-regular fa-comment"></i></button>
                            <button id="share"><i class="fa-regular fa-paper-plane"></i></button>
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
let selectedStoryId;
document.addEventListener('click', (e) => {
    if (e.target.matches('#storyView')) {

        const idOfElemt = e.target.dataset.id;
        selectedStoryId = e.target.dataset.id;
        const elementOfStory = document.querySelector(`#addStories[data-id="${idOfElemt}"]`)
        console.log('eto ung id ng elemt ', idOfElemt)
        console.log('eto ung element mismo ', elementOfStory)

        const srcOfIMG = document.querySelector(`#storyView[data-id="${idOfElemt}"]`)
        console.log(srcOfIMG.src)
        const isVideo = srcOfIMG.src.match(/\.(mp4|webm|ogg)$/i);
        if (isVideo) {

            document.getElementById('previewOfStoryVID').autoplay = true
            document.getElementById('previewOfStoryVID').src = srcOfIMG.src
            document.getElementById('viewStoryBody').style.display = 'flex'
            const usernameOfStory = document.querySelector(`#story-label[data-id="${idOfElemt}"]`)
            document.getElementById('usernameOfStoryview').textContent = usernameOfStory.textContent
            if (loginUsername == usernameOfStory.textContent) {
                document.getElementById('storyViewCount').style.display = 'block'
            } else {
                document.getElementById('storyViewCount').style.display = 'none'
            }
            document.getElementById('previewOfStoryIMG').style.display = 'none'
            document.getElementById('previewOfStoryVID').style.display = 'block'
            getStoryViewCount(idOfElemt)

        } else {

            document.getElementById('previewOfStoryIMG').src = srcOfIMG.src
            document.getElementById('viewStoryBody').style.display = 'flex'
            const usernameOfStory = document.querySelector(`#story-label[data-id="${idOfElemt}"]`)
            document.getElementById('usernameOfStoryview').textContent = usernameOfStory.textContent
            if (loginUsername == usernameOfStory.textContent) {
                document.getElementById('storyViewCount').style.display = 'block'
            } else {
                document.getElementById('storyViewCount').style.display = 'none'
            }
            document.getElementById('previewOfStoryIMG').style.display = 'block'
            document.getElementById('previewOfStoryVID').style.display = 'none'
            getStoryViewCount(idOfElemt)
        }





    }

})


async function getStoryViewCount(idOfElemt) {

    const getViewCount = await apiReq('/getStoryViewCount', { idOfElemt: idOfElemt, userId: loginUserId, username: loginUsername, profileImage: loginProfileimage })
    if (getViewCount.ok) {
        console.log('eto ung count ng view')
        console.log(getViewCount.data[0].viewCount)
        document.getElementById('storyViewCount').textContent = getViewCount.data[0].viewCount
        document.getElementById('storyViewCount').setAttribute('data-id', idOfElemt)
        console.log(document.getElementById('storyViewCount').dataset.id)

    } else {
        console.log('error ka sa view Count')
    }

}

document.addEventListener('click', async (e) => {
    if (e.target.matches('#storyViewCount')) {
        console.log('na click ung viewCount')
        console.log(document.getElementById('storyViewCount').dataset)
        const storyId = document.getElementById('storyViewCount').dataset.id
        document.getElementById('viewerContent').innerHTML = ''
        const getAllStoryViewer = await apiReq('/getAllStoryViewer', { storyId: storyId })
        if (getAllStoryViewer.ok) {
            document.getElementById('storyViewerList').style.display = 'block'
            console.log(getAllStoryViewer.data)
            getAllStoryViewer.data.forEach(element => {
                let reactionsIcon = '';
                if (element.reactions != '') {
                    const parseReactionIcon = JSON.parse(element.reactions)
                    reactionsIcon = parseReactionIcon.join(' ')

                }

                document.getElementById('viewerContent').innerHTML += `
                <div id="viewerContentInfo" data-id="${element.id}">
                    <div id="viewerInfo">
                        <img src="${element.secure_url}" alt="">
                        <label for="">${element.username}</label>
                    </div>

                   
                    <div id="viewerReactions">
                       ${reactionsIcon}
                    </div>

                </div>
                `
            })
        } else {
            alert('error')
        }
    }
})

document.getElementById('closeViewStory').addEventListener('click', () => {
    document.getElementById('viewStoryBody').style.display = 'none'
    document.getElementById('previewOfStoryVID').src = ''

})

document.getElementById('closeStoryViewerList').addEventListener('click', () => {
    document.getElementById('storyViewerList').style.display = 'none'
})


let reactionsArr = []
let reactionDelay = null;

let reactionsClickLimit = 7;
document.addEventListener('click', async (e) => {
    if (e.target.matches('#heartReact') || e.target.matches('#hahaReact') || e.target.matches('#likeReact')) {
        console.log(e.target.outerHTML)
        reactionsClickLimit--;
        if (reactionsClickLimit < 0) {
            console.log('reach max of reactions')
        } else {
            reactionsArr.push(e.target.outerHTML)

            if (e.target.matches('#heartReact')) {
                document.getElementById('reactionsPopupIconheart').style.display = 'flex'

                setTimeout(() => {
                    document.getElementById('reactionsPopupIconheart').style.display = 'none'

                }, 200);

            } else if (e.target.matches('#hahaReact')) {
                document.getElementById('reactionsPopupIconhaha').style.display = 'flex'

                setTimeout(() => {
                    document.getElementById('reactionsPopupIconhaha').style.display = 'none'

                }, 200);

            } else if (e.target.matches('#likeReact')) {
                document.getElementById('reactionsPopupIconlike').style.display = 'flex'

                setTimeout(() => {
                    document.getElementById('reactionsPopupIconlike').style.display = 'none'

                }, 200);

            }

        }


        clearTimeout(reactionDelay)
        reactionDelay = setTimeout(() => {
            console.log('natapos na ung timeout delay')
            console.log(reactionsArr)
            const reactionData = JSON.stringify(reactionsArr)
            setReactions(reactionData)
            reactionsClickLimit = 7;
            reactionsArr = []

        }, 1000);
    }
})

async function setReactions(reactionsArr) {
    const sendStoryReactions = await apiReq('/sendStoryReactions', { reactionsArr: reactionsArr, selectedStoryId: selectedStoryId, loginUserId: loginUserId })
    if (sendStoryReactions.ok) {
        console.log('success sa pag send ng reactions ')
    } else {
        console.log('error sa pag send ng reactions')
    }
}



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
                document.getElementById('searchBody').style.zIndex = 1
                document.getElementById('searchBody').style.display = 'block'
                document.getElementById('createPost').style.display = 'none'
                document.getElementById('profileBody').style = 'display:none'
                document.getElementById('messageBody').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('visitprofileBody').style = 'display:none'
                break;
            case 'create':
                console.log('this is create')
                document.getElementById('searchBody').style.display = 'none'
                document.getElementById('createPost').style.display = 'flex'
                document.getElementById('createPost').style.zIndex = 1
                document.getElementById('profileBody').style = 'display:none'
                document.getElementById('messageBody').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('visitprofileBody').style = 'display:none'
                break;
            case 'notif':
                console.log('this is notif')
                document.getElementById('viewPostBody').style.display = 'none'
                break;
            case 'profile':
                document.getElementById('imgGrid').innerHTML = ''
                console.log('this is profile')
                viewProfile(loginUserId)
                document.getElementById('searchBody').style.display = 'none'
                document.getElementById('createPost').style.display = 'none'
                document.getElementById('profileBody').style = 'display:block'
                document.getElementById('profileBody').style.zIndex = 1
                document.getElementById('messageBody').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('visitprofileBody').style = 'display:none'
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
                document.getElementById('searchBody').style.zIndex = 1
                document.getElementById('searchBody').style.display = 'block'
                document.getElementById('createPost').style.display = 'none'
                document.getElementById('profileBody').style = 'display:none'
                document.getElementById('messageBody').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('visitprofileBody').style = 'display:none'
                break;
            case 'createS':
                console.log('this is create')
                document.getElementById('searchBody').style.display = 'none'
                document.getElementById('createPost').style.display = 'flex'
                document.getElementById('createPost').style.zIndex = 1
                document.getElementById('profileBody').style = 'display:none'
                document.getElementById('messageBody').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('visitprofileBody').style = 'display:none'
                break;
            case 'notifS':
                console.log('this is notif')
                document.getElementById('viewPostBody').style.display = 'none'
                break;
            case 'profileS':
                document.getElementById('imgGrid').innerHTML = ''
                console.log('this is profile')
                viewProfile(loginUserId)
                document.getElementById('searchBody').style.display = 'none'
                document.getElementById('createPost').style.display = 'none'
                document.getElementById('profileBody').style = 'display:block'
                document.getElementById('profileBody').style.zIndex = 1
                document.getElementById('messageBody').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('visitprofileBody').style = 'display:none'
                break;
            case 'messageButtonHeaderS':
                document.getElementById('listOfconvoBody').innerHTML = ''
                document.getElementById('messageBody').style.display = 'flex'
                document.getElementById('messageBody').style.zIndex = 1
                openMessageWindow()
                console.log('this is message')
                document.getElementById('profileBody').style = 'display:none'
                document.getElementById('visitprofileBody').style = 'display:none'
                document.getElementById('createPost').style.display = 'none'
                document.getElementById('updateProfilePic').style.display = 'none'
                document.getElementById('viewPostBody').style.display = 'none'
                document.getElementById('searchBody').style.display = 'none'
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
        vid.style.height = "100%"
        vid.style.width = "100%"
        preview.append(vid)
    } else {
        const fileUrl = URL.createObjectURL(file)
        const img = document.createElement('img')
        img.src = fileUrl
        img.style.height = "100%"
        img.style.width = "100%"
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
    formData.append('userProfile', loginProfileimage)

    try {
        const upload = await fetch('https://instagramclone-developmentphasev2.onrender.com/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        const data = await upload.json()
        if (upload.ok) {
            window.location.reload()
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

document.getElementById('editProfilePic').addEventListener('click', () => {
    console.log('naclick ung profile')
    document.getElementById('updateProfilePic').style.display = 'flex'

})




const usernameOfUser = document.getElementById('usernameOfUser')
const emailOfUser = document.getElementById('emailOfUser')
const addressOfUser = document.getElementById('addressOfUser')
const ageOfUser = document.getElementById('ageOfUser')
const bioOfUser = document.getElementById('bioOfUser')
document.getElementById('editProfile').addEventListener('click', () => {
    console.log('eto ung pang edit sa mismong profile info')
    document.getElementById('editProfileInfo').style.display = 'block'
    usernameOfUser.value = loginUsername
    emailOfUser.value = email
    addressOfUser.value = address
    ageOfUser.value = age
    bioOfUser.value = bio
})

document.getElementById('changeProfileInfoBtn').addEventListener('click', async () => {
    document.getElementById('loadingCircle').style.display = 'flex'
    const changeUsername = await apiReq('/changeUserInfo', {
        username: usernameOfUser.value,
        email: emailOfUser.value, address: addressOfUser.value, age: ageOfUser.value,
        bio: bioOfUser.value
    })
    if (changeUsername.ok) {
        console.log('success')
        window.location.reload()
    } else {
        console.log('error')
    }
})




document.getElementById('closeEditProfileInfo').addEventListener('click', () => {
    document.getElementById('editProfileInfo').style.display = 'none'
})

const profilePicUpload = document.getElementById('profilefile')
const previewProfile = document.getElementById('previewProfile')

profilePicUpload.addEventListener('change', () => {
    previewProfile.innerHTML = '';
    const file = profilePicUpload.files[0]
    const fileUrl = URL.createObjectURL(file)
    const img = document.createElement('img')
    img.src = fileUrl
    img.style.maxHeight = "100%"
    img.style.maxWidth = "100%"
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


//view user profile
document.addEventListener('click', async (e) => {
    if (e.target.matches('#userThatPost') || e.target.matches('#userThatPostImage') || e.target.matches('#userThatPostLabel')) {
        visitProfile(loginUserId, e.target.dataset.userid)
    } else if (e.target.matches('#followersContent') || e.target.matches('#followersUserProfile') || e.target.matches('#followersInfo')) {
        const elementID = document.querySelector('#followersContent')
        visitProfile(loginUserId, elementID.dataset.userid)
    }
});

document.getElementById('visitbackBtnonProfile').addEventListener('click', () => {
    document.getElementById('visitprofileBody').style.display = 'none'
    document.getElementById('visitimgGrid').innerHTML = ''
})

document.getElementById('visitprofileMessage').addEventListener('click', (e) => {
    const elementID = document.querySelector('#visitprofileName')
    openConvoWindow(elementID.dataset.userid)
    console.log(elementID.dataset.userid)
})




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

            likeIcon.style = 'color:rgb(36, 36, 36)'
            likeIcon.classList = 'fa-regular fa-heart'
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
            likeIcon.classList = 'fa-solid fa-heart'
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
                    <div id="commentDetails" style="background-color:#1C6CFF; color:white">
                        <label id="userThatComment" style="color:white">${element.username}</label>
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



// follow/unfollow actions
document.addEventListener('click', async (e) => {
    if (e.target.matches('#followBTN') || e.target.matches('#unfollowBtn') || e.target.matches('#visitprofileFollow') || e.target.matches('#followBtnInSearch')) {
        console.log(e.target)
        followBtnFunction(e.target)
    }
})


// display your followers
document.addEventListener('click', (e) => {
    if (e.target.matches('#followerBody') || e.target.matches('#followersCount') || e.target.matches('#followersLabel')) {
        const elementID = document.querySelector('#followerBody')
        followersHandler(loginUserId, elementID.dataset.userid)
    }
})

// display followers of visiting profile
document.addEventListener('click', async (e) => {
    if (e.target.matches('#visitfollowerBody') || e.target.matches('#visitFollowerCount') || e.target.matches('#visitFollowerLabel')) {
        const elementID = document.querySelector('#visitfollowerBody')
        followersHandler(loginUserId, elementID.dataset.userid)
    }

})

//display your following

document.addEventListener('click', (e) => {
    if (e.target.matches('#followingBody') || e.target.matches('#followingCount') || e.target.matches('#followingLabel')) {
        const elementID = document.querySelector('#followingBody')
        followingHandler(loginUserId, elementID.dataset.userid)
    }
})


//display following of visiting profile
document.addEventListener('click', async (e) => {
    if (e.target.matches('#visitfollowingBody') || e.target.matches('#visitfollowingCount') || e.target.matches('#visitfollowingLabel')) {
        const elementID = document.querySelector('#visitfollowingBody')
        followingHandler(loginUserId, elementID.dataset.userid)
    }
})

document.getElementById('closeShowFollowers').addEventListener('click', () => {
    document.getElementById('showFollowersBody').style.display = 'none'
    document.getElementById('showFollowersContent').innerHTML = ''
})

// document.addEventListener('click', async (e) => {
//     if (e.target.matches('#unfollowBtn')) {
//         unfollowBtnfunction(e.target)

//     }
// })

// async function unfollowBtnfunction(selectedHtmlElement) {
//     const elementOfButton = selectedHtmlElement
//     const idOfFollowing = selectedHtmlElement.dataset.userid
//     console.log('eto ung element ', elementOfButton)
//     const elementOfWanttoUnfollow = elementOfButton.closest('#followersContent')
//     console.log(elementOfWanttoUnfollow)
//     const unfollowThisUser = await apiReq('/unfollow', { followUserId: idOfFollowing })
//     if (unfollowThisUser.ok) {
//         elementOfWanttoUnfollow.style.display = 'none'
//         const followingCount = Number(document.getElementById('followingCount').textContent)
//         document.getElementById('followingCount').textContent = followingCount - 1
//     } else {
//         alert('error')
//     }
// }









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



document.getElementById('logout').addEventListener('click', async (e) => {
    document.getElementById('loadingCircle').style.display = 'flex'
    document.getElementById('logoutPopup').style.display = 'none'
    const logout = await apiReq('/logout')
    if (logout.ok) {
        console.log('success logout')
        window.location.replace('index.html')
    } else {
        console.log('hindi ka makapag logout')
    }
})

let settingsToggle = false
document.addEventListener('click', (e) => {
    if (e.target.matches('#settingsInProfile') || e.target.matches('#gearIcon')) {
        settingsToggle = !settingsToggle;
        console.log('zxczxczxczxc')
        settingsToggle ? document.getElementById('logoutPopup').style.display = 'block' :
            document.getElementById('logoutPopup').style.display = 'none'
    } else {
        document.getElementById('logoutPopup').style.display = 'none'
    }

})




// view about in your userprofile
document.getElementById('aboutUser').addEventListener('click', () => {
    console.log('zxczxczxczxczxczxc')
    document.getElementById('profileContent').style = 'max-height: calc(100% - 63%);'
    document.getElementById('aboutUserInfoBody').style.display = 'flex'
    document.getElementById('usernameInAboutUser').textContent = loginUsername
    document.getElementById('emailInAboutUser').textContent = email
    document.getElementById('addressInAboutUser').textContent = address
    document.getElementById('ageInAboutUser').textContent = age
})
document.getElementById('closeAboutUser').addEventListener('click', () => {
    document.getElementById('profileContent').style = 'max-height: calc(100% - 49%);'
    document.getElementById('aboutUserInfoBody').style.display = 'none'
})


// view about in other user profile
document.getElementById('visitprofileAbout').addEventListener('click', () => {
    document.getElementById('visitprofileDetails').style = 'max-height: calc(100% - 63%);'
    document.getElementById('visitaboutUserInfoBody').style.display = 'flex'
})
document.getElementById('visitcloseAboutUser').addEventListener('click', () => {
    document.getElementById('visitprofileDetails').style = 'max-height: calc(100% - 49%);'
    document.getElementById('visitaboutUserInfoBody').style.display = 'none'
})


let searchTimeout = null;
const searchInputValue = document.getElementById('searchInput')
searchInputValue.addEventListener('input', async () => {
    clearTimeout(searchTimeout)
    document.getElementById('searchLoadingMessage').style.display = 'block'
    document.getElementById('searchLoadingMessage').textContent = 'Searching....'
    searchTimeout = setTimeout(() => {
        autoSearch(searchInputValue.value)
    }, 2500);
})

async function autoSearch(searchValue) {
    if (searchValue) {

        const autoSearch = await apiReq('/autoSearch', {
            searchValue: searchValue
        })
        if (autoSearch.ok) {
            document.getElementById('searchLoadingMessage').style.display = 'none'
            console.log(autoSearch.data.data)
            const autoSearchResult = await Promise.all(
                autoSearch.data.data.map(async element => {
                    const alreadyFollowData = await verifyIfAlreadyfollow(element.id, loginUserId);
                    const followBtn = alreadyFollowData.alreadyFollow == true ? (
                        `<button id="followBtnInSearch" data-userid="${element.id}">unfollow</button>`
                    ) : (`<button id="followBtnInSearch" data-userid="${element.id}">follow</button>`)
                    const isYou = element.id == loginUserId ? (``) :
                        (` <button id="messageThisUserInSearch" data-id="${element.id}">Message</button>
                        ${followBtn}`)
                    return `
            <div id="contentsOfSearchResults" data-id="${element.id}">
                    <div id="resultsDetails">
                        <img id="resultsDetailsImg" src="${element.profileImage}" alt="" data-id="${element.id}">
                        <label id="resultsDetailsUsername" data-id="${element.id}">${element.username}</label>
                    </div>
                    <div id="resultsControl">
                       ${isYou}
                    </div>
            </div>
            `
                })
            )

            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            ${autoSearchResult.join('')}
            </div>
            `
        } else {
            document.getElementById('searchLoadingMessage').textContent = autoSearch.data.message
            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            
            </div>
            `
        }
    } else {
        document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            
            </div>
            `
        document.getElementById('searchLoadingMessage').style.display = 'none'
    }

}




document.getElementById('searchBtn').addEventListener('click', async () => {
    document.getElementById('searchLoadingMessage').style.display = 'block'
    document.getElementById('searchLoadingMessage').textContent = 'Searching....'
    submitSearch(searchInputValue.value)
})
async function submitSearch(searchValue) {
    if (searchValue) {
        const search = await apiReq('/search', {
            searchValue: searchValue
        })
        if (search.ok) {
            document.getElementById('searchLoadingMessage').style.display = 'none'
            console.log(search.data.data)
            const searchResults = await Promise.all(
                search.data.data.map(async element => {
                    const alreadyFollowData = await verifyIfAlreadyfollow(element.id, loginUserId);
                    const followBtn = alreadyFollowData.alreadyFollow == true ? (
                        `<button id="followBtnInSearch" data-userid="${element.id}">unfollow</button>`
                    ) : (`<button id="followBtnInSearch" data-userid="${element.id}">follow</button>`)
                    const isYou = element.id == loginUserId ? (``) :
                        (` <button id="messageThisUserInSearch" data-id="${element.id}">Message</button>
                        ${followBtn}`)
                    return `
            <div id="contentsOfSearchResults" data-id="${element.id}">
                    <div id="resultsDetails">
                        <img id="resultsDetailsImg" src="${element.profileImage}" alt="" data-id="${element.id}">
                        <label id="resultsDetailsUsername" data-id="${element.id}">${element.username}</label>
                    </div>
                    <div id="resultsControl">
                       ${isYou}
                    </div>
            </div>
            `
                })
            )

            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            ${searchResults.join('')}
            </div>
            `
        } else {
            document.getElementById('searchLoadingMessage').textContent = search.data.message
            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            
            </div>
            `
        }
    }
}


// view user profile from search
document.addEventListener('click', (e) => {
    if (e.target.matches('#contentsOfSearchResults') || e.target.matches('#resultsDetailsImg') || e.target.matches('#resultsDetailsUsername')) {
        visitProfile(loginUserId, e.target.dataset.id)
        document.getElementById('searchBody').style.zIndex = 0
    }
})



document.getElementById('closeSearchWindow').addEventListener('click', () => {
    document.getElementById('searchBody').style.display = 'none'
})






let recieverId;
document.addEventListener('click', (e) => {
    if (e.target.matches('#messageThisUserInSearch') || e.target.matches('#convoContent') || e.target.matches('#convoContent img')) {
        openConvoWindow(e.target.dataset.id)
        recieverId = e.target.dataset.id
    }
})



// eto ung mismong converstation
async function openConvoWindow(recieverId) {
    document.getElementById('loadingCircle').style.display = 'flex'
    const findConvoData = await apiReq('/findConvoData', {
        recieverId: recieverId,
        loginUserId: loginUserId,
        loginUsername: loginUsername,
        loginProfileimage: loginProfileimage
    })

    if (findConvoData.ok) {
        console.log('sa frontend success')

        console.log(findConvoData.data)
        displayAllMessages(recieverId, loginUserId)
        document.getElementById('conversationBody').style.display = 'flex'

        const ifRecieverIsYou = findConvoData.data[0].recieverUsername == loginUsername ? (

            findConvoData.data[0].senderUsername
        ) : (

            findConvoData.data[0].recieverUsername
        )
        document.getElementById('usernameInconversationHeader').textContent = ifRecieverIsYou
    } else {
        console.log('sa frontend error')
    }
}






document.getElementById('messageButtonHeader').addEventListener('click', () => {
    document.getElementById('listOfconvoBody').innerHTML = ''
    document.getElementById('messageBody').style.display = 'flex'
    document.getElementById('messageBody').style.zIndex = 1
    openMessageWindow()
    document.getElementById('profileBody').style = 'display:none'
    document.getElementById('visitprofileBody').style = 'display:none'
    document.getElementById('createPost').style.display = 'none'
    document.getElementById('updateProfilePic').style.display = 'none'
    document.getElementById('viewPostBody').style.display = 'none'
    document.getElementById('searchBody').style.display = 'none'
})




// eto ung sa display ng list ng mga na message
async function openMessageWindow() {
    document.getElementById('loadingCircle').style.display = 'flex'
    const displayAllMessageHistory = await apiReq('/displayAllMessageHistory', {
        loginUserId: loginUserId
    })

    if (displayAllMessageHistory.ok) {
        document.getElementById('loadingCircle').style.display = 'none'
        document.getElementById('messageBody').style.display = 'flex'
        console.log(displayAllMessageHistory.data)
        displayAllMessageHistory.data.forEach(async element => {
            const newMessage = await displayNewMessageAtHistory(element.senderId, element.recieverId)
            const senderIdIsMe = newMessage.senderId == loginUserId ? (
                `
                <label data-id="${element.senderId}" id="latestMessageInHistory">You: <span>${newMessage.message}</span></label>
                `
            ) :
                (`
                <label data-id="${element.recieverId}" id="latestMessageInHistory">${element.recieverUsername}: <span>${newMessage.message}</span></label>
                
                `)
            const isMeSender = element.senderId == loginUserId ? (`
            <div id="convoContent" data-id="${element.recieverId}">
                <img data-id="${element.recieverId}" src="${element.recieverImage}" alt="">
                <div>
                    <label data-id="${element.recieverId}">${element.recieverUsername}</label>
                    ${senderIdIsMe}
                </div>
            </div>
                `) :
                (`
            <div id="convoContent" data-id="${element.senderId}">
                <img data-id="${element.senderId}" src="${element.senderImage}" alt="">
                <div>
                    <label data-id="${element.senderId}">${element.senderUsername}</label>
                    ${senderIdIsMe}
                </div>
            </div>
                
                
                `)

            document.getElementById('listOfconvoBody').innerHTML += `
            ${isMeSender}
            `
        })
    } else {
        console.log('error sa frontend message button')
    }
}



document.getElementById('closeMessageBody').addEventListener('click', (e) => {
    document.getElementById('messageBody').style.display = 'none'
})
document.getElementById('closeconversationBody').addEventListener('click', (e) => {
    document.getElementById('conversationBody').style.display = 'none'

})


const sendNewMessageInput = document.getElementById('sendNewMessageInput')



document.getElementById('sendNewMessageButton').addEventListener('click', async () => {
    sendThisMessage(sendNewMessageInput.value)
})

async function sendThisMessage(message) {
    document.getElementById('conversations').innerHTML += `
             <div id="informationAndMessagesRight" data-id="${loginUserId}">
                <div id="textMessagesRight">
                    <label id="textMessageDataRight">${message}</label>
                </div>
                <img id="senderUserImageRight" src="${loginProfileimage}" alt="">

            </div>
            `
    scrollToBottom(chatBox)
    document.getElementById('latestMessageInHistory').innerHTML = `You: <span>${message}</span>`
    sendNewMessageInput.value = ''
    document.getElementById('sendNewMessageButton').style.display = 'none'
    document.getElementById('sendLikeMessage').style.display = 'flex'
    const sendNewMessage = await apiReq('/sendNewMessage', {
        recieverId: recieverId,
        loginUserId: loginUserId,
        loginProfileimage: loginProfileimage,
        message: message
    })
    if (sendNewMessage.ok) {
        console.log('success sent')
        socket.emit('displayNewMessage', { recieverId, loginUserId, loginProfileimage, message, loginUsername })

    } else {
        console.log('error sent')
    }
}


socket.on('displayNewMessageRealtime', ({ recieverId, senderId, senderImage, senderMessage, senderUsername }) => {
    console.log('hahahaha eto ung na recieve sa socket')
    document.getElementById('conversations').innerHTML += `
             <div id="informationAndMessagesLeft" data-id="${senderId}">
                <img id="senderUserImageLeft" src="${senderImage}" alt="">
                <div id="textMessagesLeft">
                    <label id="textMessageDataLeft">${senderMessage}</label>
                </div>
            </div>
            `
    scrollToBottom(chatBox)
    document.getElementById('latestMessageInHistory').innerHTML = `${senderUsername}: <span>${senderMessage}</span>`
})


export const chatBox = document.getElementById('conversations');
export function scrollToBottom(chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendNewMessageInput.addEventListener('focus', () => {
    setTimeout(() => {
        scrollToBottom(chatBox)
    }, 500);

})

sendNewMessageInput.addEventListener('input', () => {
    if (sendNewMessageInput.value == '') {
        document.getElementById('sendNewMessageButton').style.display = 'none'
        document.getElementById('sendLikeMessage').style.display = 'flex'
    } else {
        document.getElementById('sendNewMessageButton').style.display = 'flex'
        document.getElementById('sendLikeMessage').style.display = 'none'
    }

})

document.getElementById('sendLikeMessage').addEventListener('click', () => {
    sendThisMessage('👍')
})



document.addEventListener('click', (e) => {
    console.log(e.target)
})
