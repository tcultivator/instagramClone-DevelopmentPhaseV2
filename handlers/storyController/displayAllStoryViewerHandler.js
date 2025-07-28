import { apiReq } from "../../utils/fetchReq.js"

export default async function displayAllStoryViewer() {
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
            if (element.reactions != null) {
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
