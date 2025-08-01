
import { apiReq } from './utils/fetchReq.js';
import { autoSearch, submitSearch } from './handlers/searchHandler.js'

// postController
import { viewComments, likeThisPost, followBtnFunction } from './handlers/postController/index.js'
// storyController
import { viewStory, sendStoryReaction, getAllStories, displayAllStoryViewer } from './handlers/storyController/index.js';
// navigation datafile
import { createPostNav, messageNav, profileNav, searchNav } from './UI/index.js';
// message Controller
import { sendFileAsMessage, openConvoWindow, openMessageWindow, sendThisMessage } from './handlers/messageController/index.js'
// profile Controller
import { followersHandler, followingHandler, visitProfile, viewProfile } from './handlers/profileController/index.js'
// helper
import { verifyIfAlreadyfollow, verifyIfAlreadyLike } from './helper/index.js'
//notification controller
import { displayNotifications } from './handlers/notificationController/displayNotificationHanlder.js';
import { markReadThisNotif } from './handlers/notificationController/markReadNotificationHandler.js';
import { getUnreadNotif } from './handlers/notificationController/getUnreadNotifCount.js';





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
                const alreadyLikedData = await verifyIfAlreadyLike(element.id, loginUserId);
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
// function to display all stories
getAllStories(loginProfileimage);
getUnreadNotif();

let selectedStoryId;
document.addEventListener('click', (e) => {
    if (e.target.matches('#storyView')) {
        selectedStoryId = e.target.dataset.id;
        viewStory(e.target, loginUserId, loginUsername, loginProfileimage)
    }

})


document.addEventListener('click', async (e) => {
    if (e.target.matches('#storyViewCount')) {
        displayAllStoryViewer()
    }
})

document.getElementById('closeViewStory').addEventListener('click', () => {
    document.getElementById('viewStoryBody').style.display = 'none'
    document.getElementById('previewOfStoryVID').src = ''

})

document.getElementById('closeStoryViewerList').addEventListener('click', () => {
    document.getElementById('storyViewerList').style.display = 'none'
})


export let storyControl = {
    reactionsArr: [],
    reactionDelay: null,
    reactionsClickLimit: 7
}
document.addEventListener('click', async (e) => {
    if (e.target.matches('#heartReact') || e.target.matches('#hahaReact') || e.target.matches('#likeReact')) {
        sendStoryReaction(e.target, selectedStoryId, loginUserId)
    }
})




// navigation for mobile
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
                searchNav()
                break;
            case 'create':
                console.log('this is create')
                createPostNav()
                break;
            case 'notif':
                console.log('this is notif')
                document.getElementById('viewPostBody').style.display = 'none'
                document.getElementById('notificationBody').style.display = 'block'
                displayNotifications()
                break;
            case 'profile':
                profileNav()
                viewProfile(loginUserId)
                break;

            default:
                break;
        }
    } catch (err) {
        console.log('no element')
    }
})

// navigation for desktop
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
                searchNav()
                convoOpen = false;
                break;
            case 'createS':
                console.log('this is create')
                createPostNav()
                convoOpen = false;
                break;
            case 'notifS':
                console.log('this is notif')
                document.getElementById('viewPostBody').style.display = 'none'
                document.getElementById('notificationBody').style.display = 'block'
                displayNotifications()
                break;
            case 'profileS':
                console.log('this is profile')
                profileNav()
                viewProfile(loginUserId)
                convoOpen = false;

                break;
            case 'messageButtonHeaderS':

                openMessageWindow(loginUserId)
                console.log('this is message')
                messageNav()
                convoOpen = false;
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




document.getElementById('uploadNewFileForPost').addEventListener('click', () => {
    fileUploaded.click()
})
const fileUploaded = document.getElementById('fileUp')
const preview = document.getElementById('preview')


