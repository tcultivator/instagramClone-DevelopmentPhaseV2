export default function profileNav() {
    document.getElementById('imgGrid').innerHTML = ''
    document.getElementById('searchBody').style.display = 'none'
    document.getElementById('createPost').style.display = 'none'
    document.getElementById('profileBody').style = 'display:block'
    document.getElementById('profileBody').style.zIndex = 1
    document.getElementById('messageBody').style.display = 'none'
    document.getElementById('updateProfilePic').style.display = 'none'
    document.getElementById('visitprofileBody').style = 'display:none'
    document.getElementById('conversationBody').style.display = 'none'
    document.getElementById('notificationBody').style.display = 'none'
}