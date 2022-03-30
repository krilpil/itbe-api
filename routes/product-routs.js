import {Router} from "express";
import ProductController from '../controllers/product-controller.js'

const productRouter = new Router()

productRouter.post('/product', ProductController.createProduct)
productRouter.post('/check-product', ProductController.checkProducts)
productRouter.get('/product', ProductController.getProducts)
productRouter.get('/product/:url', ProductController.getOneProduct)
productRouter.put('/product', ProductController.updateProduct)
productRouter.delete('/product/:url', ProductController.deleteProduct)

export default productRouter