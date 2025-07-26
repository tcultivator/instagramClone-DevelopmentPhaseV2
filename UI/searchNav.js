export default function searchNav() {
    document.getElementById('searchBody').style.zIndex = 1
    document.getElementById('searchBody').style.display = 'block'
    document.getElementById('createPost').style.display = 'none'
    document.getElementById('profileBody').style = 'display:none'
    document.getElementById('messageBody').style.zIndex = 0
    document.getElementById('updateProfilePic').style.display = 'none'
    document.getElementById('visitprofileBody').style = 'display:none'
    document.getElementById('conversationBody').style.display = 'none'
}