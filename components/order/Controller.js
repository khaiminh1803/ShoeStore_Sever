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
        return order; 
    } catch (error) {
        console.error('Lỗi khi tạo hóa đơn:', error.message);
        throw error; 
    }
}

module.exports = {createOrder}