module.exports = (statusCode, msg) => {
    console.log("step 1 create error")
    const error = new Error(msg)
    error.statusCode = statusCode

    throw(error)
}