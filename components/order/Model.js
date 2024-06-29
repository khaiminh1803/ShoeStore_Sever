
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderDetailSchema = new Schema(
    {
        product: { type: ObjectId, ref: 'product', required: true }, // Tham chiếu sản phẩm bắt buộc
        quantity: { type: Number, default: 1, min: 1 }, // Đảm bảo số lượng là số dương
        sizeSelected: { type: String, optional: true }, // Lựa chọn kích thước tùy chọn
       
    }
)

const orderSchema = new Schema({
    userId: { type: ObjectId, ref: 'user' },
    email: { type: String, require: true},
    phonenumber: {type: String, require: true},
    shippingAddress: { type: String, require: true },
    items: [orderDetailSchema],
    totalPrice: { type: Number, default: 0 },
    paymentMethod: { type: String, require: true },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.order || mongoose.model('order', orderSchema)