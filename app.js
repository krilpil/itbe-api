import express from 'express'
import productRouter from './routes/product-routs.js'
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

export default app