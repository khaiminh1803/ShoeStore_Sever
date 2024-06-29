const productService = require('./Service')

const getAllProducts = async (page, size) => {
    try {
        return await productService.getAllProducts()
    } catch (error) {
        console.log('Get all products failed', error);
        throw error;
    }
}

const getProductById = async (id) => {
    try {
        return await productService.getProductById(id)
    } catch (error) {
        console.log('Update product error', error);
    }
}

const searchProduct = async (name) => {
    try {
        return await productService.searchProduct(name)
    } catch (error) {
        console.log('Search product error', error);
    }
    return null
}

const addProduct = async (name, price, description, image, sizes, brand, category) => {
    try {
        console.log('Add params', name, price, description, image, sizes, brand, category);
        await productService.addProduct(name, price, description, image, sizes, brand, category)
    } catch (error) {
        throw error;
    }
}

const deleteProductById = async function (id) {
    try {
        return await productService.deleteProductById(id)
    } catch (error) {
        console.log('Delete product failed', error);
        throw false;
    }
}

const updateProduct = async (id, name, price, description, image, sizes, brand, category) => {
    try {
        return await productService.updateProduct(id, name, price, description, image, sizes, brand, category)
    } catch (error) {
        console.log('Update product error', error);
    }
}

module.exports = {getAllProducts, getProductById, searchProduct, addProduct, deleteProductById, updateProduct}