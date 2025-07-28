
import { getStoryViewCount } from './getStoryViewCountHandler.js'

export default function viewStory(targetElement, loginUserId, loginUsername, loginProfileimage) {
    const idOfElemt = targetElement.dataset.id;
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
        getStoryViewCount(idOfElemt, loginUserId, loginUsername, loginProfileimage)

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
        getStoryViewCount(idOfElemt, loginUserId, loginUsername, loginProfileimage)
    }
}