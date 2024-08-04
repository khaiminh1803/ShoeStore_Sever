const orderModel = require('./Model')
const cartModel = require('../cart/Model')

const createOrder = async (userId, email, phonenumber, shippingAddress, selectedItems, paymentMethod, totalPrice, voucherId) => {
    try {
        // Tạo một đối tượng Order mới
        const order = await orderModel.create({
            userId: userId,
            email,
            phoneNumber: phonenumber,
            shippingAddress,
            items: selectedItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                sizeSelected: item.sizeSelected,
            })),
            totalPrice,
            paymentMethod: paymentMethod,
            status: 'pending',
            voucherId: voucherId,
            orderDate: new Date(),
        });
        await cartModel.findOneAndDelete({ userId });
        return order.populate('items.product', 'price image name');; 
    } catch (error) {
        console.error('Lỗi khi tạo hóa đơn:', error.message);
        throw error; 
    }
}
const getAllOrder = async () => {
    try {
        const orders= orderModel.find().populate('items.product', 'price image name');
        return orders
    } catch (error) {
        console.error('Get all order failed:', error.message);
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

// update sản phẩm
const updateOrder = async (id,phoneNumber, shippingAddress, status ) => {
    try {

        const item = await orderModel.findById(id)
        if (item) {
            item.phoneNumber = phoneNumber !== undefined ? phoneNumber : item.phoneNumber;
            item.shippingAddress = shippingAddress !== undefined ? shippingAddress : item.shippingAddress;
            item.status = status !== undefined ? status : item.status;
           

            // item.name = name ? name : item.name
            // item.price = price ? price : item.price
            // item.description = description ? description : item.description
            // item.image = image ? image : item.image
            // item.sizes = sizes ? sizes : item.sizes
            // item.brand = brand ? brand : item.brand
            // item.category = category ? category : item.category

        
            await item.save()
            return true
        }
    } catch (error) {
        console.log('Update order error: ', error);
    }
    return false
}

const getStatistics = async () => {
    try {
        const orders = await orderModel.find().populate('items.product', 'price');
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = orders.length;
        
        const monthlyRevenue = orders.reduce((acc, order) => {
            const month = new Date(order.orderDate).getMonth();
            acc[month] = (acc[month] || 0) + order.totalPrice;
            return acc;
        }, {});

        return { totalRevenue, totalOrders, monthlyRevenue };
    } catch (error) {
        console.error('Failed to get statistics:', error.message);
        throw error;
    }
};    

module.exports = {createOrder,getAllOrder,getAllOrderById, getOrderById, getStatistics, updateOrder}