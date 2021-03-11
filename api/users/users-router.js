const express = require('express')
// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// The middleware functions also need to be required
const {
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware')

const router = express.Router()

//! BASE ROUTE /api/users

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    // throw new Error('BAM')
    const users = await Users.get()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
})

router.post('/', validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const user = await Users.insert(req.body)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params
  try {
    await Users.update(id, req.body)
    res.json({ id, ...req.body })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params
  try {
    await Users.remove(id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params
  try {
    const posts = await Users.getUserPosts(id)
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

router.post(
  '/:id/posts',
  validateUserId,
  validatePost,
  async (req, res, next) => {
    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
    console.log('hello')
    try {
      const newPost = await Posts.insert(req.body)
      res.status(201).json(newPost)
    } catch (err) {
      next(err)
    }
  }
)

// ERROR CATCHER
// eslint-disable-next-line
router.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message, //! DEV
    stack: err.stack, //! DEV
    custom: 'There has been an API server issue! ☹'
  })
})

// do not forget to export the router
module.exports = router
