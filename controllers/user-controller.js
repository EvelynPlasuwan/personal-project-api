exports.listUsers = async (req ,res ,next) => {
    try {
        res.json({ message: "Hello, List Users"})

    } catch (error) {
        next(error)
    }
}

exports.updateRole = async(req ,res, next) => {
    try {
        res.json({ message: "Hello, Update Role"})
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req ,res ,next) => {
    try {
        res.json({ message: "Hello, Delete User"})
    } catch (error) {
        next(error)
    }
}