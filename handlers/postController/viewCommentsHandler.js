import { apiReq } from "../../utils/fetchReq.js";
export default async function viewComments(postIdOfyouwantToComment, loginUsername) {
    document.getElementById('loadingBarInComment').style.display = 'block'
    document.getElementById('commentsContents').innerHTML = ''
    const viewCommentInPost = await apiReq('/viewCommentInPost', { postId: postIdOfyouwantToComment })
    if (viewCommentInPost.ok) {
        console.log('success sa pagkuha sa comment')
        console.log(viewCommentInPost.data.result)
        const userComments = viewCommentInPost.data.result
        userComments.forEach(element => {
            const labelComments = element.username == loginUsername ? (
                `
                    <div id="commentDetails" style="background-color:#1C6CFF; color:white">
                        <label id="userThatComment" style="color:white">${element.username}</label>
                        <label for="">${element.comment}</label>
                    </div>
                `
            ) :
                (
                    `
                   
                    <div id="commentDetails">
                        <label id="userThatComment">${element.username}</label>
                        <label for="">${element.comment}</label>
                    </div>
                
                    `
                )
            document.getElementById('commentsContents').innerHTML += `
                <div id="commentsOnPost">
                <img src="${element.profileImage}" alt="">
                    ${labelComments}
                </div>
                `
        })
        document.getElementById('loadingBarInComment').style.display = 'none'
    } else {
        console.log('error sa pagkuha')
    }
}