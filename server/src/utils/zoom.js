import redis from "../config/redis.config.js"
import zoomConfig from "../config/zoom.config.js";
import CustomError from "./customErrorHandler.js";

const getZoomAccessToken = async () => {
    const cachedToken = await redis.get('zoom_access_token')

    if (cachedToken) return cachedToken

    const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomConfig.ZOOM_ACCOUNT_ID}`;
    const auth = Buffer.from(`${zoomConfig.ZOOM_CLIENT_ID}:${zoomConfig.ZOOM_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
        },
    });

    if (!response.ok) {
        throw new CustomError(`Failed to get access token: ${response.status} ${await response.text()}`, 400);
    }


    const data = await response.json()
    const accessToken = data.access_token;

    await redis.set('zoom_access_token', accessToken, 'EX', 3500);
    return accessToken

}

const createZoomMeeting = async () => {

    const token = await getZoomAccessToken()

    const userId = 'me'
    const url = `https://api.zoom.us/v2/users/${userId}/meetings`;

    const meetingDetails = {
        topic: 'Test Meeting',
        type: 2,
        start_time: Date.now().toLocaleString(),
        duration: 30,
        timezone: 'UTC',
        settings: {
            host_video: true,
            participant_video: true,
            waiting_room: true
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingDetails),
    });

    if (!response.ok) {
        throw new CustomError(`Failed to create meeting: ${response.status} ${await response.text()}`, 400);
    }

    const meetingData = await response.json();
    // console.log('Created meeting:', meetingData);
    return meetingData.join_url;
}

export default createZoomMeeting