
class CustomAPIError extends Error {
    constructor(message, statusCode,status,validCheck) {
        super()
        this.statusCode = statusCode
        this.status =status
        this.message=message
        this.validCheck=validCheck
    }
}

const createCustomError = (msg, statusCode,status,validCheck) => {
    console.log("inside======",status)
    return new CustomAPIError(msg,statusCode,status,validCheck)
}

module.exports = { createCustomError, CustomAPIError }