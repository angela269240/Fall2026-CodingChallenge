require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')
const collectionRoutes = require('./routes/collections')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Curate API is running'
  })
})

app.use('/api/collections', collectionRoutes)

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})