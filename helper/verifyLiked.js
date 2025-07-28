import { apiReq } from "../utils/fetchReq.js";
export default async function verifyIfAlreadyLike(postId, loginUserId) {
    const verifyLike = await apiReq('/verifyIfAlreadyLike', { postId: postId, userId: loginUserId })
    if (verifyLike.ok) {
        return verifyLike.data

    } else {
        console.log('errrrrrr')
        return null
    }

}