fileUploaded.addEventListener('change', () => {
    document.getElementById('uploadNewFileForPost').style.display = 'none'
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
    document.getElementById('uploadNewFileForPost').style.display = 'block'
    fileUploaded.value = ''
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


document.getElementById('editProfilePic').addEventListener('click', () => {
    console.log('naclick ung profile')
    document.getElementById('updateProfilePic').style.display = 'flex'
    profilePicUpload.click()
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
        visitProfile(loginUserId, e.target.dataset.userid)
        console.log('eto ung id kapag na select na ', e.target.dataset.userid)
    } else if (e.target.matches('#visitProfileFromComments')) {
        visitProfile(loginUserId, e.target.dataset.userid)
    } else if (e.target.matches('#senderUserImageRight') || e.target.matches('#senderUserImageLeft')) {
        visitProfile(loginUserId, e.target.dataset.userid)
    }
});

document.getElementById('visitbackBtnonProfile').addEventListener('click', () => {
    document.getElementById('visitprofileBody').style.display = 'none'
    document.getElementById('visitimgGrid').innerHTML = ''
})

document.getElementById('visitprofileMessage').addEventListener('click', (e) => {
    const elementID = document.querySelector('#visitprofileName')
    openConvoWindow(elementID.dataset.userid, loginUserId, loginUsername, loginProfileimage, socket)
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
        likeThisPost(e.target, loginUserId, socket, loginUsername, loginProfileimage)
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


        viewComments(postIdOfyouwantToComment, loginUsername)


    }
})

socket.on('idOfCommentFromIO', ({ postIdOfyouwantToComment, commentCount }) => {
    viewComments(postIdOfyouwantToComment, loginUsername)
    const postElement = document.querySelector(`#postcontent[data-id="${postIdOfyouwantToComment}"]`)
    const commentCountLabel = postElement.querySelector('#commentCount')
    commentCountLabel.dataset.commentcount = commentCount
    commentCountLabel.innerHTML = `${commentCount} <span>Comments</span>`
})



document.getElementById('closeComment').addEventListener('click', () => {
    document.getElementById('viewPostBody').style.display = 'none'

})


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
            viewComments(postIdOfyouwantToComment, loginUsername)
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
        followBtnFunction(e.target, loginUserId, loginUsername, loginProfileimage,socket)
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


// auto search function
let searchTimeout = null;
const searchInputValue = document.getElementById('searchInput')
searchInputValue.addEventListener('input', async () => {
    clearTimeout(searchTimeout)
    document.getElementById('searchLoadingMessage').style.display = 'block'
    document.getElementById('searchLoadingMessage').textContent = 'Searching....'
    searchTimeout = setTimeout(() => {
        autoSearch(searchInputValue.value, loginUserId)
    }, 2500);
})


// submit search function
document.getElementById('searchBtn').addEventListener('click', async () => {
    document.getElementById('searchLoadingMessage').style.display = 'block'
    document.getElementById('searchLoadingMessage').textContent = 'Searching....'
    submitSearch(searchInputValue.value, loginUserId)
})


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





// open convo
let recieverId;
let convoOpen = false;
document.addEventListener('click', (e) => {
    if (e.target.matches('#messageThisUserInSearch') || e.target.matches('#convoContent') || e.target.matches('#convoContent img')) {
        openConvoWindow(e.target.dataset.id, loginUserId, loginUsername, loginProfileimage, socket)
        recieverId = e.target.dataset.id
        convoOpen = true;
    }
})



// eto ung sa display ng list ng mga na message
// navigation for mobile
document.getElementById('messageButtonHeader').addEventListener('click', () => {
    openMessageWindow(loginUserId)
    messageNav()
})


// close message list
document.getElementById('closeMessageBody').addEventListener('click', (e) => {
    document.getElementById('messageBody').style.display = 'none'
})

//close convo
document.getElementById('closeconversationBody').addEventListener('click', (e) => {
    document.getElementById('conversationBody').style.display = 'none'
    convoOpen = false;

})

