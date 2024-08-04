const userModel = require('./Model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const sendVerificationCode = async (email) => {
    try {
        // Tạo code ngẫu nhiên 6 chữ số
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        // Cập nhật user với verification code
        await userModel.updateOne({ email }, { verificationCode });
        // Gửi email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Your verification code',
            text: `Your verification code is ${verificationCode}.`
        };
        await transporter.sendMail(mailOptions);
        console.log('Verification code sent');
    } catch (error) {
        console.log('Error sending verification code:', error);
    }
};

const register = async (email, password, name, address, phonenumber, avatar, role) => {
    try {
        let user = await userModel.findOne({ email })
        if (!user) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            await userModel.create({
                email,
                password: hash,
                name,
                address,
                phonenumber,
                avatar,
                role
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

// update profile
const updateProfile = async (id, name, email, address, phonenumber, avatar, role) => {
    try {
        const user = await userModel.findById(id)
        if (user) {
            user.name = name ? name : user.name
            user.email = email ? email : user.email
            user.address = address ? address : user.address
            user.phonenumber = phonenumber ? phonenumber : user.phonenumber
            user.avatar = avatar ? avatar : user.avatar
            user.role = role ? role : user.role
            await user.save()
            return user
        }
    } catch (error) {
        console.log('Update profile error: ', error);
    }
    return false
}

// danh sách user
const getAllUsers = async () => {
    try {
        return await userModel.find()
    } catch (error) {
        console.log('Get all users error: ', error);
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        return userModel.findById(id)
    } catch (error) {
        console.log('Get user by id error', error);
        return null
    }
}

const deleteUserById = async (id) => {
    try {

        await userModel.findByIdAndDelete(id)
        return true
    }
    catch (error) {
        console.log('Delete user error: ', error);
        throw error;
    }
    return false;
}

// update sản phẩm
const updateUser = async (id, name, email, address, phonenumber, avatar) => {
    try {
        const user = await userModel.findById(id)
        if (user) {

            user.name = name ? name : user.name
            user.email = email ? email : user.email
            user.address = address ? address : user.address
            user.phonenumber = phonenumber ? phonenumber : user.phonenumber
            user.avatar = avatar ? avatar : user.avatar
            await item.save()
            return true
        }
    } catch (error) {
        console.log('Update user error: ', error);
    }
    return false
}
module.exports = { login, register, updateProfile, getAllUsers, getUserById, deleteUserById, updateUser }

