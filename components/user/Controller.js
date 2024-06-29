
const userService = require('./Service')

const login = async (email, password) => {
    try {
        return await userService.login(email,password)
    } catch (error) {
        console.log('User controller login error: ' , error);
    }
}

const register = async (email, password,name) => {
    try {
        return await userService.register(email,password,name)
    } catch (error) {
        console.log('User controller register error: ' , error);
    }
}



module.exports = {login,register}