
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

const cartSchema = new Schema({
    // id: { type: ObjectId }, // khóa chính
    userId: { type: ObjectId, ref: 'user' },
    items: [orderDetailSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// const cartSchema = new Schema({
//     id: { type: ObjectId }, // khóa chính
//     userId: { type: ObjectId, ref: 'user' },
//     items: [{
//         product: { type: ObjectId, ref: 'product', required: true }, // Tham chiếu sản phẩm bắt buộc
//         quantity: { type: Number, default: 1, min: 1 }, // Đảm bảo số lượng là số dương
//         sizeSelected: { type: String, optional: true }, // Lựa chọn kích thước tùy chọn
//         isChecked: { type: Boolean, default: false }
//     }],
//     totalPrice: { type: Number, default: 0 },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// });



module.exports = mongoose.models.cart || mongoose.model('cart', cartSchema)
