

export async function apiReq(endpoint, body) {
    try {
        const req = await fetch('https://instagramclone-developmentphasev2.onrender.com' + endpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const data = await req.json()
        return {
            ok: req.ok,
            status: req.status,
            data: data
        }
    }
    catch (err) {
        console.log('error')
        return {
            status: 401,
            ok: false,
        }
    }
}
