const User = require('../users/users-model')

module.exports = (req, res, next) => {
  if(req.body.username) {
  User.findByUsername(req.body.username).then(user => {
    if (user) {
      req.user = user
      next()
    } else {
      res.status(400).json({message: 'invalid credentials'})
    }
  })
} else {
  next()
}

};
