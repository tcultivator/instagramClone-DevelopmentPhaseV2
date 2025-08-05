import { apiReq } from "../../utils/fetchReq.js";

export default async function getMessageRequestCounts() {
    try {
        const getMessageReqCount = await apiReq('/getMessageRequestCounts')
        if (getMessageReqCount.ok) {
            console.log('success')
            document.getElementById('newMessReqIndicator').textContent = getMessageReqCount.data.resultCount;
        } else {
            console.log('error on message request')
        }
    } catch (err) {
        console.log('request error on getting message request count')
    }
}