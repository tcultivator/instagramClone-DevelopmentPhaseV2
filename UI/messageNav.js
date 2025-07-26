export default function messageNav() {
    document.getElementById('listOfconvoBody').innerHTML = ''
    document.getElementById('messageBody').style.display = 'flex'
    document.getElementById('messageBody').style.zIndex = 1
    document.getElementById('profileBody').style = 'display:none'
    document.getElementById('visitprofileBody').style = 'display:none'
    document.getElementById('createPost').style.display = 'none'
    document.getElementById('updateProfilePic').style.display = 'none'
    document.getElementById('viewPostBody').style.display = 'none'
    document.getElementById('searchBody').style.display = 'none'
    document.getElementById('conversationBody').style.display = 'none'
}