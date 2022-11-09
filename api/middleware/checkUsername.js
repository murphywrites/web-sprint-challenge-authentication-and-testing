const User = require('../users/users-model')

module.exports = (req, res, next) => {
  User.findByUsername(req.body.username).then(user => {
    if (!user) {
      next()
    } else {
      res.status(422).json({message: 'username taken'})
    }
  })
};
