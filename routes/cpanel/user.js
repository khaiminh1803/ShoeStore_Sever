var express = require('express');
var router = express.Router();
const uploadFile = require('../../middle/UploadFile')
const CONFIG = require('../../config/Config')
const userController = require('../../components/user/Controller');
const { authenUserPermission } = require('../../middle/Authen');
// http://localhost:3000/cpanel/users

// http://localhost:3000/cpanel/users
router.get('/', async function (req, res, next) {
    try {
        const users = await userController.getAllUsers();
        res.render('user/listUser', { users })
    } catch (error) {

    }
});

// xóa user theo id
// http://localhost:3000/cpanel/users/:id/delete
router.get('/:id/delete',[authenUserPermission], async function (req, res, next) {
    try {
        const { id } = req.params
        const result = await userController.deleteUserById(id)
        return res.json({ result })
    } catch (error) {
        return res.json({ result: false })
    }
});

// http://localhost:3000/cpanel/users/new
// hiển thị trang thêm mới user
router.get('/new', async (req, res, next) => {
    try {
        res.render('user/addUser')
    } catch (error) {
        next(error);
    }
})

// http://localhost:3000/cpanel/users/new
// xử lý trang thêm mới user
router.post('/new', uploadFile.single('image'), async (req, res, next) => {
    try {
        // ipconfig
        let { body, file } = req
        if (file) {
            let image = `${CONFIG.CONSTANTS.IP}images/${file.filename}`
            body = { ...body, avatar: image }
        }
        let { name, email, password, address, phonenumber, avatar } = body
        console.log('>>>> Add params: ', name, email, password, address, phonenumber, avatar);
        await userController.register(email, password, name, address, phonenumber, avatar)
        return res.redirect('/cpanel/users')
    } catch (error) {
        console.log('Add new product error', error);
        next(error);
    }
})

// http://localhost:3000/cpanel/users/:id/edit
// hiển thị trang cập nhật user
router.get('/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await userController.getUserById(id)
        res.render('user/editUser', { user})
    } catch (error) {
        next(error);
    }
})

// http://localhost:3000/cpanel/users/:id/edit
// xử lý trang cập nhật user
router.post('/:id/edit', uploadFile.single('image'), async (req, res, next) => {
    try {
        // ipconfig
        let { id } = req.params
        let { body, file } = req
        if (file) {
            let image = `${CONFIG.CONSTANTS.IP}images/${file.filename}`
            body = { ...body, avatar: image }
        }
        let { name, email, password, address, phonenumber, avatar } = body
        console.log('>>>> Edit params: ', name, email, password, address, phonenumber, avatar);
        await userController.updateProfile(id, name, email, address, phonenumber, avatar)
        return res.redirect('/cpanel/users')
    } catch (error) {
        console.log('Update product error', error);
        next(error);
    }
})





module.exports = router;