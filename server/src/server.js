const express = require('express')
const env = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const config = require('./config/key')
const path = require('path')
const cors = require('cors')

//NOTE Routes
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const initialDataRoutes = require('./routes/admin/initialData')
const pageRoutes = require('./routes/admin/page')

//NOTE Variables
env.config()

//NOTE Mongoose Connection
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('Database is connected'))
    .catch((err) => console.log(err))

//NOTE Middleware

app.use(cors())
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/api', authRoutes)
app.use('/api', adminRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', initialDataRoutes)
app.use('/api', pageRoutes)

//NOTE Server Port
const port = process.env.PORT || 3333

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
