import {Router} from "express";
import BrandController from '../controllers/brand-controller.js'

const brandRouter = new Router()

brandRouter.get('/brand', BrandController.getBrands)

export default brandRouter