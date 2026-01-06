export default function createPostNav() {
    document.getElementById('searchBody').style.display = 'none'
    document.getElementById('createPost').style.display = 'flex'
    document.getElementById('createPost').style.zIndex = 1
    document.getElementById('profileBody').style = 'display:none'
    document.getElementById('messageBody').style.display = 'none'
    document.getElementById('updateProfilePic').style.display = 'none'
    document.getElementById('visitprofileBody').style = 'display:none'
    document.getElementById('conversationBody').style.display = 'none'
    document.getElementById('notificationBody').style.display = 'none'
}