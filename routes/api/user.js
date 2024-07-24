var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const userController = require('../../components/user/Controller')
const { checkRegister } = require('../../middle/Validation')
const uploadFile = require('../../middle/UploadFile')
const CONFIG = require('../../config/Config')
// http://localhost:3000/api/users

// http://localhost:3000/api/users/login
router.post('/login', async function (req, res, next) {
  try {
    const { email, password, name } = req.body
    const user = await userController.login(email, password, name)
    if (user) {
      // tạo token
      const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' })
      const returnData = {
        error: false,
        responseTimestamp: new Date(),
        statusCode: 200,
        data: {
          token: token,
          user: user
        }
      }
      return res.status(200).json(returnData)
    } else {
      return res.status(400).json({ result: false, user: null })
    }
  } catch (error) {
    return res.status(500).json({ result: false, user: null })
  }
});

// http://localhost:3000/api/users/register
router.post('/register', [checkRegister], async function (req, res, next) {
  try {
    const { email, password, name } = req.body
    const user = await userController.register(email, password, name)
    // xoa email đi là xong
    if (user) {
      res.status(200).json({ result: true, user })
    } else {
      res.status(400).json({ result: false, user: null })
    }
  } catch (error) {
    res.status(500).json({ result: false, user: null })
  }
});

router.post('/upload', uploadFile.single('image'), async function (req, res, next) {
  try {
    const { file } = req
    if (!file) {
      res.status(400).json({ result: true, link: "" })
    } else {
      const url = `${CONFIG.CONSTANTS.IP}images/${file.filename}`
      res.status(200).json({ result: true, url: url })
    }
  } catch (error) {
    console.log('Upload image error: ', error);
    return res.json({ status: 500, link: "" })
  }
})

// update profile
router.post('/update-profile', async function (req, res, next) {
  try {
    const { id, name, email, address, phonenumber, avatar } = req.body
    const user = await userController.updateProfile(id, name, email, address, phonenumber, avatar)
    if (user) { 
      res.status(200).json({ result: true, user })
    } else {
      res.status(400).json({ result: false, user: null })
    }
  } catch (error) {
    res.status(500).json({ result: false, user: null })
  }
})

module.exports = router;