// send messages
const sendNewMessageInput = document.getElementById('sendNewMessageInput')
document.getElementById('sendNewMessageButton').addEventListener('click', async () => {
    sendThisMessage(sendNewMessageInput.value, recieverId, loginUserId, loginUsername, loginProfileimage, socket)
    emojiOnOff = !emojiOnOff
})



// ready to transfer code
socket.on('displayNewMessageRealtime', ({ newRecieverId, senderId, senderImage, senderMessage, senderUsername }) => {
    const isMedia = senderMessage.match(/\.(mp4|webm|ogg|jpg|jpeg|png|gif|webp)$/i);
    if (isMedia) {
        const isImage = senderMessage.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        if (isImage) {
            if (recieverId == senderId) {
                if (convoOpen) {
                    socket.emit('seenThisMessage', { recieverId, loginUserId })
                }
                document.getElementById('conversations').innerHTML += `
             <div id="informationAndMessagesLeft" data-id="${senderId}">
                <img id="senderUserImageLeft" src="${senderImage}" alt="">
                <div id="textMessagesLeftImg">
                    <img id="sendfileMessage" src="${senderMessage}" alt="">
                </div>
            </div>
            `}
            scrollToBottom(chatBox)
            const fakeElement = document.querySelector(`#convoContent[data-id="${senderId}"]`)
            if (fakeElement) {
                const labelElementOnHistoryMessage = fakeElement.querySelector('#latestMessageInHistory')
                labelElementOnHistoryMessage.innerHTML = `${senderUsername}: <span>Sent File</span>`
            }
        } else {
            if (recieverId == senderId) {
                if (convoOpen) {
                    socket.emit('seenThisMessage', { recieverId, loginUserId })
                }
                document.getElementById('conversations').innerHTML += `
              <div id="informationAndMessagesLeft" data-id="${senderId}">
                        <img id="senderUserImageLeft" src="${senderImage}" alt="">
                        <div id="textMessagesLeftImg">
                            <video controls preload="metadata" loading="lazy" poster="assets/posterForVid.jpg" id="sendfileMessage" src="${senderMessage}"></video>
                        </div>
                </div>
            `
            }
            scrollToBottom(chatBox)
            const fakeElement = document.querySelector(`#convoContent[data-id="${senderId}"]`)
            if (fakeElement) {
                const labelElementOnHistoryMessage = fakeElement.querySelector('#latestMessageInHistory')
                labelElementOnHistoryMessage.innerHTML = `${senderUsername}: <span>Sent File</span>`
            }
        }
    } else {
        if (recieverId == senderId) {
            if (convoOpen) {
                socket.emit('seenThisMessage', { recieverId, loginUserId })
            }
            console.log('hahahaha eto ung na recieve sa socket')
            document.getElementById('conversations').innerHTML += `
             <div id="informationAndMessagesLeft" data-id="${senderId}">
                <img id="senderUserImageLeft" src="${senderImage}" alt="">
                <div id="textMessagesLeft">
                    <label id="textMessageDataLeft">${senderMessage}</label>
                </div>
            </div>
            `}
        scrollToBottom(chatBox)
        const fakeElement = document.querySelector(`#convoContent[data-id="${senderId}"]`)
        if (fakeElement) {
            const labelElementOnHistoryMessage = fakeElement.querySelector('#latestMessageInHistory')
            labelElementOnHistoryMessage.innerHTML = `${senderUsername}: <span>${senderMessage}</span>`
        }
    }
})

// ready to transfer code
socket.on('userSeenThisMessage', ({ testMessage, newRecieverId, newLoginUserId }) => {
    console.log('eto kapag na seen ng user', testMessage)
    if (convoOpen == true) {
        if (newRecieverId == loginUserId && newLoginUserId == recieverId) {
            console.log('gagana lang dapat to kapag ikaw ung pinagsendan ng message')
            const message = document.querySelectorAll('#seenLabel')
            console.log('eto ung element na may seenLabel ', message)
            for (let index = 0; index < message.length; index++) {
                message[index].innerHTML = 'seen'
            }

        }

    }



})




