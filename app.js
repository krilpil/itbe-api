import express from 'express'
import productRouter from './routes/product-routs.js'
import colorRouter from "./routes/color-routs.js";
import brandRouter from "./routes/brand-routs.js";
import morgan from 'morgan'
import cors from 'cors'

var corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
}

const app = express()

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use('/api', productRouter)
app.use('/api', colorRouter)
app.use('/api', brandRouter)

export default app