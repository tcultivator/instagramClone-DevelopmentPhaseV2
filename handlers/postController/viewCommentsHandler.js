import { apiReq } from "../../utils/fetchReq.js";

export default async function viewComments(postIdOfyouwantToComment, loginUsername) {
    const loadingBar = document.getElementById('loadingBarInComment');
    const contentBody = document.getElementById('commentsContents');

    loadingBar.style.display = 'flex'; // Use flex to center spinner if css handles it
    contentBody.innerHTML = ''; // Clear previous

    const viewCommentInPost = await apiReq('/viewCommentInPost', { postId: postIdOfyouwantToComment })

    if (viewCommentInPost.ok) {
        console.log('Comments fetched successfully');
        const userComments = viewCommentInPost.data.result;

        if (userComments.length === 0) {
            contentBody.innerHTML = `
                <div style="text-align:center; padding: 20px; color:#8e8e8e;">
                    No comments yet.
                </div>`;
        }

        userComments.forEach(element => {
            // Instagram Style: Uniform look for everyone.
            // No blue background for "me".

            contentBody.innerHTML += `
                <div id="commentsOnPost">
                    <img src="${element.profileImage}" alt="User Avatar">
                    <div id="commentDetails">
                        <label id="userThatComment">${element.username}</label>
                        <label>${element.comment}</label>
                    </div>
                </div>
            `;
        });

        loadingBar.style.display = 'none';
    } else {
        console.log('Error fetching comments');
        loadingBar.style.display = 'none';
    }
}