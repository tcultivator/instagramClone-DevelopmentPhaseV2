import { apiReq } from "../../utils/fetchReq.js"


export default async function getAllStories(loginProfileimage) {
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