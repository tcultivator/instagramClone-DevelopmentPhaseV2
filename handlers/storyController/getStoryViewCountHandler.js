import { apiReq } from "../../utils/fetchReq.js"
export async function getStoryViewCount(idOfElemt, loginUserId, loginUsername, loginProfileimage) {

    const getViewCount = await apiReq('/getStoryViewCount', {
        idOfElemt: idOfElemt,
        userId: loginUserId,
        username: loginUsername,
        profileImage: loginProfileimage
    })
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