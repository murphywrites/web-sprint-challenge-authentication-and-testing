const User = require('../users/users-model')

module.exports = (req, res, next) => {
  User.findByUsername(req.body.username).then(user => {
    if (user) {
      req.user = user
      next()
    } else {
      res.status(400).json({message: 'invalid credentials'})
    }
  })
};
