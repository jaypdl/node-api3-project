const Users = require('../users/users-model')

function logger(req, res, next) {
  console.log(
    `\n**** Logger **** 
    \nRequest Method: ${req.method}
    \nRequest URL: ${req.url}
    \nTimestamp: ${new Date().toUTCString()}
    \n********
    `
  )
  next()
}

async function validateUserId(req, res, next) {
  const { id } = req.params
  try {
    const user = await Users.getById(id)
    if (!user) {
      res.status(404).json({ message: 'user not found' })
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    next(err)
  }
}

function validateUser(req, res, next) {
  console.log(req.body)
  try {
    if (JSON.stringify(req.body) === '{}') {
      res.status(400).json({ message: 'missing user data' })
    } else if (!req.body.name?.toString().trim()) {
      res.status(400).json({ message: 'missing required name field' })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

function validatePost(req, res, next) {
  try {
    if (JSON.stringify(req.body) === '{}') {
      res.status(400).json({ message: 'missing post data' })
    } else if (!req.body.text?.trim() || !req.body.user_id) {
      res
        .status(400)
        .json({ message: 'missing required text or user_id fields' })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}
