import { apiReq } from '../../utils/fetchReq.js';
import { verifyIfAlreadyfollow } from '../../helper/index.js'
export default async function visitProfile(myUserId, elementUserId) {
    document.getElementById('showFollowersBody').style.display = 'none'
    document.getElementById('showFollowersContent').innerHTML = ''
    document.getElementById('imgGrid').innerHTML = ''
    document.getElementById('visitimgGrid').innerHTML = ''
    document.getElementById('profileBody').style = 'display:none'
    document.getElementById('visitprofileBody').style = 'display:none'

    console.log(myUserId)
    console.log(elementUserId)
    if (myUserId == elementUserId) {
        document.getElementById('profileBody').style = 'display:block'
        console.log('dine ung logic kapag ung ivivisit mo is ung profile mo')
        viewProfile(myUserId)
    } else {
        document.getElementById('visitprofileBody').style.display = 'block'
        const visitOtherProfile = await apiReq('/visitOtherProfile', { userId: elementUserId })
        if (visitOtherProfile.ok) {
            const alreadyFollowData = await verifyIfAlreadyfollow(elementUserId, myUserId);
            alreadyFollowData.alreadyFollow == true ? (document.getElementById('visitprofileFollow').textContent = 'unfollow',
                document.getElementById('visitprofileFollow').dataset.userid = elementUserId) :
                (document.getElementById('visitprofileFollow').textContent = 'follow',
                    document.getElementById('visitprofileFollow').dataset.userid = elementUserId
                )
            // main content information
            console.log(visitOtherProfile.data.result)
            document.getElementById('visitprofileName').textContent = visitOtherProfile.data.result.username
            document.getElementById('visitchangeProfile').src = visitOtherProfile.data.result.profileImage
            document.getElementById('visitFollowerCount').textContent = visitOtherProfile.data.result.follower
            document.getElementById('visitfollowingCount').textContent = visitOtherProfile.data.result.following
            document.getElementById('visitbioInProfile').textContent = visitOtherProfile.data.result.bio

            // about content information
            document.getElementById('visitusernameInAboutUser').textContent = visitOtherProfile.data.result.username
            document.getElementById('visitemailInAboutUser').textContent = visitOtherProfile.data.result.email
            document.getElementById('visitaddressInAboutUser').textContent = visitOtherProfile.data.result.address
            document.getElementById('visitageInAboutUser').textContent = visitOtherProfile.data.result.age


            // inserting image to main element for actions/ meaning if i click that element, it has data  id of that user
            document.getElementById('visitprofileName').dataset.userid = elementUserId
            document.getElementById('visitchangeProfile').dataset.userid = elementUserId
            document.getElementById('visitfollowerBody').dataset.userid = elementUserId
            document.getElementById('visitfollowingBody').dataset.userid = elementUserId

            const viewProfileReq = await apiReq('/viewProfileReq', { userId: elementUserId })
            if (viewProfileReq.ok) {
                viewProfileReq.data.result.forEach(element => {
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
            document.getElementById('visitPostCount').textContent = viewProfileReq.data.result.length
        }
        else {
            console.log('may error sa pag visit')
        }
    }
}





export async function viewProfile(myUserId) {
    const viewProfileReq = await apiReq('/viewProfileReq', { userId: myUserId })
    if (viewProfileReq.ok) {
        console.log('eto ung data sa profile')
        viewProfileReq.data.result.forEach(element => {
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

        document.getElementById('postsCount').textContent = viewProfileReq.data.result.length

    }
}