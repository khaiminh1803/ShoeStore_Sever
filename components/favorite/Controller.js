const favoriteModel = require('./Model')
const userModel = require('../user/Model')
const productModel = require('../product/Model')

const getFavoriteByUserId = async (userId) => {
    try {
        const favorites = favoriteModel.find({ userId: userId }).populate('productId')
        return await favorites
    } catch (error) {
        console.log('Get favorites error: ', error);
        throw error;
    }
}

const addFavorite = async (userId, productId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const existingFavorite = await favoriteModel.findOne({ userId, productId });
        if (existingFavorite) {
            throw new Error('Product has been added');
        }
        const favorite = await favoriteModel.create({
            userId,
            productId
        });

        // Populating dữ liệu
        return await favorite.populate('productId'); 

    } catch (error) {
        console.log('Add favorite error: ', error);
        throw error;
    }
}


module.exports = { getFavoriteByUserId, addFavorite }