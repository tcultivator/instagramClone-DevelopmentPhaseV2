import { apiReq } from "../../utils/fetchReq.js";
import { storyControl } from "../../app.js";

export default async function sendStoryReaction(targetElement, selectedStoryId, loginUserId) {
    storyControl.reactionsClickLimit--;
    if (storyControl.reactionsClickLimit < 0) {
        console.log('reach max of reactions')
    } else {
        storyControl.reactionsArr.push(targetElement.outerHTML)

        if (targetElement.matches('#heartReact')) {
            document.getElementById('reactionsPopupIconheart').style.display = 'flex'

            setTimeout(() => {
                document.getElementById('reactionsPopupIconheart').style.display = 'none'

            }, 200);

        } else if (targetElement.matches('#hahaReact')) {
            document.getElementById('reactionsPopupIconhaha').style.display = 'flex'

            setTimeout(() => {
                document.getElementById('reactionsPopupIconhaha').style.display = 'none'

            }, 200);

        } else if (targetElement.matches('#likeReact')) {
            document.getElementById('reactionsPopupIconlike').style.display = 'flex'

            setTimeout(() => {
                document.getElementById('reactionsPopupIconlike').style.display = 'none'

            }, 200);

        }

    }


    clearTimeout(storyControl.reactionDelay)
    storyControl.reactionDelay = setTimeout(() => {
        console.log('natapos na ung timeout delay')
        console.log(storyControl.reactionsArr)
        const reactionData = JSON.stringify(storyControl.reactionsArr)
        setReactions(reactionData, selectedStoryId, loginUserId)
        storyControl.reactionsClickLimit = 7;
        storyControl.reactionsArr = []

    }, 1000);

}







async function setReactions(reactionsArr, selectedStoryId, loginUserId) {
    const sendStoryReactions = await apiReq('/sendStoryReactions', { reactionsArr: reactionsArr, selectedStoryId: selectedStoryId, loginUserId: loginUserId })
    if (sendStoryReactions.ok) {
        console.log('success sa pag send ng reactions ')
    } else {
        console.log('error sa pag send ng reactions')
    }
}