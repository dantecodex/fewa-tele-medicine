const apiResponseHandler = (message = '', data = null, success = true) => {
    return {
        success,
        message,
        data
    }
}


export default apiResponseHandler
