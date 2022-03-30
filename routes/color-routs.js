import {Router} from "express";
import ColorController from '../controllers/color-controller.js'

const colorRouter = new Router()

colorRouter.get('/color', ColorController.getColors)

export default colorRouter