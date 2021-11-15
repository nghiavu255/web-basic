const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Product = require('../models/Product')
// const { Product } = require('./auth')
const verifyToken = require('../middleware/auth')
// @route GET api/products
// @desc Get products
// @access Private
router.get('/', async (req, res) => {
		console.log(req.query.page)
			var page = parseInt(req.query.page) ||1;//n
            var perPage = 8;
            var start = (page-1)*perPage
            var end = page*perPage
            // products = products.slice(start,end)
	try {
		const products = await Product.find({})
		// const lengthProduct = Lproducts.length
		// products = Lproducts.slice(start,end)
		
		res.json({ success: true, products })
		
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'có lỗi xảy ra không tìm được dữ liệu' })
	}
})


// @router Product api/products/
// @desc create Product
// @access Private
router.post('/',verifyToken,async(req,res) =>{
    const {product,image, description,price,quantity,code} = req.body
    //simple validation
    if(!product)
        return res.status(400).json({success:false, message: 'product is required'})
    try {
        console.log(req.userId,req.role)
        const newProduct = new Product({product,image, description,price,quantity,code,user: req.userId})


        await newProduct.save()

    res.json({success:true, message:'nice',Product: newProduct})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'error'})
    }
})


// @route PUT api/products
// @desc Update Product
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
	const {product, description,price,quantity,code} = req.body

	// Simple validation
	if (!product)
		return res.status(400).json({ success: false, message: 'Chưa có tên sản phẩm' })

	try {
		let updatedProduct = {
			product, description,price,quantity,code
		}

		const ProductUpdateCondition = { _id: req.params.id, user: req.userId }

		updatedProduct = await Product.findOneAndUpdate(
			ProductUpdateCondition,
			updatedProduct,
			{ new: true }
		)

		// User not authorised to update Product or Product not found
		if (!updatedProduct)
			return res.status(401).json({
				success: false,
				message: 'Product not found or user not authorised'
			})

		res.json({
			success: true,
			message: 'Excellent progress!',
			Product: updatedProduct
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route DELETE api/products
// @desc Delete Product
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
	try {
		const ProductDeleteCondition = { _id: req.params.id, user: req.userId }
		const deletedProduct = await Product.findOneAndDelete(ProductDeleteCondition)

		// User not authorised or Product not found
		if (!deletedProduct)
			return res.status(401).json({
				success: false,
				message: 'Product not found or user not authorised'
			})

		res.json({ success: true, Product: deletedProduct })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router