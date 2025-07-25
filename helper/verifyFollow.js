import { apiReq } from '../utils/fetchReq.js';


export async function verifyIfAlreadyfollow(followUserId, loginUserId) {
    const verifyFollow = await apiReq('/verifyIfAlreadyFollow', { followUserId: followUserId, userId: loginUserId })
    if (verifyFollow.ok) {
        return verifyFollow.data

    } else {
        console.log('errrrrrr')
        return null
    }

}