var express = require('express');
var router = express.Router();
const productController = require('../../components/product/Controller')
const cartController = require('../../components/cart/Controller')
const orderController = require('../../components/order/Controller')
// http://localhost:3000/api/products
// http://localhost:3000/api/products/get-all
router.get('/get-all', async function (req, res, next) {
    try {
        const products = await productController.getAllProducts()
        return res.status(200).json({ result: true, products })
    } catch (error) {
        return res.status(500).json({ result: false, products: null })
    }
});


// http://localhost:3000/api/products/get-all/:id/detail
router.get('/get-all/:id/detail', async function (req, res, next) {
    try {
        const { id } = req.params
        const productDetail = await productController.getProductById(id);

        if (productDetail) {
            return res.status(200).json({ result: true, productDetail });
        } else {
            return res.status(404).json({ result: false, productDetail: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, productDetail: null });
    }
});

// http://localhost:3000/api/products/search?name=shoe
router.get('/search', async function (req, res, next) {
    try {
        const { name } = req.query
        const products = await productController.searchProduct(name)
        return res.status(200).json({ result: true, products })
    } catch (error) {
        return res.status(500).json({ result: false, products: null })
    }
});

// http://localhost:3000/api/products/cart/addToCart
router.post('/cart/addToCart', async function (req, res, next) {
    try {
        const { userId, productId, sizeSelected } = req.body
        const cartItem = await cartController.addItem(userId, productId, sizeSelected);
        if (cartItem) {
            return res.status(200).json({ result: true, cartItem });
        } else {
            return res.status(404).json({ result: false, cartItem: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, cartItem: null });
    }
});

// http://localhost:3000/api/products/cart/getAllItems/:id
router.get('/cart/getAllItems/:userId', async function (req, res, next) {
    try {
        const { userId } = req.params
        const cart = await cartController.getAllItems(userId);
        if (cart) {
            return res.status(200).json({ result: true, cart });
        } else {
            return res.status(404).json({ result: false, cart: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, cart: null });
    }
});

// http://localhost:3000/api/products/cart/remove
router.delete('/cart/remove', async (req, res) => {
    const { userId, itemId } = req.body;
    // try {
    //     const updatedCart = await cartController.removeItem(userId,itemId);
    //     res.status(200).json(updatedCart);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
    try {
        const updatedCart = await cartController.removeItem(userId, itemId);
        if (updatedCart) {
            return res.status(200).json({ result: true, updatedCart });
        } else {
            return res.status(404).json({ result: true, updatedCart: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, updatedCart: null });
    }
});

// API tăng số lượng sản phẩm
// http://localhost:3000/api/products/cart/increase
router.post('/cart/increase', async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const updatedCart = await cartController.increaseItemQuantity(userId, itemId);
        return res.status(200).json({ result: true, updatedCart });
    } catch (error) {
        return res.status(500).json({ result: false, updatedCart: null });
    }
});

// API giảm số lượng sản phẩm
// http://localhost:3000/api/products/cart/decrease
router.post('/cart/decrease', async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const updatedCart = await cartController.decreaseItemQuantity(userId, itemId);
        return res.status(200).json({ result: true, updatedCart });
    } catch (error) {
        return res.status(500).json({ result: false, updatedCart: null });
    }
});

router.post('/cart/updateTotalPrice', async (req, res) => {
    const { userId, totalPrice, selectedItems } = req.body;
    try {
        const updatedCart = await cartController.updateTotalPrice(userId, totalPrice, selectedItems);
        return res.status(200).json({ result: true, updatedCart });
    } catch (error) {   
        return res.status(500).json({ result: false, error: error.message });
    }
});


router.post('/order', async (req, res) => {
    const { userId, email, phonenumber, shippingAddress, selectedItems, paymentMethod, totalPrice } = req.body;
    try {
        const order = await orderController.createOrder(userId, email, phonenumber, shippingAddress, selectedItems, paymentMethod, totalPrice);
        return res.status(200).json({ result: true, order });
    } catch (error) {
        return res.status(500).json({ result: false,  error: error.message });
    }
});

module.exports = router;