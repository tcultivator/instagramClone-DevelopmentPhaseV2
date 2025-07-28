import { apiReq } from '../utils/fetchReq.js';
import { verifyIfAlreadyfollow } from '../helper/index.js'
export async function autoSearch(searchValue, loginUserId) {
    if (searchValue) {

        const autoSearch = await apiReq('/autoSearch', {
            searchValue: searchValue
        })
        if (autoSearch.ok) {
            document.getElementById('searchLoadingMessage').style.display = 'none'
            console.log(autoSearch.data.data)
            const autoSearchResult = await Promise.all(
                autoSearch.data.data.map(async element => {
                    const alreadyFollowData = await verifyIfAlreadyfollow(element.id, loginUserId);
                    const followBtn = alreadyFollowData.alreadyFollow == true ? (
                        `<button id="followBtnInSearch" data-userid="${element.id}">unfollow</button>`
                    ) : (`<button id="followBtnInSearch" data-userid="${element.id}">follow</button>`)
                    const isYou = element.id == loginUserId ? (``) :
                        (` <button id="messageThisUserInSearch" data-id="${element.id}">Message</button>
                        ${followBtn}`)
                    return `
            <div id="contentsOfSearchResults" data-id="${element.id}">
                    <div id="resultsDetails">
                        <img id="resultsDetailsImg" src="${element.profileImage}" alt="" data-id="${element.id}">
                        <label id="resultsDetailsUsername" data-id="${element.id}">${element.username}</label>
                    </div>
                    <div id="resultsControl">
                       ${isYou}
                    </div>
            </div>
            `
                })
            )

            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            ${autoSearchResult.join('')}
            </div>
            `
        } else {
            document.getElementById('searchLoadingMessage').textContent = autoSearch.data.message
            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            
            </div>
            `
        }
    } else {
        document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            
            </div>
            `
        document.getElementById('searchLoadingMessage').style.display = 'none'
    }

}



export async function submitSearch(searchValue, loginUserId) {
    if (searchValue) {
        const search = await apiReq('/search', {
            searchValue: searchValue
        })
        if (search.ok) {
            document.getElementById('searchLoadingMessage').style.display = 'none'
            console.log(search.data.data)
            const searchResults = await Promise.all(
                search.data.data.map(async element => {
                    const alreadyFollowData = await verifyIfAlreadyfollow(element.id, loginUserId);
                    const followBtn = alreadyFollowData.alreadyFollow == true ? (
                        `<button id="followBtnInSearch" data-userid="${element.id}">unfollow</button>`
                    ) : (`<button id="followBtnInSearch" data-userid="${element.id}">follow</button>`)
                    const isYou = element.id == loginUserId ? (``) :
                        (` <button id="messageThisUserInSearch" data-id="${element.id}">Message</button>
                        ${followBtn}`)
                    return `
            <div id="contentsOfSearchResults" data-id="${element.id}">
                    <div id="resultsDetails">
                        <img id="resultsDetailsImg" src="${element.profileImage}" alt="" data-id="${element.id}">
                        <label id="resultsDetailsUsername" data-id="${element.id}">${element.username}</label>
                    </div>
                    <div id="resultsControl">
                       ${isYou}
                    </div>
            </div>
            `
                })
            )

            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            ${searchResults.join('')}
            </div>
            `
        } else {
            document.getElementById('searchLoadingMessage').textContent = search.data.message
            document.getElementById('searchResultsBody').innerHTML = `
            <div id="searchResults">
            
            </div>
            `
        }
    }
}

