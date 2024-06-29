var express = require('express');
var router = express.Router();
const userController = require ('../components/user/Controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// http://localhost:3000/login
// hiển thị trang login
router.get('/login' ,async function(req, res, next) {
  res.render('user/login');
});

router.post('/login', async function(req, res, next) {
  try {
    const {email, password} = req.body
    const result = await userController.login(email, password)
    if(result){
      // khi login thành công
      // tạo token,lưu token vào session 
      // const token = jwt.sign({},'secret', {expiresIn: '1h'})
      // req.session.token = token
      return res.redirect('/')
    }else{
      return res.redirect('/login')
    }
  } catch (error) {
    console.log('Login failed: ', error);
    return res.redirect('/login')
  }
});


module.exports = router;
