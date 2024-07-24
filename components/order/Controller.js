const orderModel = require('./Model')
const cartModel = require('../cart/Model')

const createOrder = async (userId, email, phonenumber, shippingAddress, selectedItems, paymentMethod, totalPrice) => {
    try {
        // Tạo một đối tượng Order mới
        const order = await orderModel.create({
            userId: userId,
            email,
            phonenumber,
            shippingAddress,
            items: selectedItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                sizeSelected: item.sizeSelected,
            })),
            totalPrice,
            paymentMethod: paymentMethod,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await cartModel.findOneAndDelete({ userId });
        return order.populate('items.product', 'price image name');; 
    } catch (error) {
        console.error('Lỗi khi tạo hóa đơn:', error.message);
        throw error; 
    }
}

const getAllOrderById = async (userId) => {
    try {
        const orders = await orderModel.find({ userId: userId }).populate('items.product', 'price image name');
        return orders
    } catch (error) {
        console.error('Get order user failed:', error.message);
        throw error; 
    }
}

const getOrderById = async (id) => {
    try {
        const order = await orderModel.findById(id).populate('items.product', 'price image name');
        return order
    } catch (error) {
        console.error('Get order failed:', error.message);
        throw error; 
    }
}

module.exports = {createOrder,getAllOrderById, getOrderById}