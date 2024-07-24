
const userService = require('./Service')

const login = async (email, password) => {
    try {
        return await userService.login(email, password)
    } catch (error) {
        console.log('User controller login error: ', error);
    }
}

const register = async (email, password, name, address, phonenumber, avatar) => {
    try {
        return await userService.register(email, password, name, address, phonenumber, avatar)
    } catch (error) {
        console.log('User controller register error: ', error);
    }
}

const updateProfile = async (id, name, email, address, phonenumber, avatar) => {
    try {
        return await userService.updateProfile(id, name, email, address, phonenumber, avatar)
    } catch (error) {
        console.log('Update product error', error);
    }
}

const getAllUsers = async () => {
    try {
        return await userService.getAllUsers()
    } catch (error) {
        console.log('Get all user failed', error);
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        return await userService.getUserById(id)
    } catch (error) {
        console.log('Update user error', error);
    }
}

const deleteUserById = async (id) => {
    try {
        return await userService.deleteUserById(id)
    } catch (error) {
        console.log('Delete user failed', error);
        throw false;
    }
}

const updateUser = async (id, name, email, address, phonenumber, avatar) => {
    try {
        return await userService.updateUser(id, name, email, address, phonenumber, avatar)
    } catch (error) {
        console.log('Update user error', error);
    }
}

module.exports = { login, register, updateProfile, getAllUsers, getUserById, deleteUserById }