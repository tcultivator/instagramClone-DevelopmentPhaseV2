import { apiReq } from "../../utils/fetchReq.js"

export default async function displayAllStoryViewer() {
    console.log('View count clicked')

    // Get ID safely
    const countBtn = document.getElementById('storyViewCount');
    if (!countBtn) return;
    const storyId = countBtn.dataset.id;

    // Reset Content
    document.getElementById('viewerContent').innerHTML = '';

    // Show Modal
    const viewerListModal = document.getElementById('storyViewerList');
    viewerListModal.style.display = 'block'; // Triggers CSS flex rule

    const getAllStoryViewer = await apiReq('/getAllStoryViewer', { storyId: storyId })

    if (getAllStoryViewer.ok) {
        console.log(getAllStoryViewer.data)

        // Handle empty state
        if (getAllStoryViewer.data.length === 0) {
            document.getElementById('viewerContent').innerHTML = `
                <div style="text-align: center; padding: 40px; color: #8e8e8e; font-size: 14px;">
                    No views yet.
                </div>
            `;
            return;
        }

        getAllStoryViewer.data.forEach(element => {
            let reactionsIcon = '';
            if (element.reactions != null) {
                try {
                    const parseReactionIcon = JSON.parse(element.reactions)
                    reactionsIcon = parseReactionIcon.join('') // Join without spaces for tight emoji cluster
                } catch (e) {
                    console.error("Error parsing reactions", e);
                }
            }

            // Updated HTML Structure for CSS Styling
            document.getElementById('viewerContent').innerHTML += `
                <div class="viewer-row" data-id="${element.id}">
                    <div class="viewer-info">
                        <img src="${element.secure_url}" alt="${element.username}">
                        <label>${element.username}</label>
                    </div>

                    <div class="viewer-reactions">
                       ${reactionsIcon}
                    </div>
                </div>
            `
        })
    } else {
        console.log('Error fetching viewers');
    }
}