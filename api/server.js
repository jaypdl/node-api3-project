// IMPORTS
const express = require('express')

// const helmet = require('helmet')


// const cors = require('cors')

const { logger } = require('./middleware/middleware')

const userRouter = require('./users/users-router')

// INSTANCE OF EXPRESS
const server = express()

// MIDDLEWARE
// server.use(helmet()) // securing headers

// remember express by default cannot parse JSON in request bodies
server.use(express.json())

// global middlewares and the user's router need to be connected here
// if (process.env.NODE_ENV === 'development') {
//   const morgan = require('morgan')
//   server.use(morgan('dev'))
//   console.log('development')
// }

// server.use(cors())
server.use(logger) // custom logger middleware

// ROUTES
server.use('/api/users', userRouter)

// OTHER ENDPOINTS
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
})

// EXPORT
module.exports = server