export const chatBox = document.getElementById('conversations');
export function scrollToBottom(chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
}

export function scrollToBottomImage(chatBox) {
    const allMedia = chatBox.querySelectorAll('img, video');
}


sendNewMessageInput.addEventListener('focus', () => {
    setTimeout(() => {
        scrollToBottom(chatBox)
    }, 500);

})


// like button and send button toggle
sendNewMessageInput.addEventListener('input', () => {
    sendButtonToggle()

})
function sendButtonToggle() {
    if (sendNewMessageInput.value == '') {
        document.getElementById('sendNewMessageButton').style.display = 'none'
        document.getElementById('sendLikeMessage').style.display = 'flex'
    } else {
        document.getElementById('sendNewMessageButton').style.display = 'flex'
        document.getElementById('sendLikeMessage').style.display = 'none'
    }
}

document.getElementById('sendLikeMessage').addEventListener('click', () => {
    sendThisMessage('👍', recieverId, loginUserId, loginUsername, loginProfileimage, socket)
})


document.getElementById('submitMessageSearch').addEventListener('click', () => {
    searchNav()
})


document.addEventListener('click', (e) => {
    console.log(e.target)
})


const inputFileMessage = document.getElementById('inputFileMessage')
const ImgPreviewFile = document.getElementById('ImgPreviewFile')
const ImgPreview = document.getElementById('ImgPreview')
let selectedFileMessage;
document.getElementById('sendImageMessage').addEventListener('click', () => {
    inputFileMessage.click();
})


inputFileMessage.addEventListener('change', (e) => {
    ImgPreview.innerHTML = ''
    console.log('meron ng data na nakalaman')
    selectedFileMessage = inputFileMessage.files[0];
    console.log(selectedFileMessage)
    const previewOfFileSelected = URL.createObjectURL(selectedFileMessage)
    if (selectedFileMessage.type == 'video/mp4') {
        const ImgPreviewFile = document.createElement('video')
        ImgPreviewFile.controls = true
        ImgPreviewFile.maxWidth = '100%'
        ImgPreviewFile.preload = 'metadata'
        ImgPreviewFile.src = previewOfFileSelected
        ImgPreview.append(ImgPreviewFile)

    } else {
        const ImgPreviewFile = document.createElement('img')
        ImgPreviewFile.src = previewOfFileSelected
        ImgPreview.append(ImgPreviewFile)

    }

    document.getElementById('fileImageWantToSendPreview').style.display = 'flex'
})

document.getElementById('closePreviewInSendMessage').addEventListener('click', () => {
    document.getElementById('fileImageWantToSendPreview').style.display = 'none'
    inputFileMessage.value = ''
})

document.getElementById('sendThisFileMessage').addEventListener('click', () => {
    sendFileAsMessage(selectedFileMessage, loginUsername, loginUserId, recieverId, loginProfileimage, socket)
})



let emojiOnOff = false;
document.getElementById('sendEmojiMessage').addEventListener('click', () => {
    emojiOnOff = !emojiOnOff
    emojiOnOff ? (document.getElementById('emojiList').style.display = 'flex') :
        (document.getElementById('emojiList').style.display = 'none')

})
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    console.log(e.detail.unicode)
    sendNewMessageInput.value += e.detail.unicode
    sendButtonToggle()
});




document.getElementById('closeNotification').addEventListener('click', () => {
    document.getElementById('notificationBody').style.display = 'none'
})


document.addEventListener('click', (e) => {
    if (e.target.matches('#markReadThisNotif')) {
        console.log('eto kapag na click mo ung mark read')
        markReadThisNotif(e.target.dataset.id)
    }

})
