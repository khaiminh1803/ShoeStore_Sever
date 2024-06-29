const userModel = require('./Model')
const bcrypt = require('bcryptjs')

const register = async (email, password, name) => {
    try {
        let user = await userModel.findOne({ email })
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            await userModel.create({
                email,
                password: hash,
                name,
            })
            return true
        }
    } catch (error) {
        console.log('User service register error: ', error)
    }
    return false
}

// kiểm tra email, password
// kiểm tra email có trong database không 
// nếu có, kiểm tra password
// nếu password đúng, trả về thông tin user
// nếu password sai, trả về null
const login = async (email, password) => {
    try {
        let user = await userModel.findOne({ email })
        if (user) {
            const isMatch = bcrypt.compareSync(password, user.password)
            return isMatch ? user : false
        }
    } catch (error) {
        console.log("User service login error: ", error)
    }
    return false
}

module.exports = { login, register }

