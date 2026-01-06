import { apiReq } from '../utils/fetchReq.js';
import { verifyIfAlreadyfollow } from '../helper/index.js'

export async function autoSearch(searchValue, loginUserId) {
    if (searchValue) {
        const autoSearch = await apiReq('/autoSearch', {
            searchValue: searchValue
        })
        if (autoSearch.ok) {
            document.getElementById('searchLoadingMessage').style.display = 'none'

            const autoSearchResult = await Promise.all(
                autoSearch.data.data.map(async element => {
                    const alreadyFollowData = await verifyIfAlreadyfollow(element.id, loginUserId);

                    // Style buttons nicely
                    const followBtn = alreadyFollowData.alreadyFollow == true ? (
                        `<button id="followBtnInSearch" style="background:#efefef; color:black;" data-userid="${element.id}">Following</button>`
                    ) : (`<button id="followBtnInSearch" style="background:#0095f6; color:white;" data-userid="${element.id}">Follow</button>`)

                    const isYou = element.id == loginUserId ? (``) :
                        (` 
                        ${followBtn}`) // Simplified to just follow button for search, or add Message if you prefer

                    // Added a sub-label for "Name" to look more populated
                    return `
                    <div id="contentsOfSearchResults" data-id="${element.id}">
                            <div id="resultsDetails">
                                <img id="resultsDetailsImg" src="${element.profileImage}" alt="" data-id="${element.id}">
                                <div style="display:flex; flex-direction:column; justify-content:center;">
                                    <label id="resultsDetailsUsername" style="cursor:pointer;" data-id="${element.id}">${element.username}</label>
                                    <span style="font-size:12px; color:#8e8e8e;">${element.username}</span> 
                                </div>
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
            document.getElementById('searchLoadingMessage').textContent = "No results found."
            document.getElementById('searchLoadingMessage').style.display = 'block'
            document.getElementById('searchResultsBody').innerHTML = ``
        }
    } else {
        document.getElementById('searchResultsBody').innerHTML = ``
        document.getElementById('searchLoadingMessage').style.display = 'none'
    }
}

export async function submitSearch(searchValue, loginUserId) {
    // Exact same logic as above, just ensuring consistent UI
    document.getElementById('clickSound').play();
    if (searchValue) {
        const search = await apiReq('/search', {
            searchValue: searchValue
        })
        if (search.ok) {
            document.getElementById('searchLoadingMessage').style.display = 'none'

            const searchResults = await Promise.all(
                search.data.data.map(async element => {
                    const alreadyFollowData = await verifyIfAlreadyfollow(element.id, loginUserId);

                    const followBtn = alreadyFollowData.alreadyFollow == true ? (
                        `<button id="followBtnInSearch" style="background:#efefef; color:black;" data-userid="${element.id}">Following</button>`
                    ) : (`<button id="followBtnInSearch" style="background:#0095f6; color:white;" data-userid="${element.id}">Follow</button>`)

                    const isYou = element.id == loginUserId ? (``) :
                        (`${followBtn}`)

                    return `
                    <div id="contentsOfSearchResults" data-id="${element.id}">
                            <div id="resultsDetails">
                                <img id="resultsDetailsImg" src="${element.profileImage}" alt="" data-id="${element.id}">
                                <div style="display:flex; flex-direction:column; justify-content:center;">
                                    <label id="resultsDetailsUsername" style="cursor:pointer;" data-id="${element.id}">${element.username}</label>
                                    <span style="font-size:12px; color:#8e8e8e;">User</span>
                                </div>
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
            document.getElementById('searchLoadingMessage').textContent = "No results found."
            document.getElementById('searchLoadingMessage').style.display = 'block'
            document.getElementById('searchResultsBody').innerHTML = ``
        }
    }
}