import createZoomMeeting from "../utils/zoom.js"

const createMeeting = async () => {
  return await createZoomMeeting()
}

export default {
  createMeeting,
}
