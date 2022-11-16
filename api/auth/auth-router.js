const router = require('express').Router();
const checkUsernameExists = require('../middleware/checkUsernameExists')
const checkUsernameValid = require('../middleware/checkUsernameValid')
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets')

router.post('/register', checkUsernameExists, (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({message: "username and password required"}
    )
  } else {
    const hash = bcrypt.hashSync(req.body.password, 8)
    req.body.password = hash
    User.insert(req.body).then(user => {
      res.status(200).json(user)
    }).catch(err => {
      next(err)
    })
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login',checkUsernameValid , (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({message: "username and password required"}
    )
  } else {
    const {password} = req.body
    if (bcrypt.compareSync(password, req.user.password)) {
      const token = buildToken(req.user)
      // req.session.user = req.user
      res.json({message:`welcome ${req.user.username}`,
                token})
    } else {
      res.status(401).json({message:'invalid credentials'})
    }
  }

  function buildToken(user) {
    const payload = {
      subject: user.id,
      username: user.username
    }
    const options = {expiresIn: "1d"}
    
    return jwt.sign(payload, JWT_SECRET, options)
  }
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(500).json({
      message: err.message,
      customMessage: "Something went wrong in the auth router",
      stack: err.stack
  })
})

module.exports = router;
